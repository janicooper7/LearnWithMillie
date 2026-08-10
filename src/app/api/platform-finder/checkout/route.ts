import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { profileFromAnswers } from '@/app/teachers/platform-finder/platforms'
import { trackingMetadata } from '@/lib/trackingServer'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// URL-safe, unguessable access token used as the shareable results id.
function newResultId(): string {
  return randomBytes(9).toString('base64url') // 12 chars
}

// Guest checkout — no auth. We persist the answers under a unique id up front,
// then Stripe redirects back to /teachers/platform-finder?id=<id>, which is the
// customer's permanent access link (also emailed to them after payment).
export async function POST(req: NextRequest) {
  const { answers, tracking } = await req.json().catch(() => ({ answers: null, tracking: null }))

  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 })
  }
  // Reject junk early so we never sell an empty report.
  if (!profileFromAnswers(answers)) {
    return NextResponse.json({ error: 'Incomplete answers' }, { status: 400 })
  }

  const id = newResultId()
  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 500,
            product_data: {
              name: 'Platform Finder — your personalised teaching-platform matches',
              description:
                'Unlock your ranked list of online English teaching platforms that actually hire teachers like you.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/teachers/platform-finder?id=${id}`,
      cancel_url: `${baseUrl}/teachers/platform-finder?canceled=1`,
      allow_promotion_codes: true,
      metadata: {
        kind: 'platform-finder',
        resultId: id,
        ...trackingMetadata(tracking, 'platform-finder'),
      },
    })

    await prisma.platformFinderResult.create({
      data: {
        id,
        answers,
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Platform Finder checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
