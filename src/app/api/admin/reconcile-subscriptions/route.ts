import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Stripe is the source of truth for whether a plan is still live. Our
// stripeSubscriptionId is only cleared by the customer.subscription.deleted
// webhook, so a missed delivery — or a cancellation made straight in the Stripe
// dashboard — leaves a student looking subscribed forever, keeping their monthly
// allowance. This re-checks every stored subscription against Stripe.
const DEAD_STATUSES = ['canceled', 'incomplete_expired', 'unpaid']

export async function POST() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only a stored id can be stale — a user with none is already correct.
  const candidates = await prisma.user.findMany({
    where: { stripeSubscriptionId: { not: null } },
    select: { id: true, email: true, allowance: true, stripeSubscriptionId: true },
  })

  let updated = 0
  let skipped = 0
  const changes: { email: string; status: string; allowanceFrom: number }[] = []

  for (const u of candidates) {
    let status: string
    try {
      const sub = await stripe.subscriptions.retrieve(u.stripeSubscriptionId!)
      status = sub.status
    } catch (err: any) {
      // A subscription Stripe has never heard of is genuinely gone; anything
      // else (rate limit, outage) is skipped rather than risk wiping a payer.
      if (err?.code === 'resource_missing') {
        status = 'canceled'
      } else {
        console.error('[reconcile-subscriptions] Stripe error for', u.email, err?.message)
        skipped++
        continue
      }
    }

    if (!DEAD_STATUSES.includes(status)) continue

    // Same clean-up the customer.subscription.deleted webhook would have done.
    await prisma.user.update({
      where: { id: u.id },
      data: { allowance: 0, stripeSubscriptionId: null },
    })
    changes.push({ email: u.email, status, allowanceFrom: u.allowance })
    updated++
  }

  return NextResponse.json({ checked: candidates.length, updated, skipped, changes })
}
