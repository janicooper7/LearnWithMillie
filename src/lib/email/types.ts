/** Everything an email body is allowed to know about its recipient. */
export type JourneyContext = {
  name: string | null
  email: string
  /** Null only when AUTH_SECRET isn't set — the footer link is then omitted. */
  unsubscribeUrl: string | null
}

export type BuiltEmail = { subject: string; html: string }

/** Which half of the site a marketing-list subscriber came for. */
export type Audience = 'teacher' | 'student'

/**
 * A subscriber from the signup popup. They have no account, so nothing here
 * can be looked up from a User row — the audience is whatever they told the
 * popup, and it's the only thing that decides which version of an email they
 * get.
 */
export type SubscriberContext = JourneyContext & { audience: Audience }

export type JourneyStep = {
  /** Stable identifier for logs. Never reuse one for different content. */
  key: string
  /** Days after the user signed up, not after the previous email. Offsets are
   *  absolute so a delayed send can't push the whole rest of the sequence back. */
  delayDays: number
  build: (ctx: JourneyContext) => BuiltEmail
}
