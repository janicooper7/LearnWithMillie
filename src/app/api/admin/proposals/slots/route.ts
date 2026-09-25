import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CalError, type CalEventType, findEventType, getSlots, listEventTypes } from '@/lib/cal'
import { MIN_LEAD_MS, TEACHING_TZ } from '@/lib/sessionProposals'

export const dynamic = 'force-dynamic'

/**
 * What is free on Millie's calendar, for the propose form.
 *
 * Deliberately the same source the student embed draws from, so a time offered
 * on the admin form is a time that was genuinely bookable a second ago. It can
 * still be taken between the form being drawn and the booking being made —
 * that race is unavoidable and is handled where it lands, in createProposal.
 */

// Two months of availability is roughly 150 slots across 40 days — about 7KB
// of JSON, which Cal answers quickly and comfortably fits one request. The cap
// sits a little above the window the form asks for so a timezone straddling a
// day boundary can't push a legitimate request over it.
const MAX_RANGE_DAYS = 70

/**
 * An event type whose free slots are also free slots for `target`, but which
 * Cal will list at shorter notice.
 *
 * Cal hides every slot inside an event type's minimum booking notice (12 hours
 * for lessons), and its slots API has no way to ask it not to. Millie can book
 * inside that window — createBooking bypasses it for her — so the form needs
 * those times too. Another type on the same schedule, with the same buffers
 * and at least as long a session, has the same free time; where it is free for
 * 50 minutes, a 50- or 20-minute session fits.
 */
function shorterNoticeDonor(target: CalEventType, all: CalEventType[]): CalEventType | null {
  return (
    all
      .filter(
        (t) =>
          t.id !== target.id &&
          t.minimumBookingNotice < target.minimumBookingNotice &&
          t.scheduleId === target.scheduleId &&
          t.beforeEventBuffer === target.beforeEventBuffer &&
          t.afterEventBuffer === target.afterEventBuffer &&
          t.lengthInMinutes >= target.lengthInMinutes
      )
      .sort((a, b) => a.minimumBookingNotice - b.minimumBookingNotice)[0] ?? null
  )
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const params = req.nextUrl.searchParams
  const slug = params.get('eventTypeSlug')
  const startParam = params.get('start')
  const endParam = params.get('end')

  if (!slug || !startParam || !endParam) {
    return NextResponse.json({ error: 'Missing eventTypeSlug, start or end' }, { status: 400 })
  }

  const start = new Date(startParam)
  const end = new Date(endParam)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  const rangeDays = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
  if (rangeDays > MAX_RANGE_DAYS) {
    return NextResponse.json({ error: 'Range too wide' }, { status: 400 })
  }

  // Cal will happily return slots in the past for a range that starts before
  // now; nothing bookable lives there, so the window never opens earlier.
  const now = Date.now()
  const from = start.getTime() < now ? new Date(now) : start

  try {
    const eventType = await findEventType(slug)
    if (!eventType) return NextResponse.json({ error: 'Unknown session type' }, { status: 404 })

    // Grouped by UK calendar day, because UK time is the only clock this
    // feature works in (see TEACHING_TZ).
    const slots = await getSlots({
      eventTypeId: eventType.id,
      start: from,
      end,
      timeZone: TEACHING_TZ,
    })

    // The stretch Cal left out for notice: from createProposal's own floor up
    // to where this type's notice ends, filled from a shorter-notice donor.
    const noticeEnd = now + eventType.minimumBookingNotice * 60_000
    const gapStart = new Date(Math.max(from.getTime(), now + MIN_LEAD_MS))
    const gapEnd = new Date(Math.min(end.getTime(), noticeEnd))
    const donor = gapStart < gapEnd ? shorterNoticeDonor(eventType, await listEventTypes()) : null
    if (donor) {
      const extra = await getSlots({
        eventTypeId: donor.id,
        start: gapStart,
        end: gapEnd,
        timeZone: TEACHING_TZ,
      })
      for (const [date, entries] of Object.entries(extra)) {
        const have = new Set((slots[date] ?? []).map((s) => new Date(s.start).getTime()))
        const add = entries.filter((s) => {
          const t = new Date(s.start).getTime()
          return t >= gapStart.getTime() && t < gapEnd.getTime() && !have.has(t)
        })
        slots[date] = [...(slots[date] ?? []), ...add].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        )
      }
    }

    return NextResponse.json({
      eventType: {
        id: eventType.id,
        slug: eventType.slug,
        title: eventType.title,
        lengthInMinutes: eventType.lengthInMinutes,
      },
      timeZone: TEACHING_TZ,
      days: Object.entries(slots)
        .map(([date, entries]) => ({ date, slots: entries.map((s) => s.start) }))
        .filter((d) => d.slots.length > 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    })
  } catch (err) {
    console.error('[admin/proposals/slots]', err)
    const message = err instanceof CalError ? err.message : 'Could not read the calendar.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
