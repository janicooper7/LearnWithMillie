// Retention periods, shared by the cleanup job (src/lib/retention.ts) and the
// privacy policy page that promises them. Change one and the other follows.

export const RETENTION = {
  /** First-party analytics events. Matches Google Analytics' 14-month setting. */
  trackedEventDays: 14 * 30,
  /** Platform Finder quizzes that were started but never paid for. */
  unpaidPlatformFinderDays: 30,
  /** After unsubscribing, a list entry is cut down to the address alone — kept
   *  only so they are never mailed again. */
  unsubscribedMinimiseDays: 30,
} as const
