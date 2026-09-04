import { buildCoursesFollowUp } from '@/lib/email/messages/coursesFollowUp'
import { buildCoursesLastCall } from '@/lib/email/messages/coursesLastCall'
import { buildPlatformFinderFollowUp } from '@/lib/email/messages/platformFinderFollowUp'
import { buildPlatformFinderLastCall } from '@/lib/email/messages/platformFinderLastCall'
import { hasBoughtAnyCourse, hasBoughtPlatformFinder } from '@/lib/email/purchases'
import type { SubscriberJourneyStep } from '@/lib/email/types'

/**
 * Product-specific follow-up drips for the marketing list.
 *
 * The distinction from journeys.ts: those are keyed on *who someone is* (the
 * role on their account) and go to registered users. These are keyed on *what
 * someone was reading* — the page the signup popup was answered on — and go to
 * people with no account at all. Somebody who handed over their address while
 * reading about the Platform Finder has told us far more than "teacher", and a
 * generic teacher email is a wasted reply to it.
 *
 * The welcome email is not part of this. It goes out immediately from
 * /api/subscribe and already lists everything; these pick up two days later
 * with one product, argued properly.
 *
 * To add a track: give it a key that has never been used, list the paths that
 * enrol into it, and say how to tell whether someone already owns the thing.
 * To add a step to an existing track, append it — offsets are absolute, and
 * `followUpStartedAt` on the row means an existing enrolment picks up a new
 * step only once its offset passes.
 *
 * Never reorder or remove a step that has shipped: `followUpStep` on the row is
 * an index into these arrays, so changing the order re-points people mid-track.
 */
export type SubscriberJourney = {
  /** What it is, for logs and the admin export. */
  description: string
  /**
   * Signup paths that enrol into this track. Matched against the popup's
   * `source`, which is the pathname it was answered on — prefixes, so a signup
   * on a single course's page counts as a signup on the courses page.
   */
  sources: string[]
  /**
   * True when this address already owns what the track sells.
   *
   * Checked immediately before every send rather than only at enrolment,
   * because the interesting case is somebody who buys *between* signing up and
   * the follow-up going out — which, if the emails work, is most of them.
   */
  hasBought: (email: string) => Promise<boolean>
  steps: SubscriberJourneyStep[]
}

export const SUBSCRIBER_JOURNEYS: Record<string, SubscriberJourney> = {
  'platform-finder': {
    description: 'Signed up on the Platform Finder page',
    sources: ['/teachers/platform-finder'],
    hasBought: hasBoughtPlatformFinder,
    steps: [
      {
        key: 'platform-finder-followup',
        delayDays: 2,
        build: buildPlatformFinderFollowUp,
      },
      {
        key: 'platform-finder-last-call',
        delayDays: 6,
        build: buildPlatformFinderLastCall,
      },
    ],
  },

  courses: {
    description: 'Signed up on the courses pages',
    sources: ['/teachers/courses'],
    hasBought: hasBoughtAnyCourse,
    steps: [
      {
        key: 'courses-followup',
        delayDays: 2,
        build: buildCoursesFollowUp,
      },
      {
        key: 'courses-last-call',
        delayDays: 6,
        build: buildCoursesLastCall,
      },
    ],
  },
}

export type SubscriberJourneyName = keyof typeof SUBSCRIBER_JOURNEYS

export function isSubscriberJourneyName(value: string): boolean {
  return value in SUBSCRIBER_JOURNEYS
}

/**
 * Which track a signup on `source` belongs to, or null for the rest of the
 * site.
 *
 * Prefix-matched on path segments, so `/teachers/courses/get-ready` enrols but
 * a hypothetical `/teachers/courses-faq` would not. Longest match wins, so a
 * future track on a page nested inside another one's section takes precedence
 * over the section it sits in rather than racing it on object order.
 */
export function subscriberJourneyForSource(source: string | null | undefined): string | null {
  if (!source) return null
  // The popup sends a pathname, but a stored source from anywhere else might
  // carry a query string or a trailing slash.
  const path = source.split(/[?#]/)[0].replace(/\/+$/, '').toLowerCase()
  if (!path) return null

  let best: string | null = null
  let bestLength = 0

  for (const [key, journey] of Object.entries(SUBSCRIBER_JOURNEYS)) {
    for (const prefix of journey.sources) {
      if (path !== prefix && !path.startsWith(`${prefix}/`)) continue
      if (prefix.length > bestLength) {
        best = key
        bestLength = prefix.length
      }
    }
  }

  return best
}
