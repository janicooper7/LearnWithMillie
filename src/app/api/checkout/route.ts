import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'
import { trackingMetadata } from '@/lib/trackingServer'
import { TRILOGY_OFFER, TRILOGY_INSTALLMENT_PLAN, trilogyInstallmentAmount } from '@/lib/trilogyOffer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const COURSE_PLAN_SLUGS = new Set(['get-ready', 'get-booked', 'stay-booked', 'course-full'])

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan, quantity = 1, promoCode, tracking } = await req.json()

  // Trilogy pay-in-3: a bespoke Checkout Session rather than a fixed Stripe
  // price, so it can't go through the price-id lookups below. Access is
  // granted on the first charge like any other course purchase — this app has
  // no "revoke access" path, so a later missed installment doesn't touch it.
  // The webhook sets subscription_data.cancel_at once the subscription exists
  // (Checkout Sessions can't set cancel_at up front) so it stops at 3 charges.
  if (plan === TRILOGY_INSTALLMENT_PLAN) {
    try {
      const bundlePrice = await stripe.prices.retrieve(process.env.STRIPE_COURSE_BUNDLE!)

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: bundlePrice.product as string,
              unit_amount: Math.round(trilogyInstallmentAmount() * 100),
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: { userId: session.user.id, kind: 'course-installment', courseSlug: 'course-full' },
        },
        success_url: `${process.env.NEXTAUTH_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
        ...(session.user.email && { customer_email: session.user.email }),
        metadata: {
          userId: session.user.id,
          kind: 'course-installment',
          courseSlug: 'course-full',
          ...trackingMetadata(tracking, 'courses'),
        },
      })

      return NextResponse.json({ url: checkoutSession.url })
    } catch (err: any) {
      console.error('Checkout error (installment):', err.message)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  // Read at request time so env vars added after server start are always picked up
  const SUBSCRIPTION_PRICE_IDS: Record<string, string> = {
    four:   process.env.STRIPE_FOURLESSONS_PRICE_ID!,
    eight:  process.env.STRIPE_EIGHTLESSONS_PRICE_ID!,
    twelve: process.env.STRIPE_TWELVELESSONS_PRICE_ID!,
  }

  const ONE_TIME_PRICE_IDS: Record<string, string> = {
    trial:                process.env.STRIPE_TRIAL_PRICE_ID!,
    'mentorship-single':  process.env.STRIPE_MENTORSHIP_SINGLE_PRICE_ID!,
    'mentorship-double':  process.env.STRIPE_MENTORSHIP_DOUBLE_PRICE_ID!,
    'mentorship-triple':  process.env.STRIPE_MENTORSHIP_TRIPLE_PRICE_ID!,
    'additional-lessons': process.env.STRIPE_ADDITIONAL_LESSON_PRICE_ID!,
    'get-ready':          process.env.STRIPE_COURSE_ONE!,
    'get-booked':         process.env.STRIPE_COURSE_TWO!,
    'stay-booked':        process.env.STRIPE_COURSE_THREE!,
    'course-full':        process.env.STRIPE_COURSE_BUNDLE!,
  }

  const isOneTime = plan in ONE_TIME_PRICE_IDS
  const priceId = isOneTime ? ONE_TIME_PRICE_IDS[plan] : SUBSCRIPTION_PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const qty = plan === 'additional-lessons' ? Math.max(1, Math.min(20, Number(quantity))) : 1
  const isCourse = COURSE_PLAN_SLUGS.has(plan)

  try {
    type DiscountEntry = { promotion_code: string } | { coupon: string }
    let discount: DiscountEntry | null = null

    // A code the customer typed wins. Otherwise, while the trilogy sale is on,
    // trilogy checkouts carry the sale code themselves so Stripe opens at the
    // price the page advertised. Everything else gets list price.
    const typedCode = promoCode?.trim()
    const wantedCode =
      typedCode || (TRILOGY_OFFER.enabled && plan === TRILOGY_OFFER.plan ? TRILOGY_OFFER.code : '')

    if (wantedCode) {
      const codes = await stripe.promotionCodes.list({ code: wantedCode, active: true, limit: 1 })
      if (codes.data.length > 0) {
        discount = { promotion_code: codes.data[0].id }
      } else if (typedCode) {
        // A code the customer typed is worth an error. The automatic sale code
        // isn't — fall back to full price with the promo box open.
        return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 400 })
      } else {
        console.error(`Trilogy sale code ${wantedCode} is not active in Stripe`)
      }
    }

    const buildSession = (withDiscount: DiscountEntry | null) =>
      stripe.checkout.sessions.create({
        mode: isOneTime ? 'payment' : 'subscription',
        line_items: [{ price: priceId, quantity: qty }],
        // Charge in the dollars the site advertises, not the visitor's local currency.
        // `currency` also pins prices that carry extra currency options (the bundle has GBP).
        currency: 'usd',
        adaptive_pricing: { enabled: false },
        // The session id lets /thank-you report the real charged amount to the Meta
        // pixel, and doubles as the key that stops a refresh counting a second sale.
        success_url: `${process.env.NEXTAUTH_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
        ...(withDiscount ? { discounts: [withDiscount] } : { allow_promotion_codes: true }),
        ...(session?.user?.email && { customer_email: session.user.email }),
        metadata: {
          userId: session?.user?.id ?? '',
          priceId,
          quantity: String(qty),
          ...(isCourse && { courseSlug: plan }),
          // Carried through so the webhook can attribute the purchase back to the
          // visit that started it — Stripe is the only thread between the two.
          ...trackingMetadata(tracking, isCourse ? 'courses' : 'lessons'),
        },
      })

    let checkoutSession
    try {
      checkoutSession = await buildSession(discount)
    } catch (err) {
      // A restriction on the auto-applied sale code must never dead-end
      // checkout — retry at full price instead.
      if (!discount || typedCode) throw err
      console.error('Trilogy sale code rejected by Stripe, retrying without it:', (err as Error).message)
      checkoutSession = await buildSession(null)
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
