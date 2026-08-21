/**
 * Facts that appear in more than one email, kept in one place so the two
 * welcome emails can't drift apart. Both journeys quote the newsletter launch
 * and the same social handles; updating one and forgetting the other is
 * exactly the sort of thing nobody notices until a reader points it out.
 */

/**
 * The month the monthly newsletter launches.
 *
 * The sequences have no end date, so someone signing up months from now still
 * receives this. Once the newsletter is actually running, the sentences that
 * use this should move to the present tense in both welcome emails.
 */
export const NEWSLETTER_MONTH = 'September'

// Re-exported so the emails and the site footer can never disagree about a
// handle again — see src/lib/social.ts.
export { SOCIAL_HANDLE, INSTAGRAM_URL, TIKTOK_URL } from '@/lib/social'
