import { prisma } from '@/lib/prisma'

/**
 * "Has this address already bought the thing we are about to pitch it?"
 *
 * Needed because the follow-up drip runs off the Subscriber table, whose rows
 * have no account and therefore no purchase history of their own — the only
 * thing tying a subscriber to a sale is the email address. Everything here
 * matches case-insensitively: /api/subscribe lowercases, while registration and
 * Stripe Checkout store whatever the customer typed, so an exact match would
 * miss "Sam@x.com" against "sam@x.com" and pitch a customer their own product.
 *
 * Each check answers for one product rather than "is this person a customer at
 * all". Someone who bought the $5 Platform Finder is still a fair audience for
 * the courses; what nobody should ever receive is a mail explaining why they
 * should buy what they already own.
 */

function match(email: string) {
  return { equals: email, mode: 'insensitive' as const }
}

/** Paid for a Platform Finder report. */
export async function hasBoughtPlatformFinder(email: string): Promise<boolean> {
  const row = await prisma.platformFinderResult.findFirst({
    where: { email: match(email), paid: true },
    select: { id: true },
  })
  return row !== null
}

/**
 * Owns any course.
 *
 * Access is granted per user, so this goes through User — a course buyer always
 * has an account, because there is nowhere else for the videos to be watched.
 * Any single course counts: the follow-up sells the trilogy as a whole, and a
 * teacher who has already started it does not need to be told why.
 */
export async function hasBoughtAnyCourse(email: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { email: match(email), courseAccess: { some: {} } },
    select: { id: true },
  })
  return user !== null
}
