import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { JOURNEYS, isJourneyName, journeyForRole } from '@/lib/email/journeys'
import { unsubscribeUrl } from '@/lib/email/unsubscribe'
import type { JourneyContext } from '@/lib/email/types'

const DAY_MS = 24 * 60 * 60 * 1000
const RETRY_DELAY_MS = 30 * 60 * 1000
/** Give up on a step after this many consecutive failures — a dead address
 *  shouldn't be retried by every cron run forever. */
const MAX_ATTEMPTS = 3

export type DeliveryResult = 'sent' | 'skipped' | 'finished' | 'failed'

function fromAddress(): string | undefined {
  const address = process.env.SMTP_USER
  // A bare Gmail address as the sender looks like spam. Everything in these
  // sequences is written in Millie's voice, so it should arrive from her.
  return address ? `Millie at LearnWithMillie <${address}>` : undefined
}

/**
 * When the step at `index` is due, measured from the signup date rather than
 * from the previous send — a send that ran late must not shift the rest of the
 * sequence back with it. Returns null once the sequence is exhausted.
 */
function dueAt(journey: string, index: number, enrolledAt: Date): Date | null {
  if (!isJourneyName(journey)) return null
  const step = JOURNEYS[journey][index]
  if (!step) return null

  const scheduled = enrolledAt.getTime() + step.delayDays * DAY_MS
  // A step whose offset is already in the past (a sequence gaining a new step,
  // or delayDays: 0) goes out on the next pass, not retroactively.
  return new Date(Math.max(scheduled, Date.now()))
}

/**
 * Sends whichever step the user is up to, if one is due.
 *
 * The step is *claimed* with a compare-and-swap before the email is built, so
 * two overlapping cron runs can never both send it: the second one's update
 * matches no rows and it walks away. The cost of that ordering is that a send
 * which throws has to be un-claimed, which is what the catch block does.
 */
export async function deliverNextStep(journeyId: string): Promise<DeliveryResult> {
  const row = await prisma.emailJourney.findUnique({
    where: { id: journeyId },
    include: { user: { select: { email: true, name: true } } },
  })
  if (!row || !row.user) return 'skipped'

  if (row.unsubscribedAt) {
    await prisma.emailJourney.update({ where: { id: row.id }, data: { nextSendAt: null } })
    return 'skipped'
  }

  if (!isJourneyName(row.journey)) {
    console.error('[email-journey] unknown journey', row.journey, 'on', row.id)
    await prisma.emailJourney.update({ where: { id: row.id }, data: { nextSendAt: null } })
    return 'skipped'
  }

  const step = JOURNEYS[row.journey][row.step]
  if (!step) {
    // Reached the end of the sequence. The row stays so that a later step added
    // to this journey can still find the user.
    await prisma.emailJourney.update({ where: { id: row.id }, data: { nextSendAt: null } })
    return 'finished'
  }

  const claimed = await prisma.emailJourney.updateMany({
    where: { id: row.id, step: row.step },
    data: {
      step: row.step + 1,
      nextSendAt: dueAt(row.journey, row.step + 1, row.createdAt),
      lastSentAt: new Date(),
    },
  })
  if (claimed.count === 0) return 'skipped'

  const context: JourneyContext = {
    name: row.user.name,
    email: row.user.email,
    unsubscribeUrl: unsubscribeUrl(row.userId),
  }

  try {
    const { subject, html } = step.build(context)

    await sendMail({
      to: row.user.email,
      subject,
      html,
      from: fromAddress(),
      headers: context.unsubscribeUrl
        ? {
            // Puts the unsubscribe control in the mail client's own chrome,
            // which is what keeps a sequence like this out of the spam folder.
            'List-Unsubscribe': `<${context.unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          }
        : undefined,
    })

    if (row.attempts > 0) {
      await prisma.emailJourney.update({ where: { id: row.id }, data: { attempts: 0 } })
    }
    console.log('[email-journey] sent', step.key, 'to', row.user.email)
    return 'sent'
  } catch (err) {
    const attempts = row.attempts + 1
    const exhausted = attempts >= MAX_ATTEMPTS

    // Hand the step back. Guarded on the value we set above so a concurrent
    // writer's state is never clobbered.
    await prisma.emailJourney.updateMany({
      where: { id: row.id, step: row.step + 1 },
      data: {
        step: row.step,
        attempts,
        nextSendAt: exhausted ? null : new Date(Date.now() + RETRY_DELAY_MS),
      },
    })

    console.error(
      `[email-journey] ${step.key} failed for ${row.user.email} (attempt ${attempts}${exhausted ? ', giving up' : ''})`,
      err
    )
    return 'failed'
  }
}

/**
 * Puts a newly registered user on the sequence for their role and sends the
 * first email straight away.
 *
 * Safe to call more than once — the unique constraint on userId means a repeat
 * call finds the existing enrolment and does nothing, which is what stops a
 * returning Google user being welcomed twice.
 */
export async function enrolInJourney(userId: string, role: string): Promise<void> {
  const journey = journeyForRole(role)
  if (!journey) return

  const existing = await prisma.emailJourney.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (existing) return

  let created
  try {
    created = await prisma.emailJourney.create({
      data: { userId, journey, nextSendAt: new Date() },
      select: { id: true },
    })
  } catch (err) {
    // Lost a race with a concurrent signup — the other one owns the welcome.
    console.warn('[email-journey] could not enrol', userId, err)
    return
  }

  await deliverNextStep(created.id)
}

/**
 * Sends every email that has come due. Called by the cron route.
 *
 * Rows are processed one at a time rather than in parallel: this goes out over
 * Gmail SMTP, which rate-limits concurrent connections, and a marketing send
 * has no reason to be fast.
 */
export async function sendDueJourneyEmails(limit = 50): Promise<{
  processed: number
  sent: number
  failed: number
}> {
  const due = await prisma.emailJourney.findMany({
    where: { nextSendAt: { lte: new Date() }, unsubscribedAt: null },
    orderBy: { nextSendAt: 'asc' },
    take: limit,
    select: { id: true },
  })

  let sent = 0
  let failed = 0

  for (const { id } of due) {
    const result = await deliverNextStep(id)
    if (result === 'sent') sent += 1
    if (result === 'failed') failed += 1
  }

  return { processed: due.length, sent, failed }
}
