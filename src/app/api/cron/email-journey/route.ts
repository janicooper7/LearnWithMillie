import { NextResponse } from 'next/server'
import { sendDueJourneyEmails } from '@/lib/email/runner'
import { sendDueSubscriberEmails } from '@/lib/email/subscriberRunner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Sends the journey emails that have come due. Runs on a schedule — daily is
 * plenty, since every step's offset is measured in days.
 *
 * Authenticate with `Authorization: Bearer $CRON_SECRET`, which is the header
 * Vercel Cron sends by itself once CRON_SECRET is set. Any other scheduler
 * (cron-job.org, GitHub Actions, a Netlify scheduled function) works the same
 * way as long as it sends that header.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // Fail closed. An open endpoint here is a way to make the site email its
    // own users on demand.
    console.error('[cron/email-journey] CRON_SECRET is not set — refusing to run')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Capped per run so one invocation can't sit on the SMTP connection past
    // the function timeout. Anything left over goes out on the next run.
    const journeys = await sendDueJourneyEmails(50)

    // The marketing list's product follow-ups, run after the account journeys
    // and sequentially with them: both go out over the same Gmail SMTP
    // credentials, and interleaving them would just double the concurrency the
    // provider sees. Its own cap, so a busy hour on one side can't starve the
    // other of the run's budget.
    const followUps = await sendDueSubscriberEmails(50)

    const result = { journeys, followUps }
    console.log('[cron/email-journey]', result)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[cron/email-journey]', err)
    return NextResponse.json({ error: 'Run failed' }, { status: 500 })
  }
}
