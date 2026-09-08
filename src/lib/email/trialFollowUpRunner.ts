import { prisma } from '@/lib/prisma'
import { sendBrandedMail } from '@/lib/email/send'
import { buildTrialFollowUp } from '@/lib/email/messages/trialFollowUp'
import { unsubscribeUrl } from '@/lib/email/unsubscribe'
import type { JourneyContext } from '@/lib/email/types'

/**
 * The follow-up to a trial lesson: scheduled off the booking, not off signup.
 *
 * Everything else that emails a student is measured from the day they created
 * an account, which is why it lives in runner.ts and is driven by a step index.
 * This one is measured from a lesson that hasn't happened yet when it is
 * queued, so it gets its own table and its own sweep — a row carrying an
 * absolute send time is the only thing that survives the student rebooking,
 * cancelling, or never turning up.
 */

const HOUR_MS = 60 * 60 * 1000
const RETRY_DELAY_MS = 30 * 60 * 1000
const MAX_ATTEMPTS = 3

/** How long after the lesson ends the email goes out. */
export const FOLLOW_UP_DELAY_HOURS = 4

/**
 * Nobody is emailed in the middle of their own night.
 *
 * The delay is measured from the end of the lesson, so a 9pm trial would
 * otherwise land at 1am wherever the student is. Anything falling outside
 * these hours is pushed to the start of the next civil morning — the only
 * case where the send is not exactly four hours later, and a deliberate one.
 */
const EARLIEST_HOUR = 8
const LATEST_HOUR = 21

/** The hour of the day `date` falls on in `timeZone`, 0-23. */
function localHour(date: Date, timeZone: string): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    hour12: false,
  }).format(date)
  return Number(hour) % 24
}

/**
 * The send time for a lesson ending at `lessonEnd`, nudged out of the night.
 *
 * Works in whole hours from the raw time rather than by constructing a local
 * 08:00, which would mean parsing a wall-clock time back into an instant in a
 * zone whose offset may change overnight. Adding an hour at a time is exact in
 * any zone, and the loop is bounded by the length of a night.
 *
 * An unknown or malformed timezone falls back to the plain four hours: a
 * best-guess send at a slightly rude hour beats no email at all.
 */
export function trialFollowUpSendAt(lessonEnd: Date, timeZone: string | null): Date {
  const target = new Date(lessonEnd.getTime() + FOLLOW_UP_DELAY_HOURS * HOUR_MS)
  if (!timeZone) return target

  try {
    let candidate = target
    // At most a full night of nudging (22:00 to 08:00 is 10 hours), plus slack.
    for (let i = 0; i < 24; i += 1) {
      const hour = localHour(candidate, timeZone)
      if (hour >= EARLIEST_HOUR && hour <= LATEST_HOUR) return candidate
      candidate = new Date(candidate.getTime() + HOUR_MS)
    }
    return target
  } catch {
    // Intl throws on a timezone it doesn't recognise.
    return target
  }
}

/**
 * Queues the follow-up for a trial booking. Best-effort: the caller is the Cal
 * webhook, whose job is the credit, and a failure here must never turn into a
 * non-2xx that makes Cal retry the whole booking.
 *
 * Idempotent on `bookingUid`, so a replayed webhook updates the existing row
 * rather than queueing a second email.
 */
export async function scheduleTrialFollowUp(opts: {
  userId: string
  bookingUid: string
  lessonEnd: Date
  timeZone: string | null
}): Promise<void> {
  const { userId, bookingUid, lessonEnd, timeZone } = opts

  if (Number.isNaN(lessonEnd.getTime())) {
    console.error('[trial-followup] no usable end time for booking', bookingUid)
    return
  }

  const sendAt = trialFollowUpSendAt(lessonEnd, timeZone)

  try {
    await prisma.trialFollowUp.upsert({
      where: { bookingUid },
      // A rebooked trial reuses the row: the new time replaces the old one, and
      // `sentAt` is left alone so an email already sent is never sent twice.
      update: { lessonEnd, sendAt, attempts: 0 },
      create: { userId, bookingUid, lessonEnd, sendAt },
    })
    console.log('[trial-followup] queued for', bookingUid, 'at', sendAt.toISOString())
  } catch (err) {
    console.error('[trial-followup] could not queue', bookingUid, err)
  }
}

/**
 * Un-queues the follow-up for a cancelled booking.
 *
 * Clears `sendAt` rather than deleting the row, so a trial that is cancelled
 * and rebooked under the same uid still has somewhere to land, and so the
 * record of what was scheduled survives. Guarded on `sentAt` being null: a
 * cancellation that arrives after the email has gone changes nothing.
 */
export async function cancelTrialFollowUp(bookingUid: string): Promise<void> {
  try {
    const cleared = await prisma.trialFollowUp.updateMany({
      where: { bookingUid, sentAt: null },
      data: { sendAt: null },
    })
    if (cleared.count > 0) console.log('[trial-followup] cancelled for', bookingUid)
  } catch (err) {
    console.error('[trial-followup] could not cancel', bookingUid, err)
  }
}

export type TrialFollowUpResult = 'sent' | 'skipped' | 'failed'

/** Sends one queued follow-up, if it is still the right thing to send. */
export async function deliverTrialFollowUp(id: string): Promise<TrialFollowUpResult> {
  const row = await prisma.trialFollowUp.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          stripeSubscriptionId: true,
          emailJourney: { select: { unsubscribedAt: true } },
        },
      },
    },
  })
  if (!row || !row.user || row.sentAt) return 'skipped'

  const user = row.user

  const stop = async (why: string) => {
    console.log('[trial-followup]', why, '-', user.email)
    await prisma.trialFollowUp.update({ where: { id: row.id }, data: { sendAt: null } })
  }

  if (user.emailJourney?.unsubscribedAt) {
    await stop('unsubscribed')
    return 'skipped'
  }

  // Somebody who signed up for a plan between the lesson and this email has
  // already answered the only question it asks. Pitching them the plans they
  // have just bought is the one thing worse than not sending it at all.
  if (user.stripeSubscriptionId) {
    await stop('already subscribed')
    return 'skipped'
  }

  // Claim before building, so two overlapping cron runs can't both send it:
  // the second one's update matches no rows and it walks away.
  const claimed = await prisma.trialFollowUp.updateMany({
    where: { id: row.id, sentAt: null },
    data: { sentAt: new Date(), sendAt: null },
  })
  if (claimed.count === 0) return 'skipped'

  const context: JourneyContext = {
    name: user.name,
    email: user.email,
    unsubscribeUrl: unsubscribeUrl(row.userId),
  }

  try {
    const { subject, html } = buildTrialFollowUp(context)

    await sendBrandedMail({
      to: user.email,
      subject,
      html,
      unsubscribeUrl: context.unsubscribeUrl,
    })

    if (row.attempts > 0) {
      await prisma.trialFollowUp.update({ where: { id: row.id }, data: { attempts: 0 } })
    }
    console.log('[trial-followup] sent to', user.email)
    return 'sent'
  } catch (err) {
    const attempts = row.attempts + 1
    const exhausted = attempts >= MAX_ATTEMPTS

    // Hand the send back. Guarded on the claim above so a concurrent writer's
    // state is never clobbered.
    await prisma.trialFollowUp.updateMany({
      where: { id: row.id, sentAt: { not: null } },
      data: {
        sentAt: null,
        attempts,
        sendAt: exhausted ? null : new Date(Date.now() + RETRY_DELAY_MS),
      },
    })

    console.error(
      `[trial-followup] failed for ${user.email} (attempt ${attempts}${exhausted ? ', giving up' : ''})`,
      err
    )
    return 'failed'
  }
}

/** Sends every follow-up that has come due. Called by the cron route. */
export async function sendDueTrialFollowUps(limit = 50): Promise<{
  processed: number
  sent: number
  failed: number
}> {
  const due = await prisma.trialFollowUp.findMany({
    where: { sendAt: { lte: new Date() }, sentAt: null },
    orderBy: { sendAt: 'asc' },
    take: limit,
    select: { id: true },
  })

  let sent = 0
  let failed = 0

  // One at a time, like the other runners: this goes out over Gmail SMTP,
  // which rate-limits concurrent connections.
  for (const { id } of due) {
    const result = await deliverTrialFollowUp(id)
    if (result === 'sent') sent += 1
    if (result === 'failed') failed += 1
  }

  return { processed: due.length, sent, failed }
}
