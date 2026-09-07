import type { CalBooking } from '@/lib/mockBookings'

/**
 * The Cal.com v2 API, as much of it as this site actually uses.
 *
 * Reads that already existed (the dashboard's own bookings, the admin
 * calendar) still call Cal inline where they are. What lives here is
 * everything the proposal flow needs — looking up event types, asking what is
 * free, and creating or cancelling a booking on someone's behalf.
 *
 * Cal versions its endpoints individually and they are not interchangeable, so
 * each call below pins the version that endpoint documents rather than sharing
 * one constant.
 */

const API = 'https://api.cal.com/v2'

/**
 * Cancellation reasons that mean "this was never agreed to".
 *
 * The webhook refunds an ordinary cancellation only outside the 24-hour
 * window, which is the right rule for someone dropping a lesson they booked.
 * It is the wrong rule for a proposal: the student never chose this time, so
 * saying no to it — or never answering — must always give the credit back, at
 * any notice. The webhook matches on these exact strings, so they are declared
 * once, here, rather than typed out at each call site.
 */
export const PROPOSAL_CANCEL_REASONS = {
  declined: 'Proposed time declined by student.',
  expired: 'Proposed time expired without a reply.',
  withdrawn: 'Proposed time withdrawn by Millie.',
} as const

export type ProposalCancelReason =
  (typeof PROPOSAL_CANCEL_REASONS)[keyof typeof PROPOSAL_CANCEL_REASONS]

const CANCEL_REASON_VALUES: string[] = Object.values(PROPOSAL_CANCEL_REASONS)

/** True when a BOOKING_CANCELLED webhook is one of ours undoing a proposal. */
export function isProposalCancellation(reason: string): boolean {
  return CANCEL_REASON_VALUES.includes(reason)
}

export class CalError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'CalError'
  }
}

function apiKey(): string {
  const key = process.env.CAL_API_KEY
  if (!key) throw new CalError('CAL_API_KEY is not set.')
  return key
}

async function call<T>(
  path: string,
  opts: { version: string; method?: string; body?: unknown; query?: Record<string, string> }
): Promise<T> {
  const url = new URL(API + path)
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    method: opts.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'cal-api-version': opts.version,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
    cache: 'no-store',
  })

  const text = await res.text()
  if (!res.ok) {
    console.error('[cal]', opts.method ?? 'GET', path, res.status, text)
    throw new CalError(`Cal.com returned ${res.status}.`, res.status)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new CalError('Cal.com returned a response that could not be read.')
  }
}

/**
 * The account the API key belongs to, taken from the booking URL rather than
 * its own environment variable — CAL_EVENT_URL is already required for the
 * student embed to work at all, so deriving it here keeps the two from being
 * configured to disagree.
 */
export function calUsername(): string {
  const url = process.env.CAL_EVENT_URL
  const username = url ? new URL(url).pathname.split('/').filter(Boolean)[0] : null
  if (!username) throw new CalError('CAL_EVENT_URL is not set, so the Cal.com account is unknown.')
  return username
}

export type CalEventType = {
  id: number
  slug: string
  title: string
  lengthInMinutes: number
  /** Shortest notice Cal will accept a booking on, in minutes. */
  minimumBookingNotice: number
}

// Event types change about once a year, and a stale entry only means a booking
// is attempted against an id Cal will reject with a clear error. Worth caching
// for a process lifetime to keep a lookup off every slot request.
let eventTypeCache: { at: number; types: CalEventType[] } | null = null
const EVENT_TYPE_TTL_MS = 10 * 60 * 1000

export async function listEventTypes(): Promise<CalEventType[]> {
  if (eventTypeCache && Date.now() - eventTypeCache.at < EVENT_TYPE_TTL_MS) {
    return eventTypeCache.types
  }

  const data = await call<{ data?: CalEventType[] }>('/event-types', {
    version: '2024-06-14',
    query: { username: calUsername() },
  })

  const types = (data.data ?? []).map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    lengthInMinutes: t.lengthInMinutes,
    minimumBookingNotice: t.minimumBookingNotice ?? 0,
  }))

  eventTypeCache = { at: Date.now(), types }
  return types
}

export async function findEventType(slug: string): Promise<CalEventType | null> {
  const types = await listEventTypes()
  return types.find((t) => t.slug === slug) ?? null
}

export type CalSlot = { start: string }

/**
 * Free slots between two instants, as Cal sees them — the same availability the
 * student-facing embed draws from, so a time offered here is a time that was
 * genuinely bookable when it was offered.
 *
 * Returned grouped by day, keyed by the calendar date *in `timeZone`*. That
 * grouping is Cal's own, and it is why the timezone matters to a list of
 * instants: 23:30 in London is the next day in Berlin.
 */
export async function getSlots(opts: {
  eventTypeId: number
  start: Date
  end: Date
  timeZone: string
}): Promise<Record<string, CalSlot[]>> {
  const data = await call<{ data?: Record<string, CalSlot[]> }>('/slots', {
    version: '2024-09-04',
    query: {
      eventTypeId: String(opts.eventTypeId),
      start: opts.start.toISOString(),
      end: opts.end.toISOString(),
      timeZone: opts.timeZone,
    },
  })
  return data.data ?? {}
}

export type CreatedBooking = {
  uid: string
  start: string
  end: string
  title?: string
}

/**
 * Books `start` in someone else's name.
 *
 * This is the step that makes a proposal real: the slot leaves the public
 * calendar here, not when the student accepts. Cal treats it as an ordinary
 * booking, which is the point — the BOOKING_CREATED webhook fires and spends
 * the credit exactly as it would for a booking the student made themselves.
 */
export async function createBooking(opts: {
  eventTypeId: number
  start: Date
  attendee: { name: string; email: string; timeZone: string }
  /** Goes into the booking's notes, so it shows on the calendar invite. */
  notes?: string
  metadata?: Record<string, string>
}): Promise<CreatedBooking> {
  const data = await call<{ data?: CreatedBooking }>('/bookings', {
    version: '2024-08-13',
    method: 'POST',
    body: {
      eventTypeId: opts.eventTypeId,
      start: opts.start.toISOString(),
      attendee: {
        name: opts.attendee.name,
        email: opts.attendee.email,
        timeZone: opts.attendee.timeZone,
        language: 'en',
      },
      ...(opts.notes ? { bookingFieldsResponses: { notes: opts.notes } } : {}),
      ...(opts.metadata ? { metadata: opts.metadata } : {}),
    },
  })

  const booking = data.data
  if (!booking?.uid) throw new CalError('Cal.com created the booking but returned no uid.')
  return booking
}

export async function cancelBooking(uid: string, reason: string): Promise<void> {
  await call(`/bookings/${encodeURIComponent(uid)}/cancel`, {
    version: '2024-08-13',
    method: 'POST',
    body: { cancellationReason: reason },
  })
}

export async function getBooking(uid: string): Promise<CalBooking | null> {
  try {
    const data = await call<{ data?: CalBooking }>(`/bookings/${encodeURIComponent(uid)}`, {
      version: '2024-08-13',
    })
    return data.data ?? null
  } catch (err) {
    if (err instanceof CalError && err.status === 404) return null
    throw err
  }
}
