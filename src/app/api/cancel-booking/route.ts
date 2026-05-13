import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { uid } = await req.json()
  if (!uid) return NextResponse.json({ error: 'Missing booking uid' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Verify the booking actually belongs to this user before cancelling
  const verifyRes = await fetch(`https://api.cal.com/v2/bookings/${uid}`, {
    headers: {
      'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
      'cal-api-version': '2024-08-13',
    },
  })

  if (!verifyRes.ok) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const verifyData = await verifyRes.json()
  const booking = verifyData.data
  const isAttendee = booking?.attendees?.some(
    (a: { email: string }) => a.email.toLowerCase() === user.email?.toLowerCase()
  )
  if (!isAttendee) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const cancelRes = await fetch(`https://api.cal.com/v2/bookings/${uid}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
      'cal-api-version': '2024-08-13',
    },
    body: JSON.stringify({ cancellationReason: 'Cancelled by attendee.' }),
  })

  if (!cancelRes.ok) {
    const text = await cancelRes.text()
    console.error('[cancel-booking] Cal.com error:', cancelRes.status, text)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
