import { getMockBookings, mockBookingsEnabled, type CalBooking } from '@/lib/mockBookings'

const CAL_BOOKINGS_URL = 'https://api.cal.com/v2/bookings'
const PAGE_SIZE = 100
// A safety net rather than a real limit — 500 upcoming sessions is far beyond
// anything a one-tutor calendar holds, so hitting this means something is wrong.
const MAX_PAGES = 5

export type AdminBookingsResult = {
  bookings: CalBooking[]
  /** Human-readable reason the list is empty, or null when the fetch worked. */
  error: string | null
}

/**
 * Every upcoming booking on Millie's calendar, for the admin view.
 *
 * The student and teacher dashboards ask Cal for one person's bookings
 * (`attendeeEmail=...`). Dropping that filter gives back the whole calendar for
 * the account the API key belongs to, which is exactly the admin's question:
 * "who am I seeing next, and when".
 */
export async function getAllUpcomingBookings(now: Date = new Date()): Promise<AdminBookingsResult> {
  if (mockBookingsEnabled()) {
    return { bookings: getMockBookings(now), error: null }
  }

  if (!process.env.CAL_API_KEY) {
    return { bookings: [], error: 'CAL_API_KEY is not set, so the calendar could not be read.' }
  }

  const collected: CalBooking[] = []

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(CAL_BOOKINGS_URL)
      url.searchParams.set('status', 'upcoming')
      url.searchParams.set('take', String(PAGE_SIZE))
      url.searchParams.set('skip', String(page * PAGE_SIZE))

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
          'cal-api-version': '2024-08-13',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        console.error('[admin-bookings] Cal API error', res.status, await res.text())
        return { bookings: [], error: `Cal.com returned ${res.status} when listing bookings.` }
      }

      const data = await res.json()
      const batch: CalBooking[] = data?.data ?? data?.bookings ?? []
      collected.push(...batch)
      if (batch.length < PAGE_SIZE) break
    }
  } catch (err) {
    console.error('[admin-bookings] Cal fetch failed', err)
    return { bookings: [], error: 'Could not reach Cal.com.' }
  }

  // Cal's `upcoming` status includes the session currently in progress, and its
  // ordering isn't guaranteed, so filter and sort ourselves.
  const bookings = collected
    .filter((b) => new Date(b.end) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return { bookings, error: null }
}
