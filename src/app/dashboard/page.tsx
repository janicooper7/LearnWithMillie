import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Stripe from 'stripe'
import CalEmbed from '@/app/components/CalEmbed'
import BookLessonCard from '@/app/components/BookLessonCard'
import CreditsCardActions from '@/app/components/CreditsCardActions'
import ChatButton from '@/app/components/ChatButton'
import AddonLessonsBanner from '@/app/components/AddonLessonsBanner'
import CancelBookingButton from '@/app/components/CancelBookingButton'
import CancelSubscriptionButton from '@/app/components/CancelSubscriptionButton'
import BookingTime from '@/app/components/BookingTime'
import { getMockBookings, mockBookingsEnabled, type CalBooking } from '@/lib/mockBookings'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true, image: true, role: true, allowance: true, trialPurchased: true, trialUsed: true, stripeSubscriptionId: true, addonLessonsEnabled: true },
  })

  if (!user) redirect('/auth/login')

  const isTeacher = user.role === 'TEACHER'
  const now = new Date()

  const myCourses = await prisma.userCourseAccess.findMany({
    where: { userId: user.id },
    include: {
      course: {
        select: {
          id: true, title: true, slug: true, thumbnail: true, isBundle: true,
          _count: { select: { lessons: true } },
          lessons: {
            select: {
              progress: { where: { userId: user.id }, select: { id: true, completedAt: true } },
            },
          },
        },
      },
    },
  })

  const displayCourses = myCourses.filter(({ course }) => !course.isBundle)

  const showCoursesCard = isTeacher

  const useMockBookings = mockBookingsEnabled()

  // Fetch Stripe + Cal.com in parallel
  const [stripeResult, calResult] = await Promise.allSettled([
    user.stripeSubscriptionId
      ? stripe.subscriptions.retrieve(user.stripeSubscriptionId)
      : Promise.resolve(null),
    useMockBookings
      ? Promise.resolve(null)
      : fetch(
        `https://api.cal.com/v2/bookings?attendeeEmail=${encodeURIComponent(user.email ?? '')}&status=upcoming`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
            'cal-api-version': '2024-08-13',
          },
          cache: 'no-store',
        }
      ),
  ])

  let cancelAtPeriodEnd = false
  let periodEnd: Date | null = null
  if (stripeResult.status === 'fulfilled' && stripeResult.value) {
    const sub = stripeResult.value as any
    cancelAtPeriodEnd = sub.cancel_at_period_end
    // current_period_end moved to items in newer Stripe API versions
    const periodEndTs = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end
    if (periodEndTs) periodEnd = new Date(periodEndTs * 1000)
  }

  // Reset date comes from Stripe billing period; fall back to signup day if no subscription
  const nextReset = periodEnd ?? (() => {
    const signupDay = user.createdAt.getDate()
    return now.getDate() < signupDay
      ? new Date(now.getFullYear(), now.getMonth(), signupDay)
      : new Date(now.getFullYear(), now.getMonth() + 1, signupDay)
  })()

  let upcomingBookings: CalBooking[] = []
  if (useMockBookings) {
    upcomingBookings = getMockBookings(now)
  } else if (calResult.status === 'fulfilled') {
    try {
      const res = calResult.value as Response
      if (res.ok) {
        const calData = await res.json()
        const all: CalBooking[] = calData.data ?? calData.bookings ?? []
        upcomingBookings = all
          .filter((b) => new Date(b.start) > now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 5)
      }
    } catch {}
  }


  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <ChatButton userName={user.name?.split(' ')[0] ?? 'there'} />

      <main className='max-w-5xl mx-auto px-6 py-12'>

        {/* Welcome */}
        <div className='mb-10'>
          <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            {isTeacher ? 'Teacher Portal' : 'Student Portal'}
          </p>
          <h1 className='text-3xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Welcome back, {user.name?.split(' ')[0] ?? 'there'}
          </h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

          {/* Add-on lessons — students only, when enabled */}
          {!isTeacher && user.addonLessonsEnabled && (
            <AddonLessonsBanner />
          )}

          {/* My Courses card — teachers only */}
          {showCoursesCard && (
          <div className='rounded-2xl p-5 sm:p-7 flex flex-col' style={{ backgroundColor: '#1F3A34' }}>
            <div className='w-0.5 h-8 rounded-full mb-5' style={{ backgroundColor: '#C2AA6A' }} />

            {displayCourses.length === 0 ? (
              <>
                <h2 className='text-lg sm:text-xl font-bold text-white mb-3' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  Ready to start learning?
                </h2>
                <p className='text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Browse Millie's video courses and learn at your own pace with lifetime access.
                </p>
                <div className='mt-auto pt-6'>
                  <a
                    href='/teachers/courses'
                    className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:brightness-110'
                    style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Browse Courses <ArrowRight className='w-4 h-4' />
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className='text-lg sm:text-xl font-bold text-white mb-4' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  My Courses
                </h2>
                <div className='flex flex-col gap-2.5 flex-1'>
                  {displayCourses.slice(0, 3).map(({ course }) => {
                    const total = course._count.lessons
                    const hasStarted = course.lessons.some((l) => l.progress.length > 0)
                    const completed = course.lessons.reduce(
                      (acc, l) => acc + (l.progress.some((p) => p.completedAt) ? 1 : 0),
                      0
                    )
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                    const isCompleted = total > 0 && completed === total
                    return (
                      <a
                        key={course.id}
                        href={`/learn/${course.slug}`}
                        className='flex items-center justify-between gap-3 rounded-xl p-3.5 transition-all duration-150 hover:bg-white/[0.13]'
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-white mb-1.5' style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                            {course.title}
                          </p>
                          <div className='w-full rounded-full h-1' style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                            <div className='h-1 rounded-full transition-all' style={{ width: `${pct}%`, backgroundColor: '#C2AA6A' }} />
                          </div>
                        </div>
                        {isCompleted ? (
                          <span className='flex items-center gap-1 text-xs font-semibold flex-shrink-0' style={{ color: '#7FD49A', fontFamily: 'var(--font-inter), sans-serif' }}>
                            <CheckCircle2 className='w-3.5 h-3.5' /> Completed
                          </span>
                        ) : (
                          <span className='text-xs font-semibold flex-shrink-0' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {hasStarted ? 'Continue →' : 'Start →'}
                          </span>
                        )}
                      </a>
                    )
                  })}
                </div>
                <div className='mt-5'>
                  <a
                    href='/teachers/courses'
                    className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:brightness-110'
                    style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {displayCourses.some(({ course }) => course.lessons.some((l) => l.progress.length > 0))
                      ? 'Continue Learning'
                      : 'Start Learning'} <ArrowRight className='w-4 h-4' />
                  </a>
                </div>
              </>
            )}
          </div>
          )}

          {/* Book a lesson / session */}
          <BookLessonCard trialPurchased={user.trialPurchased || user.trialUsed} isTeacher={isTeacher} />

        </div>

        {/* Subscription management — only if active */}
        {user.stripeSubscriptionId && (
          <div className='mt-5 bg-white rounded-2xl p-5 flex items-center justify-between' style={{ border: '1px solid #EDE4D8' }}>
            <div>
              <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Subscription</p>
              <div className='flex items-center gap-1.5 mt-1'>
                <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: cancelAtPeriodEnd ? '#c0392b' : '#2ecc71' }} />
                <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {cancelAtPeriodEnd && periodEnd
                    ? `Cancels ${periodEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
                    : 'Active'}
                </p>
              </div>
            </div>
            {!cancelAtPeriodEnd && <CancelSubscriptionButton />}
          </div>
        )}



        {/* Upcoming bookings — only shown if there are any */}
        {upcomingBookings.length > 0 && (
          <div className='mt-5 bg-white rounded-2xl p-5 sm:p-7' style={{ border: '1px solid #EDE4D8' }}>
            <p className='text-[11px] uppercase tracking-[0.12em] mb-4' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>{isTeacher ? 'Upcoming Sessions' : 'Upcoming Lessons'}</p>
            <div className='space-y-3'>
              {upcomingBookings.map((booking) => {
                return (
                  <div key={booking.uid} className='flex flex-col gap-3 p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4' style={{ backgroundColor: '#F4EDE4' }}>
                    <div className='flex items-center gap-4 min-w-0'>
                      <BookingTime start={booking.start} end={booking.end} />
                    </div>
                    <div className='flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end'>
                      {booking.meetingUrl && (
                        <a
                          href={booking.meetingUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-150 sm:text-[11px] sm:px-3 sm:py-1.5'
                          style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          Join
                        </a>
                      )}
                      <span className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap' style={{ backgroundColor: 'rgba(31,58,52,0.07)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        Confirmed
                      </span>
                      {!booking.eventType?.slug?.includes('trial') && (new Date(booking.start).getTime() - now.getTime() > 24 * 60 * 60 * 1000) && (
                        <CancelBookingButton uid={booking.uid} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Booking calendar */}
        <div className='mt-5 bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
          <div className='px-7 pt-7 pb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between' style={{ borderBottom: '1px solid #EDE4D8' }}>
            <div>
              <p className='text-[13px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>{isTeacher ? 'Book a Session' : 'Book a Lesson'}</p>
              <p className='text-[16px] font-medium mt-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                {user.allowance > 0 ? 'Use the calendar below to pick a time that works for you.' : isTeacher ? 'No sessions remaining' : 'No lessons remaining'}
              </p>
              <p className='text-[14px] mt-1.5' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Not seeing a time that works for you? Drop me a message and I'll make sure we find a time that works best for both of us.
              </p>
            </div>
            <div className='self-start sm:self-auto flex items-center gap-2 px-6 py-2 rounded-xl' style={{ backgroundColor: 'rgba(31,58,52,0.06)' }}>
              <span className='text-lg font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{user.allowance}</span>
              <span className='text-[14px] whitespace-nowrap' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {isTeacher ? (user.allowance === 1 ? 'session left' : 'sessions left') : (user.allowance === 1 ? 'lesson left' : 'lessons left')}
              </span>
            </div>
          </div>

          <CalEmbed
            src={`${
              isTeacher
                ? 'https://cal.com/millie-cooper-rqg072/mentorship-session-with-millie-cooper'
                : user.stripeSubscriptionId || user.trialUsed
                  ? process.env.CAL_EVENT_URL
                  : 'https://cal.com/millie-cooper-rqg072/trial-lesson-with-millie-cooper'
            }?embed=true&name=${encodeURIComponent(user.name ?? '')}&email=${encodeURIComponent(user.email ?? '')}`}
            allowance={user.allowance}
            nextReset={nextReset.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
            trialPurchased={user.trialPurchased}
            isTeacher={isTeacher}
          />
        </div>


      </main>
    </div>
  )
}
