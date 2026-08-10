import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { trackingMetadata } from '@/lib/trackingServer'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// $7 one-time payment → lifetime access to the Debate Generator.
// Any signed-in account (teacher or student) can buy.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tracking } = await req.json().catch(() => ({ tracking: null }))

  // Don't let someone who already owns it pay twice.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { debateAccess: true },
  })
  if (user?.debateAccess) {
    return NextResponse.json({ error: 'Already purchased', alreadyOwned: true }, { status: 400 })
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 700,
            product_data: {
              name: 'Debate Generator — lifetime access',
              description:
                'Unlimited access to the ESL Debate Generator: thought-provoking debate topics and vocabulary for your lessons.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/teachers/debategenerator?purchased=1`,
      cancel_url: `${baseUrl}/teachers/debategenerator?canceled=1`,
      allow_promotion_codes: true,
      ...(session.user.email && { customer_email: session.user.email }),
      metadata: {
        kind: 'debate-generator',
        userId: session.user.id,
        ...trackingMetadata(tracking, 'debate'),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Debate Generator checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
