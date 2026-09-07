import { NextResponse } from 'next/server'
import { expireDueProposals } from '@/lib/sessionProposals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Gives back the slots nobody answered for.
 *
 * A proposed time is a real booking against a real credit, so an unanswered
 * proposal costs Millie a bookable hour and costs the student a lesson for as
 * long as it sits there. This is what stops that being forever.
 *
 * Its own endpoint rather than a passenger on the drip cron: that one is about
 * sending email on a daily cadence, and this is about releasing calendar time
 * promptly. Authenticated the same way — `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // Fail closed, as the drip cron does. An open endpoint here would let
    // anyone cancel Millie's held bookings on demand.
    console.error('[cron/expire-proposals] CRON_SECRET is not set — refusing to run')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Capped so one run can't sit on Cal.com's API past the function timeout;
    // anything left over goes on the next run, an hour later.
    const result = await expireDueProposals(50)
    if (result.expired || result.failed) console.log('[cron/expire-proposals]', result)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[cron/expire-proposals]', err)
    return NextResponse.json({ error: 'Run failed' }, { status: 500 })
  }
}
