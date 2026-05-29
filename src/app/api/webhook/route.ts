import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

async function grantCourseAccess(userId: string, courseSlug: string) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, isBundle: true, bundleIncludes: true },
  })
  if (!course) return

  const slugsToGrant = [courseSlug, ...(course.isBundle ? course.bundleIncludes : [])]
  const courses = await prisma.course.findMany({
    where: { slug: { in: slugsToGrant } },
    select: { id: true },
  })

  await Promise.all(
    courses.map((c) =>
      prisma.userCourseAccess.upsert({
        where: { userId_courseId: { userId, courseId: c.id } },
        create: { userId, courseId: c.id },
        update: {},
      })
    )
  )
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_TO_LESSONS: Record<string, number> = {
  [process.env.STRIPE_FOURLESSONS_PRICE_ID!]: 4,
  [process.env.STRIPE_EIGHTLESSONS_PRICE_ID!]: 8,
  [process.env.STRIPE_TWELVELESSONS_PRICE_ID!]: 12,
}

const TRIAL_PRICE_ID = process.env.STRIPE_TRIAL_PRICE_ID!
const ADDITIONAL_LESSON_PRICE_ID = process.env.STRIPE_ADDITIONAL_LESSON_PRICE_ID!

const MENTORSHIP_PRICE_TO_SESSIONS: Record<string, number> = {
  [process.env.STRIPE_MENTORSHIP_SINGLE_PRICE_ID!]: 1,
  [process.env.STRIPE_MENTORSHIP_DOUBLE_PRICE_ID!]: 2,
  [process.env.STRIPE_MENTORSHIP_TRIPLE_PRICE_ID!]: 3,
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      try {
        const session = event.data.object as Stripe.Checkout.Session
        let userId = session.metadata?.userId

        // Fall back to email lookup (e.g. manual Stripe payment links)
        if (!userId) {
          const email = session.customer_details?.email ?? session.customer_email
          if (email) {
            const found = await prisma.user.findUnique({ where: { email }, select: { id: true } })
            if (found) {
              userId = found.id
              console.log('Webhook: resolved userId from email', { email, userId })
            }
          }
        }

        if (!userId) {
          console.error('Webhook checkout.session.completed: could not resolve userId', { sessionId: session.id })
          break
        }

        // One-time payment (trial or mentorship)
        if (session.mode === 'payment') {
          // Read priceId from metadata (set at checkout creation) — avoids an extra Stripe API call
          const priceId = session.metadata?.priceId
          const qty = Number(session.metadata?.quantity ?? '1') || 1

          console.log('Webhook payment:', { sessionId: session.id, userId, priceId, qty })

          if (priceId === ADDITIONAL_LESSON_PRICE_ID) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                allowance: { increment: qty },
                stripeCustomerId: session.customer as string ?? undefined,
              },
            })
            console.log('Webhook: additional lessons credited', { userId, qty })
          } else if (priceId === TRIAL_PRICE_ID) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                allowance: { increment: 1 },
                trialPurchased: true,
                stripeCustomerId: session.customer as string ?? undefined,
              },
            })
          } else if (priceId && priceId in MENTORSHIP_PRICE_TO_SESSIONS) {
            const sessions = MENTORSHIP_PRICE_TO_SESSIONS[priceId]
            await prisma.user.update({
              where: { id: userId },
              data: {
                allowance: { increment: sessions },
                stripeCustomerId: session.customer as string ?? undefined,
              },
            })
            console.log('Webhook: mentorship allowance incremented', { userId, sessions })
          } else if (session.metadata?.courseSlug) {
            await grantCourseAccess(userId, session.metadata.courseSlug)
            console.log('Webhook: course access granted', { userId, courseSlug: session.metadata.courseSlug })
          } else {
            console.warn('Webhook: unrecognised payment priceId', { priceId, userId })
          }
          break
        }

        // Subscription payment — increment so existing unused lessons are preserved
        const priceId = session.metadata?.priceId
        const lessons = PRICE_TO_LESSONS[priceId ?? ''] ?? 0

        await prisma.user.update({
          where: { id: userId },
          data: {
            allowance: { increment: lessons },
            stripeCustomerId: session.customer as string ?? undefined,
            stripeSubscriptionId: session.subscription as string,
          },
        })
      } catch (err: any) {
        console.error('Webhook checkout.session.completed error:', err.message)
        return NextResponse.json({ error: 'Processing error' }, { status: 500 })
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const inv = invoice as any

      // Skip the first invoice — already handled by checkout.session.completed
      // Only reset allowance on renewals (subscription_cycle)
      if (inv.billing_reason !== 'subscription_cycle') break

      // Newer Stripe API moved subscription off the top-level Invoice
      const subId =
        inv.subscription ??
        inv.parent?.subscription_details?.subscription
      if (!subId) {
        console.warn('Webhook invoice.paid: could not resolve subscription id', { invoiceId: invoice.id })
        break
      }

      // Newer Stripe API moved price off InvoiceLineItem into pricing.price_details
      const line0 = inv.lines?.data?.[0]
      const priceId = line0?.pricing?.price_details?.price ?? line0?.price?.id
      const lessons = PRICE_TO_LESSONS[priceId ?? ''] ?? 0
      if (!lessons) {
        console.warn('Webhook invoice.paid: unrecognised priceId, skipping to avoid wiping allowance', { priceId, subId })
        break
      }

      const customerId = invoice.customer as string
      const result = await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { allowance: lessons },
      })
      if (result.count === 0) {
        console.warn('Webhook invoice.paid: no user matched stripeCustomerId', { customerId, subId })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { allowance: 0, stripeSubscriptionId: null },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
