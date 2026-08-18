import { createHmac, timingSafeEqual } from 'crypto'
import { siteUrl } from '@/lib/email/shell'

// Unsubscribe links are signed rather than stored: the token is an HMAC of the
// user id, so any link in any email can be verified without a lookup table and
// nobody can unsubscribe somebody else by guessing an id.
//
// Rotating AUTH_SECRET invalidates every link already sitting in an inbox. That
// is the accepted trade-off for not keeping a token table — if the secret ever
// is rotated, the List-Unsubscribe header in the mail client still works.

function signature(userId: string): string | null {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(`unsubscribe:${userId}`).digest('base64url')
}

/** Absolute one-click unsubscribe URL, or null if signing isn't configured. */
export function unsubscribeUrl(userId: string): string | null {
  const token = signature(userId)
  if (!token) return null
  return `${siteUrl()}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${token}`
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = signature(userId)
  if (!expected || !token) return false

  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
