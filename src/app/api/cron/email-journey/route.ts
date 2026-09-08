import { NextResponse } from 'next/server'
import { sendDueJourneyEmails } from '@/lib/email/runner'
import { sendDueSubscriberEmails } from '@/lib/email/subscriberRunner'
import { sendDueTrialFollowUps } from '@/lib/email/trialFollowUpRunner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Sends the journey emails that have come due. Must run at least hourly: the
 * onboarding steps are measured in days and would survive a daily run, but the
 * trial follow-up is due four hours after a lesson ends, and a once-a-day sweep
 * would deliver it up to a day late — by which point "it was lovely to meet
 * you" is no longer true of anything the reader remembers.
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

    // The post-trial "lovely to meet you". Same run rather than its own cron:
    // it shares the SMTP credentials with the two above, and a second schedule
    // hitting Gmail at the same minute is exactly the concurrency the
    // sequential ordering here exists to avoid.
    const trialFollowUps = await sendDueTrialFollowUps(50)

    const result = { journeys, followUps, trialFollowUps }
    console.log('[cron/email-journey]', result)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[cron/email-journey]', err)
    return NextResponse.json({ error: 'Run failed' }, { status: 500 })
  }
}
