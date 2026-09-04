export type CalAttendee = {
  name?: string
  email?: string
  timeZone?: string
}

export type CalBooking = {
  uid: string
  title: string
  start: string
  end: string
  status: string
  meetingUrl?: string
  eventType?: { slug?: string }
  // Only the admin view reads these — a student's own bookings are all their own.
  attendees?: CalAttendee[]
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/**
 * Local-only stand-in for the Cal.com bookings API, so the dashboard's
 * upcoming-bookings UI can be worked on without real bookings on the calendar.
 * Never returns anything unless MOCK_BOOKINGS=1 and we're off production.
 */
export function mockBookingsEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.MOCK_BOOKINGS === '1'
}

export function getMockBookings(now: Date = new Date()): CalBooking[] {
  // Times are derived from the offset rather than pinned to a wall-clock hour, so
  // each booking stays in its intended bucket (inside/outside the 24h cancel window)
  // no matter what time of day the page is loaded. Minutes are snapped for realism.
  const at = (offsetMs: number, minute: number, lengthMin: number) => {
    const d = new Date(now.getTime() + offsetMs)
    d.setMinutes(minute, 0, 0)
    return { start: d.toISOString(), end: new Date(d.getTime() + lengthMin * 60 * 1000).toISOString() }
  }

  return [
    {
      uid: 'mock-within-24h',
      title: 'English lesson with Millie Cooper',
      ...at(8 * HOUR, 0, 50),
      status: 'accepted',
      meetingUrl: 'https://meet.example.com/mock-within-24h',
      eventType: { slug: 'lesson-with-millie-cooper' },
      attendees: [{ name: 'Ana Ruiz', email: 'ana.ruiz@example.com', timeZone: 'Europe/Madrid' }],
    },
    {
      uid: 'mock-trial',
      title: 'Trial lesson with Millie Cooper',
      ...at(2 * DAY, 0, 30),
      status: 'accepted',
      meetingUrl: 'https://meet.example.com/mock-trial',
      eventType: { slug: 'trial-lesson-with-millie-cooper' },
      attendees: [{ name: 'Kenji Watanabe', email: 'kenji@example.com', timeZone: 'Asia/Tokyo' }],
    },
    {
      uid: 'mock-cancellable',
      title: 'English lesson with Millie Cooper',
      ...at(4 * DAY, 30, 50),
      status: 'accepted',
      meetingUrl: 'https://meet.example.com/mock-cancellable',
      eventType: { slug: 'lesson-with-millie-cooper' },
      attendees: [{ name: 'Ana Ruiz', email: 'ana.ruiz@example.com', timeZone: 'Europe/Madrid' }],
    },
    {
      uid: 'mock-mentorship',
      title: 'Mentorship session with Millie Cooper',
      ...at(9 * DAY, 0, 60),
      status: 'accepted',
      eventType: { slug: 'mentorship-session-with-millie-cooper' },
      attendees: [{ name: 'Priya Shah', email: 'priya.shah@example.com', timeZone: 'Europe/London' }],
    },
  ]
}
