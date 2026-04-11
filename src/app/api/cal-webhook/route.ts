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
  const body = await req.text()
  const signature = req.headers.get('x-cal-signature-256') ?? ''

  if (process.env.CAL_WEBHOOK_SECRET) {
    const valid = verifySignature(body, signature, process.env.CAL_WEBHOOK_SECRET)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const event = JSON.parse(body)
  const { triggerEvent, payload } = event

  const attendeeEmail = payload?.attendees?.[0]?.email as string | undefined
  if (!attendeeEmail) return NextResponse.json({ received: true })

  const user = await prisma.user.findUnique({
    where: { email: attendeeEmail },
    select: { id: true, allowance: true },
  })

  if (!user) return NextResponse.json({ received: true })

  if (triggerEvent === 'BOOKING_CREATED') {
    if (user.allowance <= 0) {
      // No credits — cancel the booking automatically
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
    const lessonStart = new Date(payload.startTime)
    const now = new Date()
    const hoursUntilLesson = (lessonStart.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilLesson >= 24) {
      // More than 24h away — refund the credit
      await prisma.user.update({
        where: { id: user.id },
        data: { allowance: { increment: 1 } },
      })
      return NextResponse.json({ received: true, action: 'credit refunded' })
    }

    // Within 24h — no refund
    return NextResponse.json({ received: true, action: 'no refund — within 24h' })
  }

  return NextResponse.json({ received: true })
}
