import { createHmac, timingSafeEqual } from 'crypto'
import type { ProposalStatus, Role, SessionProposal, User } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  CalError,
  PROPOSAL_CANCEL_REASONS,
  cancelBooking,
  createBooking,
  findEventType,
} from '@/lib/cal'
import { siteUrl } from '@/lib/email/shell'

/**
 * Sessions Millie books *for* someone, which they then confirm.
 *
 * The whole reason this exists: holding a time informally loses it. Telling a
 * student "Tuesday 3pm is yours" leaves the slot on the public calendar, and
 * the next person to open the embed can take it. So a proposal books the slot
 * for real, immediately, and the student's answer decides whether it stays.
 *
 * That has a consequence running through every function here — a PENDING
 * proposal is a real booking with a real credit already spent against it.
 * Saying no to one is a cancellation, not a deletion, and the credit has to
 * come back however late the answer arrives.
 */

/**
 * The zone every proposal is made in.
 *
 * Millie teaches from the UK and runs her calendar in UK time, so that is the
 * clock a proposal is picked on, stored in, and described in — to her on the
 * admin page and to the student in the email. It is deliberately not the
 * student's own zone: one clock for both ends of a conversation is what stops
 * "three o'clock" meaning two different things.
 *
 * The booking Cal.com creates still carries a real instant, so a student's own
 * calendar app shows it in their local time regardless of what this says.
 */
export const TEACHING_TZ = 'Europe/London'

/** How long someone gets to answer before the slot goes back on the calendar. */
const DEFAULT_TTL_MS = 48 * 60 * 60 * 1000

/**
 * A proposal stops being answerable a little before the session itself. Past
 * this point "accept" is meaningless — the lesson is about to start — and the
 * slot is more useful back on the calendar.
 */
const MIN_LEAD_MS = 2 * 60 * 60 * 1000

export const PROPOSAL_EVENT_SLUGS = {
  lesson: 'english-lessons-with-millie-cooper',
  trial: 'trial-lesson-with-millie-cooper',
  mentorship: 'mentorship-session-with-millie-cooper',
} as const

/**
 * The event type this person would book themselves, mirroring the rule the
 * dashboard embed uses. Only a default — Millie picks the event type on the
 * propose form, because she is the one who knows whether a given session is a
 * trial, a lesson or mentorship.
 *
 * Subscription state is read from our own row rather than Stripe: this decides
 * which option starts selected on a form, and is not worth an API call per
 * student in a list.
 */
export function defaultEventSlug(
  user: Pick<User, 'role' | 'trialUsed' | 'trialPurchased' | 'stripeSubscriptionId'>
): string {
  if (user.role === 'TEACHER') return PROPOSAL_EVENT_SLUGS.mentorship
  if (user.stripeSubscriptionId || user.trialUsed) return PROPOSAL_EVENT_SLUGS.lesson
  return PROPOSAL_EVENT_SLUGS.trial
}

/** Wording for a person's sessions, matching the dashboard's teacher/student split. */
export function sessionNoun(role: Role, plural = false): string {
  if (role === 'TEACHER') return plural ? 'sessions' : 'session'
  return plural ? 'lessons' : 'lesson'
}

// --- Response links -------------------------------------------------------
//
// The email has to work before the reader logs in, so the link carries a
// signature rather than relying on a session. Same construction as the
// unsubscribe links: an HMAC of the id under AUTH_SECRET, namespaced by scope
// so a token minted for one thing cannot verify against another. Nothing is
// stored, so nothing has to be cleaned up when a proposal is answered.

function sign(id: string): string | null {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(`session-proposal:${id}`).digest('base64url')
}

export function proposalUrl(id: string): string {
  const token = sign(id)
  // With no secret configured the link still resolves; the page then requires
  // the person to be logged in, which is the safe half of the flow.
  return token
    ? `${siteUrl()}/proposal/${id}?t=${encodeURIComponent(token)}`
    : `${siteUrl()}/proposal/${id}`
}

export function verifyProposalToken(id: string, token: string): boolean {
  const expected = sign(id)
  if (!expected || !token) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

// --- Reading --------------------------------------------------------------

/**
 * Proposals this person still has to answer.
 *
 * Filtered on `expiresAt` as well as status because the sweep runs on a
 * schedule: a proposal can be past its deadline for a few hours before the
 * cron gets to it, and showing it as answerable in the meantime would let
 * someone accept a slot that is about to be given away.
 */
export async function pendingProposalsFor(
  userId: string,
  now: Date = new Date()
): Promise<SessionProposal[]> {
  return prisma.sessionProposal.findMany({
    where: { userId, status: 'PENDING', expiresAt: { gt: now } },
    orderBy: { start: 'asc' },
  })
}

// --- Creating -------------------------------------------------------------

export type CreateProposalResult =
  | { ok: true; proposal: SessionProposal }
  | { ok: false; error: string }

/**
 * Holds `start` for `userId` and records that they have not agreed to it yet.
 *
 * Order matters. The Cal booking is created first, because that is the step
 * that can fail — the slot may have gone in the seconds since the form was
 * drawn — and a proposal row pointing at a booking that was never made would
 * offer a time nobody holds. Once Cal accepts, the row follows.
 */
export async function createProposal(opts: {
  userId: string
  eventTypeSlug: string
  start: Date
  timeZone: string
  message?: string | null
  expiresAt?: Date
  now?: Date
}): Promise<CreateProposalResult> {
  const now = opts.now ?? new Date()

  const user = await prisma.user.findUnique({
    where: { id: opts.userId },
    select: { id: true, name: true, email: true, role: true, allowance: true },
  })
  if (!user) return { ok: false, error: 'That account no longer exists.' }

  // Blocked rather than allowed-and-warned: the BOOKING_CREATED webhook cancels
  // any booking made with no credit behind it, so proposing here would quietly
  // undo itself a second later and leave Millie thinking the time was held.
  if (user.allowance < 1) {
    return {
      ok: false,
      error: `${user.name ?? user.email} has no ${sessionNoun(user.role, true)} left, so the booking would be cancelled automatically. Add a credit first.`,
    }
  }

  if (opts.start.getTime() <= now.getTime() + MIN_LEAD_MS) {
    return { ok: false, error: 'Pick a time at least a couple of hours from now.' }
  }

  const eventType = await findEventType(opts.eventTypeSlug)
  if (!eventType) return { ok: false, error: 'That session type is no longer on the calendar.' }

  const expiresAt = clampExpiry(opts.expiresAt ?? new Date(now.getTime() + DEFAULT_TTL_MS), opts.start)

  let booking
  try {
    booking = await createBooking({
      eventTypeId: eventType.id,
      start: opts.start,
      attendee: {
        name: user.name ?? user.email,
        email: user.email,
        timeZone: opts.timeZone,
      },
      notes: opts.message
        ? `Time proposed by Millie. ${opts.message}`
        : 'Time proposed by Millie — waiting on confirmation.',
      metadata: { proposedByAdmin: 'true' },
    })
  } catch (err) {
    console.error('[proposals] Cal booking failed', err)
    if (err instanceof CalError) {
      return {
        ok: false,
        error:
          err.status === 400 || err.status === 409
            ? 'Cal.com would not take that slot — it may have just been booked. Refresh and pick another.'
            : err.message,
      }
    }
    return { ok: false, error: 'Could not reach Cal.com to hold the slot.' }
  }

  // The booking exists from here on. If this write throws, the slot is held
  // with nothing tracking it — logged loudly, because the fix is a manual
  // cancellation in Cal rather than anything the app can retry.
  try {
    const proposal = await prisma.sessionProposal.create({
      data: {
        userId: user.id,
        bookingUid: booking.uid,
        eventTypeId: eventType.id,
        eventTypeSlug: eventType.slug,
        title: booking.title ?? eventType.title,
        start: new Date(booking.start),
        end: new Date(booking.end ?? opts.start.getTime() + eventType.lengthInMinutes * 60000),
        timeZone: opts.timeZone,
        message: opts.message?.trim() || null,
        expiresAt,
      },
    })
    return { ok: true, proposal }
  } catch (err) {
    console.error('[proposals] Booking', booking.uid, 'was created but the proposal row was not', err)
    return {
      ok: false,
      error: `The slot was booked on Cal.com (${booking.uid}) but saving the proposal failed. Cancel that booking in Cal.com and try again.`,
    }
  }
}

/** Never past the answer deadline, never before now. */
function clampExpiry(wanted: Date, start: Date): Date {
  const latest = new Date(start.getTime() - MIN_LEAD_MS)
  return wanted.getTime() > latest.getTime() ? latest : wanted
}

// --- Responding -----------------------------------------------------------

export type RespondResult = { ok: true; status: ProposalStatus } | { ok: false; error: string }

/**
 * Accepting changes nothing on Cal — the booking has been real since it was
 * proposed. All that happens is the row stops being an open question, so the
 * sweep leaves it alone and the dashboard stops asking.
 */
export async function acceptProposal(id: string, now: Date = new Date()): Promise<RespondResult> {
  const claimed = await prisma.sessionProposal.updateMany({
    where: { id, status: 'PENDING', expiresAt: { gt: now } },
    data: { status: 'ACCEPTED', respondedAt: now },
  })

  if (claimed.count === 0) return { ok: false, error: await whyNotPending(id) }
  return { ok: true, status: 'ACCEPTED' }
}

/**
 * Declining, expiring and withdrawing are the same operation with different
 * names on it: give the slot back and refund the credit.
 *
 * The row is claimed before Cal is called, so two clicks on the decline button
 * cannot both cancel the booking — and the claim is rolled back if Cal refuses,
 * because a proposal marked declined against a booking that still exists would
 * hold the slot with nothing left to release it.
 */
async function releaseProposal(
  id: string,
  status: Extract<ProposalStatus, 'DECLINED' | 'EXPIRED' | 'WITHDRAWN'>,
  reason: string,
  now: Date,
  requireUnexpired: boolean
): Promise<RespondResult> {
  const claimed = await prisma.sessionProposal.updateMany({
    where: { id, status: 'PENDING', ...(requireUnexpired ? { expiresAt: { gt: now } } : {}) },
    data: { status, respondedAt: now },
  })

  if (claimed.count === 0) return { ok: false, error: await whyNotPending(id) }

  const proposal = await prisma.sessionProposal.findUnique({ where: { id } })
  if (!proposal) return { ok: false, error: 'That proposal no longer exists.' }

  try {
    await cancelBooking(proposal.bookingUid, reason)
  } catch (err) {
    console.error('[proposals] Cancel failed for', proposal.bookingUid, err)
    // A booking Cal has already lost is not a failure — the slot is free and
    // the status we just wrote is correct. Anything else goes back to PENDING
    // so it can be tried again.
    if (!(err instanceof CalError && err.status === 404)) {
      await prisma.sessionProposal.updateMany({
        where: { id, status },
        data: { status: 'PENDING', respondedAt: null },
      })
      return { ok: false, error: 'Could not release the slot on Cal.com. Try again in a moment.' }
    }
  }

  return { ok: true, status }
}

export function declineProposal(id: string, now: Date = new Date()): Promise<RespondResult> {
  return releaseProposal(id, 'DECLINED', PROPOSAL_CANCEL_REASONS.declined, now, true)
}

/** Millie taking a proposed time back. Allowed even once it has expired. */
export function withdrawProposal(id: string, now: Date = new Date()): Promise<RespondResult> {
  return releaseProposal(id, 'WITHDRAWN', PROPOSAL_CANCEL_REASONS.withdrawn, now, false)
}

async function whyNotPending(id: string): Promise<string> {
  const current = await prisma.sessionProposal.findUnique({
    where: { id },
    select: { status: true, expiresAt: true },
  })
  if (!current) return 'That proposal no longer exists.'
  if (current.status === 'ACCEPTED') return 'This time has already been confirmed.'
  if (current.status === 'DECLINED') return 'This time has already been declined.'
  if (current.status === 'WITHDRAWN') return 'Millie has taken this time back.'
  if (current.status === 'EXPIRED') return 'This proposal has expired and the slot was released.'
  return 'This proposal has expired and the slot was released.'
}

// --- Expiry sweep ---------------------------------------------------------

/**
 * Hands back the slots nobody answered for.
 *
 * Worth being clear about why this is not optional: every unanswered proposal
 * is a booked slot and a spent credit. Without a sweep, a student who ignores
 * an email costs Millie a bookable hour and costs them a lesson, indefinitely.
 */
export async function expireDueProposals(
  limit = 50,
  now: Date = new Date()
): Promise<{ expired: number; failed: number }> {
  const due = await prisma.sessionProposal.findMany({
    where: { status: 'PENDING', expiresAt: { lte: now } },
    orderBy: { expiresAt: 'asc' },
    take: limit,
    select: { id: true },
  })

  let expired = 0
  let failed = 0
  for (const { id } of due) {
    const result = await releaseProposal(id, 'EXPIRED', PROPOSAL_CANCEL_REASONS.expired, now, false)
    if (result.ok) expired++
    else failed++
  }

  return { expired, failed }
}
