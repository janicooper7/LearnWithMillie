import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const SUBSCRIPTION_PRICE_IDS: Record<string, string> = {
  four: process.env.STRIPE_FOURLESSONS_PRICE_ID!,
  eight: process.env.STRIPE_EIGHTLESSONS_PRICE_ID!,
  twelve: process.env.STRIPE_TWELVELESSONS_PRICE_ID!,
}

const ONE_TIME_PRICE_IDS: Record<string, string> = {
  trial: process.env.STRIPE_TRIAL_PRICE_ID!,
  'mentorship-single': process.env.STRIPE_MENTORSHIP_SINGLE_PRICE_ID!,
  'mentorship-double': process.env.STRIPE_MENTORSHIP_DOUBLE_PRICE_ID!,
  'mentorship-triple': process.env.STRIPE_MENTORSHIP_TRIPLE_PRICE_ID!,
  'additional-lessons': process.env.STRIPE_ADDITIONAL_LESSON_PRICE_ID!,
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan, quantity = 1, promoCode } = await req.json()

  const isOneTime = plan in ONE_TIME_PRICE_IDS
  const priceId = isOneTime ? ONE_TIME_PRICE_IDS[plan] : SUBSCRIPTION_PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const qty = plan === 'additional-lessons' ? Math.max(1, Math.min(20, Number(quantity))) : 1

  // Resolve promo code to a Stripe promotion code ID if provided
  let resolvedPromoId: string | null = null
  if (promoCode?.trim()) {
    const codes = await stripe.promotionCodes.list({ code: promoCode.trim(), active: true, limit: 1 })
    if (codes.data.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 400 })
    }
    resolvedPromoId = codes.data[0].id
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: qty }],
      success_url: `${process.env.NEXTAUTH_URL}/thank-you`,
      cancel_url: `${process.env.NEXTAUTH_URL}/#pricing`,
      // If a promo code was supplied apply it directly; otherwise let user enter one on Stripe's page
      ...(resolvedPromoId
        ? { discounts: [{ promotion_code: resolvedPromoId }] }
        : { allow_promotion_codes: true }),
      ...(session?.user?.email && { customer_email: session.user.email }),
      metadata: { userId: session?.user?.id ?? '' },
    })
    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Stripe error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
