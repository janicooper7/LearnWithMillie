import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'
import { trackingMetadata } from '@/lib/trackingServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const COURSE_PLAN_SLUGS = new Set(['get-ready', 'get-booked', 'stay-booked', 'course-full'])

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan, quantity = 1, promoCode, tracking } = await req.json()

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

  try {
    type DiscountEntry = { promotion_code: string } | { coupon: string }
    let discount: DiscountEntry | null = null

    if (promoCode?.trim()) {
      const codes = await stripe.promotionCodes.list({ code: promoCode.trim(), active: true, limit: 1 })
      if (codes.data.length === 0) {
        return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 400 })
      }
      discount = { promotion_code: codes.data[0].id }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: qty }],
      success_url: `${process.env.NEXTAUTH_URL}/thank-you`,
      cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
      ...(discount
        ? { discounts: [discount] }
        : { allow_promotion_codes: true }),
      ...(session?.user?.email && { customer_email: session.user.email }),
      metadata: {
        userId: session?.user?.id ?? '',
        priceId,
        quantity: String(qty),
        ...(COURSE_PLAN_SLUGS.has(plan) && { courseSlug: plan }),
        // Carried through so the webhook can attribute the purchase back to the
        // visit that started it — Stripe is the only thread between the two.
        ...trackingMetadata(tracking, COURSE_PLAN_SLUGS.has(plan) ? 'courses' : 'lessons'),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
