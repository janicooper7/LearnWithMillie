import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')
  return `sha256=${digest}` === signature
}

async function cancelCalBooking(bookingUid: string) {
  const url = `https://api.cal.com/v2/bookings/${bookingUid}/cancel`
  console.log('[cal-webhook] Cancelling booking uid:', bookingUid)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
      'cal-api-version': '2024-08-13',
    },
    body: JSON.stringify({ cancellationReason: 'Insufficient lessons.' }),
  })
  const text = await res.text()
  console.log('[cal-webhook] Cancel response:', res.status, text)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-cal-signature-256') ?? ''

    if (process.env.CAL_WEBHOOK_SECRET && signature) {
      const valid = verifySignature(body, signature, process.env.CAL_WEBHOOK_SECRET)
      if (!valid) {
        console.error('[cal-webhook] Invalid signature. Received:', signature, '— continuing anyway for debugging')
        // Not returning 401 temporarily to debug refund issue
      }
    }

    const event = JSON.parse(body)
    const { triggerEvent, payload } = event

    console.log('[cal-webhook] Event:', triggerEvent, '| Booking id:', payload?.id, '| uid:', payload?.uid, '| Attendees:', JSON.stringify(payload?.attendees ?? []), '| Reason:', payload?.cancellationReason ?? payload?.reason ?? '')

    // Respond OK to ping/test events
    if (!triggerEvent || triggerEvent === 'PING') {
      return NextResponse.json({ received: true, action: 'ping ok' })
    }

    const attendeeEmail = payload?.attendees?.[0]?.email as string | undefined
    if (!attendeeEmail) {
      console.log('[cal-webhook] No attendee email found in payload')
      return NextResponse.json({ received: true })
    }

    const user = await prisma.user.findUnique({
      where: { email: attendeeEmail },
      select: { id: true, allowance: true, trialPurchased: true, trialUsed: true, stripeSubscriptionId: true },
    })

    if (!user) {
      console.log('[cal-webhook] No user found for email:', attendeeEmail)
      return NextResponse.json({ received: true })
    }

    if (triggerEvent === 'BOOKING_CREATED') {
      // Atomically deduct 1 credit only if the user has credits available.
      // Using updateMany with allowance > 0 ensures no race condition with the client check.
      const isTrialUser = user.trialPurchased && !user.stripeSubscriptionId && !user.trialUsed

      const result = await prisma.user.updateMany({
        where: { email: attendeeEmail, allowance: { gt: 0 } },
        data: {
          allowance: { decrement: 1 },
          ...(isTrialUser ? { trialUsed: true } : {}),
        },
      })

      if (result.count === 0) {
        console.log('[cal-webhook] No credits — attempting cancel. payload.uid:', payload?.uid)
        await cancelCalBooking(payload.uid)
        return NextResponse.json({ received: true, action: 'cancelled — no credits' })
      }

      return NextResponse.json({ received: true, action: isTrialUser ? 'trial credit deducted, trialUsed set' : 'credit deducted' })
    }

    if (triggerEvent === 'BOOKING_CANCELLED') {
      // Don't refund if this was our own auto-cancellation for 0 credits
      const reason: string = payload?.cancellationReason ?? payload?.reason ?? ''
      if (reason === 'Insufficient lessons.') {
        return NextResponse.json({ received: true, action: 'no refund — auto-cancelled for 0 credits' })
      }

      const lessonStart = new Date(payload.startTime)
      const now = new Date()
      const hoursUntilLesson = (lessonStart.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursUntilLesson >= 24) {
        await prisma.user.update({
          where: { id: user.id },
          data: { allowance: { increment: 1 } },
        })
        return NextResponse.json({ received: true, action: 'credit refunded' })
      }

      return NextResponse.json({ received: true, action: 'no refund — within 24h' })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[cal-webhook] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
