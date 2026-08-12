import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// What a completed checkout was actually charged, read by /thank-you so the Meta
// Purchase pixel reports a real amount. It has to come from Stripe rather than the
// plan's list price because promo codes (SAVE25 and friends) make list price wrong,
// and a pixel that overstates revenue teaches Meta to bid for the wrong customers.
//
// The sale itself is still recorded by the Stripe webhook — this is read-only.
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const checkout = await stripe.checkout.sessions.retrieve(id)

    // A guessed or borrowed session id must never report someone else's order.
    if (checkout.metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (checkout.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Not paid' }, { status: 409 })
    }

    return NextResponse.json({
      value: (checkout.amount_total ?? 0) / 100,
      currency: (checkout.currency ?? 'usd').toUpperCase(),
    })
  } catch (err: any) {
    console.error('Checkout session lookup error:', err.message)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
