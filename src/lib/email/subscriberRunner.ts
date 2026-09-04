import { prisma } from '@/lib/prisma'
import { accountJourneyMailedRecently } from '@/lib/email/frequency'
import { sendBrandedMail } from '@/lib/email/send'
import { SUBSCRIBER_JOURNEYS, subscriberJourneyForSource } from '@/lib/email/subscriberJourneys'
import { subscriberUnsubscribeUrl } from '@/lib/email/unsubscribe'
import type { Audience, SubscriberContext } from '@/lib/email/types'

/**
 * The drip for marketing-list subscribers, as runner.ts is for registered
 * users. Same shape deliberately — claim the step with a compare-and-swap,
 * send, hand it back on failure — but against Subscriber rows, which carry
 * their enrolment inline rather than in a separate table, and with two gates the
 * user journeys don't need in front of every send: has this person already
 * bought the thing we are about to argue for, and has the account journey mailed
 * them so recently that this would arrive on top of it.
 */

const DAY_MS = 24 * 60 * 60 * 1000
const RETRY_DELAY_MS = 30 * 60 * 1000
/** Give up on a step after this many consecutive failures — a dead address
 *  shouldn't be retried by every cron run forever. */
const MAX_ATTEMPTS = 3

export type SubscriberDeliveryResult =
  | 'sent'
  | 'skipped'
  | 'bought'
  | 'deferred'
  | 'finished'
  | 'failed'

/**
 * When the step at `index` is due, measured from enrolment rather than from the
 * previous send. Returns null once the track is exhausted.
 */
function dueAt(journey: string, index: number, startedAt: Date): Date | null {
  const step = SUBSCRIBER_JOURNEYS[journey]?.steps[index]
  if (!step) return null

  const scheduled = startedAt.getTime() + step.delayDays * DAY_MS
  // A step whose offset is already past — a track gaining a step, or a retry
  // that ran long — goes out on the next pass, not retroactively.
  return new Date(Math.max(scheduled, Date.now()))
}

/** Take a subscriber off their track for good, without unsubscribing them:
 *  they still get the newsletter and whatever Millie broadcasts. */
function stop(id: string) {
  return prisma.subscriber.update({ where: { id }, data: { followUpNextAt: null } })
}

export async function deliverNextSubscriberStep(
  subscriberId: string
): Promise<SubscriberDeliveryResult> {
  const row = await prisma.subscriber.findUnique({ where: { id: subscriberId } })
  if (!row || !row.followUp) return 'skipped'

  if (row.unsubscribedAt) {
    await stop(row.id)
    return 'skipped'
  }

  const journey = SUBSCRIBER_JOURNEYS[row.followUp]
  if (!journey) {
    console.error('[subscriber-followup] unknown track', row.followUp, 'on', row.id)
    await stop(row.id)
    return 'skipped'
  }

  const step = journey.steps[row.followUpStep]
  if (!step) {
    // Reached the end. The row keeps its track and step so a step added later
    // can still find them, and so the admin export can see who got what.
    await stop(row.id)
    return 'finished'
  }

  // The whole point of the exclusion: somebody who bought after signing up must
  // not then be told why they should buy. Checked here rather than only at
  // enrolment because that gap is exactly where the purchase happens.
  //
  // A lookup that throws sends nothing — treating a failed check as "not a
  // customer" would mail the very people this exists to protect. The step is
  // pushed back rather than left alone so a row whose check keeps failing backs
  // off instead of sitting at the head of the due queue every run and crowding
  // out the rows behind it.
  let bought: boolean
  try {
    bought = await journey.hasBought(row.email)
  } catch (err) {
    console.error('[subscriber-followup] purchase check failed for', row.email, err)
    await prisma.subscriber
      .update({
        where: { id: row.id },
        data: { followUpNextAt: new Date(Date.now() + RETRY_DELAY_MS) },
      })
      .catch(() => {})
    return 'skipped'
  }

  if (bought) {
    console.log('[subscriber-followup] already bought', row.followUp, '—', row.email)
    await stop(row.id)
    return 'bought'
  }

  // Somebody who subscribed and then registered is on the account journey as
  // well, and that journey's day-one email already pitches these products. Give
  // way to it rather than landing a whole email about one of them the next
  // morning — the step is pushed back a day, not skipped, and the account
  // journey is only two steps long so this defers at most once. See
  // frequency.ts for why the deference only runs in this direction.
  if (await accountJourneyMailedRecently(row.email)) {
    console.log('[subscriber-followup] deferring', step.key, 'for', row.email, '— account journey mailed recently')
    await prisma.subscriber.update({
      where: { id: row.id },
      data: { followUpNextAt: new Date(Date.now() + DAY_MS) },
    })
    return 'deferred'
  }

  // Claim before building, so two overlapping cron runs can never both send
  // this step: the second one's update matches no rows and it walks away.
  const claimed = await prisma.subscriber.updateMany({
    where: { id: row.id, followUpStep: row.followUpStep },
    data: {
      followUpStep: row.followUpStep + 1,
      followUpNextAt: dueAt(
        row.followUp,
        row.followUpStep + 1,
        row.followUpStartedAt ?? row.createdAt
      ),
      followUpSentAt: new Date(),
    },
  })
  if (claimed.count === 0) return 'skipped'

  const context: SubscriberContext = {
    name: row.name,
    email: row.email,
    audience: row.audience === 'TEACHER' ? 'teacher' : ('student' as Audience),
    unsubscribeUrl: subscriberUnsubscribeUrl(row.id),
  }

  try {
    const { subject, html } = step.build(context)

    await sendBrandedMail({
      to: row.email,
      subject,
      html,
      unsubscribeUrl: context.unsubscribeUrl,
    })

    if (row.followUpAttempts > 0) {
      await prisma.subscriber.update({ where: { id: row.id }, data: { followUpAttempts: 0 } })
    }
    console.log('[subscriber-followup] sent', step.key, 'to', row.email)
    return 'sent'
  } catch (err) {
    const attempts = row.followUpAttempts + 1
    const exhausted = attempts >= MAX_ATTEMPTS

    // Hand the step back, guarded on the value set above so a concurrent
    // writer's state is never clobbered.
    await prisma.subscriber.updateMany({
      where: { id: row.id, followUpStep: row.followUpStep + 1 },
      data: {
        followUpStep: row.followUpStep,
        followUpAttempts: attempts,
        followUpNextAt: exhausted ? null : new Date(Date.now() + RETRY_DELAY_MS),
      },
    })

    console.error(
      `[subscriber-followup] ${step.key} failed for ${row.email} (attempt ${attempts}${exhausted ? ', giving up' : ''})`,
      err
    )
    return 'failed'
  }
}

/**
 * Puts a subscriber on the track for the page they signed up on, if that page
 * has one.
 *
 * Called from /api/subscribe with the source of *this* submission rather than
 * the stored one, so somebody who first joined from the homepage and later
 * signs up again from a product page still gets that product's follow-up.
 *
 * Enrols once and only once. A subscriber already on a track stays on it: they
 * are mid-sequence, and re-pointing them would either restart a track they have
 * already had or drop them halfway through one.
 *
 * Never throws. This runs inside the signup request, and failing to schedule a
 * marketing email for two days' time is not a reason to fail a signup.
 */
export async function enrolSubscriberFollowUp(
  subscriberId: string,
  source: string | null
): Promise<void> {
  const journeyName = subscriberJourneyForSource(source)
  if (!journeyName) return

  const first = SUBSCRIBER_JOURNEYS[journeyName].steps[0]
  if (!first) return

  const startedAt = new Date()

  try {
    // Guarded on followUp being null, so a concurrent double-submit enrols once
    // and the loser updates nothing.
    const enrolled = await prisma.subscriber.updateMany({
      where: { id: subscriberId, followUp: null, unsubscribedAt: null },
      data: {
        followUp: journeyName,
        followUpStep: 0,
        followUpStartedAt: startedAt,
        followUpNextAt: new Date(startedAt.getTime() + first.delayDays * DAY_MS),
        followUpAttempts: 0,
      },
    })

    if (enrolled.count > 0) {
      console.log('[subscriber-followup] enrolled', subscriberId, 'on', journeyName)
    }
  } catch (err) {
    console.error('[subscriber-followup] could not enrol', subscriberId, err)
  }
}

/**
 * Sends every follow-up that has come due. Called by the cron route alongside
 * the user journeys.
 *
 * One at a time, like the user drip: this goes out over Gmail SMTP, which rate
 * limits concurrent connections, and a marketing send has no reason to be fast.
 */
export async function sendDueSubscriberEmails(limit = 50): Promise<{
  processed: number
  sent: number
  bought: number
  deferred: number
  failed: number
}> {
  const due = await prisma.subscriber.findMany({
    where: { followUpNextAt: { lte: new Date() }, unsubscribedAt: null },
    orderBy: { followUpNextAt: 'asc' },
    take: limit,
    select: { id: true },
  })

  let sent = 0
  let bought = 0
  let deferred = 0
  let failed = 0

  for (const { id } of due) {
    const result = await deliverNextSubscriberStep(id)
    if (result === 'sent') sent += 1
    if (result === 'bought') bought += 1
    if (result === 'deferred') deferred += 1
    if (result === 'failed') failed += 1
  }

  return { processed: due.length, sent, bought, deferred, failed }
}
