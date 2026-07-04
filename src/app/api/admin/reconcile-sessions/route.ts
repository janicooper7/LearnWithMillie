import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Cal.com is the source of truth for how many future sessions a user actually has.
// The `upcomingLessons` counter drifts upward whenever Cal fails to send a
// BOOKING_COMPLETED event (its least reliable trigger), which leaves teachers
// stuck as "Active" long after they've used their mentorship sessions. This
// reconciles the counter against Cal's real upcoming-booking count.
async function getUpcomingCount(email: string): Promise<number | null> {
  const url = new URL('https://api.cal.com/v2/bookings')
  url.searchParams.set('attendeeEmail', email)
  url.searchParams.set('status', 'upcoming')
  url.searchParams.set('take', '100')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.CAL_API_KEY}`,
      // GET /v2/bookings pins this version (the cancel endpoint uses 2024-08-13).
      'cal-api-version': '2026-05-01',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('[reconcile-sessions] Cal API error for', email, res.status, await res.text())
    return null
  }

  const data = await res.json()
  const bookings = data?.data
  return Array.isArray(bookings) ? bookings.length : 0
}

export async function POST() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // A stuck counter is always too high (a missed BOOKING_COMPLETED never
  // decrements), so only users with upcomingLessons > 0 can be wrong — no need
  // to hit Cal for everyone.
  const candidates = await prisma.user.findMany({
    where: { upcomingLessons: { gt: 0 } },
    select: { id: true, email: true, upcomingLessons: true },
  })

  let updated = 0
  let skipped = 0
  const changes: { email: string; from: number; to: number }[] = []

  for (const u of candidates) {
    const actual = await getUpcomingCount(u.email)
    if (actual === null) {
      // Cal error — skip rather than risk wiping a valid counter.
      skipped++
      continue
    }
    if (actual !== u.upcomingLessons) {
      await prisma.user.update({
        where: { id: u.id },
        data: { upcomingLessons: actual },
      })
      changes.push({ email: u.email, from: u.upcomingLessons, to: actual })
      updated++
    }
  }

  return NextResponse.json({ checked: candidates.length, updated, skipped, changes })
}
