import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { finalizePlatformFinderResult } from '@/lib/platformFinderResult'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Loads a paid Platform Finder result by its shareable id. If the row isn't
// marked paid yet (webhook lag), we reconcile directly with Stripe so the
// buyer sees results the instant they return — and this doubles as the email
// fallback in environments where the webhook isn't wired up.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ found: false, error: 'Missing id' }, { status: 400 })
  }

  const row = await prisma.platformFinderResult.findUnique({ where: { id } })
  if (!row) {
    return NextResponse.json({ found: false }, { status: 404 })
  }

  if (row.paid) {
    return NextResponse.json({ found: true, paid: true, answers: row.answers })
  }

  // Not marked paid yet — check Stripe directly.
  if (row.stripeSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(row.stripeSessionId)
      if (session.payment_status === 'paid') {
        const email = session.customer_details?.email ?? session.customer_email ?? null
        await finalizePlatformFinderResult(id, email)
        return NextResponse.json({ found: true, paid: true, answers: row.answers })
      }
    } catch (err: any) {
      console.error('Platform Finder result reconcile error:', err.message)
    }
  }

  return NextResponse.json({ found: true, paid: false })
}
