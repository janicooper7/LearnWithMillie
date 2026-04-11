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
  await fetch(`https://api.cal.com/v1/bookings/${bookingUid}/cancel`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CAL_API_KEY}`,
    },
    body: JSON.stringify({ reason: 'Insufficient lesson credits.' }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-cal-signature-256') ?? ''

    if (process.env.CAL_WEBHOOK_SECRET && signature) {
      const valid = verifySignature(body, signature, process.env.CAL_WEBHOOK_SECRET)
      if (!valid) {
        console.error('[cal-webhook] Invalid signature. Received:', signature)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body)
    const { triggerEvent, payload } = event

    // Respond OK to ping/test events
    if (!triggerEvent || triggerEvent === 'PING') {
      return NextResponse.json({ received: true, action: 'ping ok' })
    }

    const attendeeEmail = payload?.attendees?.[0]?.email as string | undefined
    if (!attendeeEmail) return NextResponse.json({ received: true })

    const user = await prisma.user.findUnique({
      where: { email: attendeeEmail },
      select: { id: true, allowance: true },
    })

    if (!user) return NextResponse.json({ received: true })

    if (triggerEvent === 'BOOKING_CREATED') {
      if (user.allowance <= 0) {
        await cancelCalBooking(payload.uid)
        return NextResponse.json({ received: true, action: 'cancelled — no credits' })
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { allowance: { decrement: 1 } },
      })

      return NextResponse.json({ received: true, action: 'credit deducted' })
    }

    if (triggerEvent === 'BOOKING_CANCELLED') {
      // Don't refund if this was our own auto-cancellation for 0 credits
      const reason: string = payload?.cancellationReason ?? payload?.reason ?? ''
      if (reason === 'Insufficient lesson credits.') {
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
