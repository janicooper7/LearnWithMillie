import { createHmac, timingSafeEqual } from 'crypto'
import { siteUrl } from '@/lib/email/shell'

// Unsubscribe links are signed rather than stored: the token is an HMAC of the
// id, so any link in any email can be verified without a lookup table and
// nobody can unsubscribe somebody else by guessing an id.
//
// Rotating AUTH_SECRET invalidates every link already sitting in an inbox. That
// is the accepted trade-off for not keeping a token table — if the secret ever
// is rotated, the List-Unsubscribe header in the mail client still works.

/**
 * The signed payload is namespaced by list. A User id and a Subscriber id are
 * both cuids from the same generator, so without the prefix a token minted for
 * one table would verify against a row with the same id in the other.
 */
function sign(scope: 'unsubscribe' | 'unsubscribe-subscriber', id: string): string | null {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(`${scope}:${id}`).digest('base64url')
}

function verify(expected: string | null, token: string): boolean {
  if (!expected || !token) return false

  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** Absolute one-click unsubscribe URL, or null if signing isn't configured. */
export function unsubscribeUrl(userId: string): string | null {
  const token = sign('unsubscribe', userId)
  if (!token) return null
  return `${siteUrl()}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${token}`
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  return verify(sign('unsubscribe', userId), token)
}

/** The same thing for a marketing-list subscriber, who has no User row. */
export function subscriberUnsubscribeUrl(subscriberId: string): string | null {
  const token = sign('unsubscribe-subscriber', subscriberId)
  if (!token) return null
  return `${siteUrl()}/api/email/unsubscribe?s=${encodeURIComponent(subscriberId)}&t=${token}`
}

export function verifySubscriberUnsubscribeToken(subscriberId: string, token: string): boolean {
  return verify(sign('unsubscribe-subscriber', subscriberId), token)
}
