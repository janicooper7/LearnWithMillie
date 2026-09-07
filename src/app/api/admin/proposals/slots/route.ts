import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CalError, findEventType, getSlots } from '@/lib/cal'
import { TEACHING_TZ } from '@/lib/sessionProposals'

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
  const from = start.getTime() < Date.now() ? new Date() : start

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
