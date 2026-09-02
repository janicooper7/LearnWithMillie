import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowRight, CheckCircle2, Info } from 'lucide-react'
import Stripe from 'stripe'
import CalEmbed from '@/app/components/CalEmbed'
import BookLessonCard from '@/app/components/BookLessonCard'
import CreditsCardActions from '@/app/components/CreditsCardActions'
import ChatButton from '@/app/components/ChatButton'
import AddonLessonsBanner from '@/app/components/AddonLessonsBanner'
import CancelBookingButton from '@/app/components/CancelBookingButton'
import CancelSubscriptionButton from '@/app/components/CancelSubscriptionButton'
import BookingTime from '@/app/components/BookingTime'
import OnboardingChecklist from '@/app/components/OnboardingChecklist'
import ChoosePlanButton from '@/app/components/ChoosePlanButton'
import { getMockBookings, mockBookingsEnabled, type CalBooking } from '@/lib/mockBookings'
import { subscriptionPlan } from '@/lib/plans'
import { getMockSubscription, mockSubscriptionEnabled } from '@/lib/mockSubscription'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true, image: true, role: true, allowance: true, trialPurchased: true, trialUsed: true, stripeSubscriptionId: true, addonLessonsEnabled: true, upcomingLessons: true },
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
  const useMockSubscription = mockSubscriptionEnabled()

  // Fetch Stripe + Cal.com in parallel
  const [stripeResult, calResult] = await Promise.allSettled([
    user.stripeSubscriptionId && !useMockSubscription
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
  let planName: string | null = null
  let planLessons: number | null = null
  let priceLabel: string | null = null
  const subscription: any = useMockSubscription
    ? getMockSubscription(now)
    : stripeResult.status === 'fulfilled'
      ? stripeResult.value
      : null
  // Stripe is the source of truth for whether the plan is still live. Our row can
  // go stale — a cancellation done in the Stripe dashboard, or a missed
  // customer.subscription.deleted webhook, leaves stripeSubscriptionId set.
  let subscriptionEnded = false
  if (subscription) {
    const sub = subscription
    subscriptionEnded = ['canceled', 'incomplete_expired', 'unpaid'].includes(sub.status)
    cancelAtPeriodEnd = sub.cancel_at_period_end
    // current_period_end moved to items in newer Stripe API versions
    const periodEndTs = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end
    if (periodEndTs) periodEnd = new Date(periodEndTs * 1000)

    // Plan name comes from our own price map; the amount charged comes straight
    // from Stripe, so a price change in the dashboard shows up here immediately.
    const item = sub.items?.data?.[0]
    const plan = subscriptionPlan(item?.price?.id)
    planName = plan?.name ?? null
    planLessons = plan?.lessons ?? null

    const amount = item?.price?.unit_amount
    if (typeof amount === 'number') {
      const fractionDigits = amount % 100 === 0 ? 0 : 2
      const currency = (item.price.currency ?? 'usd').toUpperCase()
      priceLabel = new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(amount / 100)
    }
  }

  const formatDay = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const subscriptionFacts = [
    priceLabel && { label: 'Price', value: `${priceLabel} / month` },
    planLessons && { label: 'Lessons', value: `${planLessons} per month` },
    periodEnd && { label: cancelAtPeriodEnd ? 'Access until' : 'Renews', value: formatDay(periodEnd) },
  ].filter(Boolean) as { label: string; value: string }[]

  // Reset date comes from Stripe billing period; fall back to signup day if no subscription
  const nextReset = periodEnd ?? (() => {
    const signupDay = user.createdAt.getDate()
    return now.getDate() < signupDay
      ? new Date(now.getFullYear(), now.getMonth(), signupDay)
      : new Date(now.getFullYear(), now.getMonth() + 1, signupDay)
  })()
  const nextResetLabel = nextReset.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

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


  // Only Stripe explicitly saying "canceled" retires the card — an API blip
  // leaves subscription null, and we keep trusting our own row.
  const hasSubscription = (!!user.stripeSubscriptionId || useMockSubscription) && !subscriptionEnded

  const trialDone = user.trialPurchased || user.trialUsed || hasSubscription
  const bookingDone = user.trialUsed || user.upcomingLessons > 0 || upcomingBookings.length > 0
  const planDone = hasSubscription
  // Getting started ends once they've bought and booked — the plan step lives on
  // permanently in the subscription card, so nobody gets a "first steps" banner
  // months into their time here just because they're between plans.
  const showChecklist = user.role === 'STUDENT' && !(trialDone && bookingDone)
  // Anyone past getting started can top up, whether or not an admin flipped the
  // per-user switch — the toggle now only matters for students still onboarding.
  const isActiveStudent = !isTeacher && trialDone && bookingDone
  const showAddons = !isTeacher && (isActiveStudent || user.addonLessonsEnabled)
  const showSubscriptionCard = hasSubscription || !isTeacher
  const showResetWarning = !isTeacher && hasSubscription && user.allowance > 0

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

        {/* Getting started checklist — students who haven't finished setting up */}
        {showChecklist && (
          <OnboardingChecklist trialDone={trialDone} bookingDone={bookingDone} planDone={planDone} />
        )}

        {isTeacher && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

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

          {/* Book a session — teachers only. Students get their buy/book calls to
              action from the checklist, the subscription card and the top-up. */}
          <BookLessonCard trialPurchased={user.trialPurchased || user.trialUsed} isTeacher={isTeacher} />

        </div>
        )}

        {/* Subscription alongside the add-on top-up — full width if only one shows */}
        {(showSubscriptionCard || showAddons) && (
        <div className={`grid grid-cols-1 gap-5 mt-5 ${showSubscriptionCard && showAddons ? 'md:grid-cols-2' : ''}`}>

        {showSubscriptionCard && (
          <div className='bg-white rounded-2xl p-5 sm:p-7 flex flex-col' style={{ border: '1px solid #EDE4D8' }}>
            <div className='min-w-0'>
              <p className='text-[13px] uppercase tracking-[0.12em] font-semibold' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>Subscription</p>

              <div className='flex flex-wrap items-center gap-3 mt-1.5'>
                <h3 className='text-xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {!hasSubscription ? 'No active plan' : planName ? `${planName} plan` : 'Monthly plan'}
                </h3>
                <span
                  className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap'
                  style={{
                    backgroundColor: !hasSubscription ? 'rgba(31,58,52,0.07)' : cancelAtPeriodEnd ? 'rgba(192,57,43,0.1)' : 'rgba(46,204,113,0.14)',
                    color: !hasSubscription ? 'rgba(31,58,52,0.5)' : cancelAtPeriodEnd ? '#c0392b' : '#1E8449',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {!hasSubscription ? 'Inactive' : cancelAtPeriodEnd ? 'Cancelled' : 'Active'}
                </span>
              </div>

              {!hasSubscription && (
                <p className='text-sm leading-relaxed mt-3' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Pick a monthly plan to get lessons every month at a lower price per lesson. Cancel whenever you like — you keep the lessons you&apos;ve already paid for.
                </p>
              )}

              {hasSubscription && subscriptionFacts.length > 0 && (
                <dl className='flex flex-wrap gap-x-8 gap-y-3 mt-5'>
                  {subscriptionFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {fact.label}
                      </dt>
                      <dd className='text-sm font-medium mt-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className='mt-auto pt-5' style={{ borderTop: '1px solid #EDE4D8' }}>
              {!hasSubscription ? (
                <ChoosePlanButton trialPurchased={trialDone} />
              ) : cancelAtPeriodEnd ? (
                <ChoosePlanButton trialPurchased={trialDone} label='Change your plan' />
              ) : (
                <CancelSubscriptionButton />
              )}
            </div>
          </div>
        )}

        {/* Add-on lessons — students only, when enabled */}
        {showAddons && <AddonLessonsBanner />}

        </div>
        )}



        {/* Upcoming bookings — only shown if there are any */}
        {upcomingBookings.length > 0 && (
          <div className='mt-5 bg-white rounded-2xl p-5 sm:p-7' style={{ border: '1px solid #EDE4D8' }}>
            <p className='text-[13px] uppercase tracking-[0.12em] font-semibold mb-4' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>{isTeacher ? 'Upcoming Sessions' : 'Upcoming Lessons'}</p>
            <div className='space-y-3'>
              {upcomingBookings.map((booking) => {
                return (
                  <div key={booking.uid} className='flex flex-col gap-3 p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4' style={{ backgroundColor: '#1F3A34' }}>
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
                          style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          Join
                        </a>
                      )}
                      <span className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap' style={{ backgroundColor: 'rgba(127,212,154,0.15)', color: '#7FD49A', fontFamily: 'var(--font-inter), sans-serif' }}>
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
        <div id='book-lesson' className='mt-5 bg-white rounded-2xl overflow-hidden scroll-mt-6' style={{ border: '1px solid #EDE4D8' }}>
          <div className='px-7 pt-7 pb-5' style={{ borderBottom: '1px solid #EDE4D8' }}>
            <p className='text-[13px] uppercase tracking-[0.12em] font-semibold' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>{isTeacher ? 'Book a Session' : 'Book a Lesson'}</p>
            <p className='text-xl font-medium mt-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
              {user.allowance > 0 ? 'Use the calendar below to pick a time that works for you.' : isTeacher ? 'No sessions remaining' : 'No lessons remaining'}
            </p>

            <div className='mt-5 flex flex-col gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:gap-5' style={{ backgroundColor: 'rgba(31,58,52,0.06)' }}>
              {/* Stacked only when it sits beside the reset note; on its own it
                  reads better as a single line. */}
              <div className={showResetWarning ? 'flex flex-col items-center text-center flex-shrink-0 sm:min-w-[7rem]' : 'flex items-baseline gap-2.5 flex-shrink-0'}>
                <span className='text-3xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{user.allowance}</span>
                <span className={`text-[16px] whitespace-nowrap ${showResetWarning ? 'mt-1' : ''}`} style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {isTeacher ? (user.allowance === 1 ? 'session left' : 'sessions left') : (user.allowance === 1 ? 'lesson left' : 'lessons left')}
                </span>
              </div>

              {/* Only subscribers get a reset — one-off trial and mentorship
                  credits sit there until they're used. */}
              {showResetWarning && (
                <>
                  <div className='hidden sm:block w-px self-stretch flex-shrink-0' style={{ backgroundColor: 'rgba(31,58,52,0.12)' }} />
                  <p className='text-[13px] leading-relaxed' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Lessons can only be booked for dates inside your current billing cycle, which ends on <span style={{ color: '#1F3A34', fontWeight: 600 }}>{nextResetLabel}</span>. Your allowance resets that day and any lessons you haven&apos;t booked are lost.
                  </p>
                </>
              )}
            </div>

            <div className='mt-4 flex items-start gap-2.5'>
              <Info className='w-4 h-4 flex-shrink-0 mt-0.5' style={{ color: '#C2AA6A' }} />
              <p className='text-[14px] leading-relaxed' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Not seeing a time that works for you? Drop me a message and I&apos;ll make sure we find a time that works best for both of us.
              </p>
            </div>
          </div>

          <CalEmbed
            src={`${
              isTeacher
                ? 'https://cal.com/millie-cooper-rqg072/mentorship-session-with-millie-cooper'
                : hasSubscription || user.trialUsed
                  ? process.env.CAL_EVENT_URL
                  : 'https://cal.com/millie-cooper-rqg072/trial-lesson-with-millie-cooper'
            }?embed=true&name=${encodeURIComponent(user.name ?? '')}&email=${encodeURIComponent(user.email ?? '')}`}
            allowance={user.allowance}
            nextReset={nextResetLabel}
            trialPurchased={user.trialPurchased}
            isTeacher={isTeacher}
          />
        </div>


      </main>
    </div>
  )
}
