import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getAllUpcomingBookings } from '@/lib/adminBookings'
import type { CalBooking } from '@/lib/mockBookings'

export const dynamic = 'force-dynamic'

/**
 * Every upcoming session on Millie's calendar, in one list.
 *
 * The student and teacher dashboards each show one person their own bookings.
 * This is the other side of the same data: the whole calendar, with the attendee
 * matched back to their account so a booking shows who it is and what they're on.
 *
 * Times are pinned to UK time rather than the server's timezone — the only
 * person reading this page is in the UK, and a fixed zone keeps the server and
 * browser rendering the same string.
 */

const TZ = 'Europe/London'

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
const dayLabelFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })
const timeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })

function sessionType(booking: CalBooking): { label: string; tone: 'trial' | 'mentorship' | 'lesson' } {
  const slug = booking.eventType?.slug?.toLowerCase() ?? booking.title?.toLowerCase() ?? ''
  if (slug.includes('trial')) return { label: 'Trial', tone: 'trial' }
  if (slug.includes('mentorship')) return { label: 'Mentorship', tone: 'mentorship' }
  return { label: 'Lesson', tone: 'lesson' }
}

const TYPE_STYLES: Record<'trial' | 'mentorship' | 'lesson', string> = {
  trial: 'bg-[#C2AA6A]/25 text-[#8a6f2e]',
  mentorship: 'bg-[#1F3A34]/10 text-[#1F3A34]',
  lesson: 'bg-[#7FD49A]/20 text-[#1E8449]',
}

export default async function AdminSessionsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()
  const { bookings, error } = await getAllUpcomingBookings(now)

  // Match attendees back to accounts so a row can say who this actually is.
  // Cal stores whatever email they typed at booking time, so compare lowercased.
  const attendeeEmails = Array.from(
    new Set(
      bookings
        .map((b) => b.attendees?.[0]?.email?.toLowerCase())
        .filter((e): e is string => !!e)
    )
  )

  const users = attendeeEmails.length
    ? await prisma.user.findMany({
        where: { email: { in: attendeeEmails, mode: 'insensitive' } },
        select: { id: true, name: true, email: true, role: true, allowance: true },
      })
    : []

  const usersByEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]))

  // Group into days, keeping the sorted order the fetch already put them in.
  const days: { key: string; label: string; bookings: CalBooking[] }[] = []
  for (const booking of bookings) {
    const start = new Date(booking.start)
    const key = dayKeyFmt.format(start)
    const last = days[days.length - 1]
    if (last?.key === key) last.bookings.push(booking)
    else days.push({ key, label: dayLabelFmt.format(start), bookings: [booking] })
  }

  const todayKey = dayKeyFmt.format(now)
  const tomorrowKey = dayKeyFmt.format(new Date(now.getTime() + 24 * 60 * 60 * 1000))

  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const todayCount = bookings.filter((b) => dayKeyFmt.format(new Date(b.start)) === todayKey).length
  const weekCount = bookings.filter((b) => new Date(b.start) <= weekEnd).length
  const peopleCount = new Set(
    bookings.map((b) => b.attendees?.[0]?.email?.toLowerCase() ?? b.uid)
  ).size

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-5xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-[#1F3A34]'>Upcoming sessions</h1>
            <p className='text-sm text-[#1F3A34]/60 mt-1'>
              Everything booked with you from now on, straight from Cal.com. Times are UK time.
            </p>
          </div>
          <Link
            href='/admin'
            className='bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'
          >
            Back to admin
          </Link>
        </div>

        {error && (
          <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
          <Stat label='Total upcoming' value={bookings.length} />
          <Stat label='Today' value={todayCount} />
          <Stat label='Next 7 days' value={weekCount} />
          <Stat label='People' value={peopleCount} />
        </div>

        {days.length === 0 ? (
          <div className='bg-white rounded-xl border border-[#EDE4D8] px-6 py-12 text-center text-[#1F3A34]/50'>
            {error ? 'No sessions could be loaded.' : 'Nothing booked in yet.'}
          </div>
        ) : (
          <div className='space-y-6'>
            {days.map((day) => (
              <section key={day.key}>
                <div className='flex items-baseline gap-3 mb-2 px-1'>
                  <h2 className='text-sm font-semibold uppercase tracking-wider text-[#1F3A34]'>
                    {day.key === todayKey ? 'Today' : day.key === tomorrowKey ? 'Tomorrow' : day.label}
                  </h2>
                  {(day.key === todayKey || day.key === tomorrowKey) && (
                    <span className='text-xs text-[#1F3A34]/45'>{day.label}</span>
                  )}
                  <span className='text-xs text-[#1F3A34]/45 ml-auto'>
                    {day.bookings.length} {day.bookings.length === 1 ? 'session' : 'sessions'}
                  </span>
                </div>

                <div className='bg-white rounded-xl border border-[#EDE4D8] overflow-hidden'>
                  {day.bookings.map((booking, i) => {
                    const start = new Date(booking.start)
                    const end = new Date(booking.end)
                    const minutes = Math.round((end.getTime() - start.getTime()) / 60000)
                    const attendee = booking.attendees?.[0]
                    const email = attendee?.email?.toLowerCase()
                    const account = email ? usersByEmail.get(email) : undefined
                    const type = sessionType(booking)
                    const inProgress = start <= now && end > now

                    return (
                      <div
                        key={booking.uid}
                        className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 ${
                          i > 0 ? 'border-t border-[#EDE4D8]' : ''
                        }`}
                      >
                        <div className='sm:w-32 flex-shrink-0'>
                          <div className='text-base font-semibold text-[#1F3A34] tabular-nums'>
                            {timeFmt.format(start)} – {timeFmt.format(end)}
                          </div>
                          <div className='text-xs text-[#1F3A34]/45'>
                            {minutes} min{inProgress && ' · on now'}
                          </div>
                        </div>

                        <div className='min-w-0 flex-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='font-medium text-[#1F3A34] truncate'>
                              {account?.name || attendee?.name || 'Unknown attendee'}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLES[type.tone]}`}>
                              {type.label}
                            </span>
                            {account?.role === 'TEACHER' && (
                              <span className='rounded-full bg-[#1F3A34]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1F3A34]'>
                                Teacher
                              </span>
                            )}
                            {!account && (
                              <span className='rounded-full bg-[#1F3A34]/[0.06] px-2.5 py-0.5 text-xs font-medium text-[#1F3A34]/50'>
                                No account
                              </span>
                            )}
                          </div>
                          <div className='text-xs text-[#1F3A34]/50 mt-0.5 truncate'>
                            {attendee?.email ?? 'No email on the booking'}
                            {attendee?.timeZone && ` · ${attendee.timeZone.replace(/_/g, ' ')}`}
                            {account && ` · ${account.allowance} left`}
                          </div>
                        </div>

                        <div className='flex items-center gap-2 sm:flex-shrink-0'>
                          <a
                            href={`https://app.cal.com/booking/${booking.uid}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1F3A34]/20 text-[#1F3A34]/70 hover:bg-[#1F3A34]/5 transition-colors'
                          >
                            Details
                          </a>
                          {booking.meetingUrl && (
                            <a
                              href={booking.meetingUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs font-semibold px-3 py-1.5 rounded-lg text-white bg-[#C2AA6A] hover:brightness-110 transition-all'
                            >
                              Join
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className='bg-white rounded-xl border border-[#EDE4D8] px-4 py-3'>
      <div className='text-xs uppercase tracking-wider text-[#1F3A34]/50'>{label}</div>
      <div className='text-2xl font-bold mt-0.5 text-[#1F3A34]'>{value}</div>
    </div>
  )
}
