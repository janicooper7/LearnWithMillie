import { prisma } from '@/lib/prisma'

/**
 * Keeps the two drips out of each other's way.
 *
 * A person can be on both at once, and the warmest ones usually are: they give
 * their address to the popup, then register an account, and from that moment
 * the account journey (journeys.ts) and their product follow-up track
 * (subscriberJourneys.ts) are both counting down against the same inbox with no
 * knowledge of each other. Left alone that puts `teacherProducts`, which pitches
 * the Platform Finder as one of four cards, roughly a day before a whole email
 * about the Platform Finder.
 *
 * The rule is one-directional: the follow-up tracks yield, the account journey
 * never does. The account journey is two emails triggered by an act the person
 * just performed — delaying a welcome to somebody who registered ten seconds ago
 * is worse than the clash it would avoid — while a marketing follow-up losing a
 * day costs nothing. And because that journey is only ever two steps, whatever
 * it delays is delayed once and then runs.
 */

/**
 * How recently an account email has to have gone out for a follow-up to wait.
 *
 * 36 hours rather than 24: the collision to break up is a day-1 account email
 * against a day-2 follow-up, which are about 24 hours apart, and a 24-hour
 * window would let them through by an hour or two either side of the cron's
 * rounding.
 */
const QUIET_PERIOD_MS = 36 * 60 * 60 * 1000

/**
 * Whether this address has had an email from the account journey recently
 * enough that a marketing follow-up should hold off.
 *
 * Matched case-insensitively: /api/subscribe lowercases, registration stores
 * whatever was typed, so an exact join would miss the person this exists for.
 *
 * `lastSentAt` is stamped when the step is claimed rather than when the SMTP
 * call returns, so a send that then failed still counts as recent. That is the
 * safe direction — the alternative is treating a failure as licence to mail
 * them twice.
 */
export async function accountJourneyMailedRecently(email: string): Promise<boolean> {
  const row = await prisma.emailJourney.findFirst({
    where: {
      lastSentAt: { gte: new Date(Date.now() - QUIET_PERIOD_MS) },
      user: { is: { email: { equals: email, mode: 'insensitive' } } },
    },
    select: { id: true },
  })
  return row !== null
}
