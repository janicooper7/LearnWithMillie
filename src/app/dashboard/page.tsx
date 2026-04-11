import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { User, Mail, Calendar } from 'lucide-react'
import Stripe from 'stripe'
import CancelSubscriptionButton from '@/app/components/CancelSubscriptionButton'
import CalEmbed from '@/app/components/CalEmbed'

export default async function DashboardPage() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true, image: true, role: true, allowance: true, stripeSubscriptionId: true },
  })

  if (!user) redirect('/auth/login')

  const signupDay = user.createdAt.getDate()
  const now = new Date()
  const nextReset = now.getDate() < signupDay
    ? new Date(now.getFullYear(), now.getMonth(), signupDay)
    : new Date(now.getFullYear(), now.getMonth() + 1, signupDay)

  let cancelAtPeriodEnd = false
  let periodEnd: Date | null = null
  if (user.stripeSubscriptionId) {
    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId) as any
    cancelAtPeriodEnd = sub.cancel_at_period_end
    periodEnd = new Date(sub.current_period_end * 1000)
  }

  // Fetch upcoming bookings from Cal.com
  type CalBooking = { uid: string; title: string; startTime: string; endTime: string; status: string }
  let upcomingBookings: CalBooking[] = []
  try {
    const calRes = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${process.env.CAL_API_KEY}&attendeeEmail=${encodeURIComponent(user.email ?? '')}&status=upcoming`,
      { next: { revalidate: 60 } }
    )
    if (calRes.ok) {
      const calData = await calRes.json()
      const all: CalBooking[] = calData.bookings ?? []
      upcomingBookings = all
        .filter((b) => new Date(b.startTime) > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5)
    }
  } catch {}


  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>

      <main className='max-w-5xl mx-auto px-6 py-12'>

        {/* Welcome */}
        <div className='mb-10'>
          <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            Student Portal
          </p>
          <h1 className='text-3xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Welcome back, {user.name?.split(' ')[0] ?? 'there'}
          </h1>
        </div>

        <div className='grid md:grid-cols-2 gap-5'>

          {/* Profile card */}
          <div className='bg-white rounded-2xl p-7' style={{ border: '1px solid #EDE4D8' }}>
            <h2 className='text-sm font-semibold uppercase tracking-[0.15em] mb-6' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
              My Account
            </h2>
            <div className='space-y-5'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
                  <User className='w-4 h-4' style={{ color: '#1F3A34' }} />
                </div>
                <div>
                  <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Name</p>
                  <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>{user.name ?? '—'}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
                  <Mail className='w-4 h-4' style={{ color: '#1F3A34' }} />
                </div>
                <div>
                  <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Email</p>
                  <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>{user.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
                  <Calendar className='w-4 h-4' style={{ color: '#1F3A34' }} />
                </div>
                <div>
                  <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Member since</p>
                  <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {user.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Book a lesson */}
          <div
            className='rounded-2xl p-7 flex flex-col justify-between'
            style={{ backgroundColor: '#1F3A34' }}
          >
            <div>
              <div className='w-0.5 h-8 rounded-full mb-5' style={{ backgroundColor: '#C2AA6A' }} />
              <h2 className='text-xl font-bold text-white mb-3' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Ready for your next lesson?
              </h2>
              <p className='text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Book a session with Millie and keep making progress toward your goals.
              </p>
              <p className='text-sm leading-relaxed mt-3' style={{ color: 'rgba(194,170,106,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Use the calendar below to pick a time that works for you.
              </p>
            </div>
          </div>

        </div>

        {/* Credits + Subscription + Upcoming bookings combined */}
        <div className='mt-5 bg-white rounded-2xl p-7' style={{ border: '1px solid #EDE4D8' }}>

          {/* Top row: credits + subscription */}
          <div className='flex items-start justify-between gap-6'>
            <div>
              <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Credits this month</p>
              <p className='text-sm font-medium mt-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                {user.allowance} {user.allowance === 1 ? 'lesson' : 'lessons'} remaining
              </p>
              {!cancelAtPeriodEnd && (
                <p className='text-xs mt-1' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Resets {nextReset.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                </p>
              )}
            </div>

            {user.stripeSubscriptionId && (
              <div className='text-right'>
                {cancelAtPeriodEnd && periodEnd ? (
                  <>
                    <p className='text-xs font-medium' style={{ color: '#c0392b', fontFamily: 'var(--font-inter), sans-serif' }}>
                      Cancels {periodEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className='text-xs mt-1' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      You'll keep access until then.
                    </p>
                  </>
                ) : (
                  <>
                    <p className='text-[11px] uppercase tracking-[0.12em] mb-2' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Subscription</p>
                    <div className='flex items-center gap-1.5 justify-end mb-2'>
                      <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: '#2ecc71' }} />
                      <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>Active</p>
                    </div>
                    <CancelSubscriptionButton />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Upcoming bookings — only shown if there are any */}
          {upcomingBookings.length > 0 && (
            <>
              <div className='my-6 h-px' style={{ backgroundColor: '#EDE4D8' }} />
              <p className='text-[11px] uppercase tracking-[0.12em] mb-4' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Upcoming Lessons</p>
              <div className='space-y-3'>
                {upcomingBookings.map((booking) => {
                  const start = new Date(booking.startTime)
                  const end = new Date(booking.endTime)
                  return (
                    <div key={booking.uid} className='flex items-center justify-between py-3 px-4 rounded-xl' style={{ backgroundColor: '#F4EDE4' }}>
                      <div className='flex items-center gap-4'>
                        <div className='text-center'>
                          <p className='text-xs font-semibold uppercase' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {start.toLocaleDateString('en-GB', { month: 'short' })}
                          </p>
                          <p className='text-xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                            {start.toLocaleDateString('en-GB', { day: 'numeric' })}
                          </p>
                        </div>
                        <div className='w-px h-8' style={{ backgroundColor: '#EDE4D8' }} />
                        <div>
                          <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {start.toLocaleDateString('en-GB', { weekday: 'long' })}
                          </p>
                          <p className='text-xs' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full' style={{ backgroundColor: 'rgba(31,58,52,0.07)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        Confirmed
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Booking calendar */}
        <div className='mt-5 bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
          <div className='px-7 pt-7 pb-5 flex items-center justify-between' style={{ borderBottom: '1px solid #EDE4D8' }}>
            <div>
              <p className='text-[11px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>Book a Lesson</p>
              <p className='text-sm font-medium mt-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                {user.allowance > 0 ? 'Select an available slot below' : 'No credits remaining'}
              </p>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 rounded-xl' style={{ backgroundColor: 'rgba(31,58,52,0.06)' }}>
              <span className='text-lg font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{user.allowance}</span>
              <span className='text-xs' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {user.allowance === 1 ? 'credit left' : 'credits left'}
              </span>
            </div>
          </div>

          <CalEmbed
            src={`${process.env.CAL_EVENT_URL}?embed=true&name=${encodeURIComponent(user.name ?? '')}&email=${encodeURIComponent(user.email ?? '')}`}
            allowance={user.allowance}
            nextReset={nextReset.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
          />
        </div>

      </main>
    </div>
  )
}
