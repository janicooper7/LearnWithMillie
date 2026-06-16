'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Video,
  ListChecks,
  BarChart2,
  Infinity,
  RefreshCw,
} from 'lucide-react'

// Cards that have a dedicated detail page with the full module breakdown.
const detailSlugs = new Set([
  'course-full',
  'get-ready',
  'get-booked',
  'stay-booked',
])

const courses = [
  {
    name: 'BOOKED Trilogy',
    subtitle: 'The Complete Collection',
    planKey: 'course-full',
    price: 149,
    originalPrice: 187,
    description: '— launch, fill, and keep your tutoring business thriving',
    descriptionBold: 'All 3 courses',
    featured: true,
    badge: 'Best Value · Save $38',
  },
  {
    name: 'GET READY',
    subtitle: 'How to Set Up Your Online English Tutoring Business',
    planKey: 'get-ready',
    price: 49,
    originalPrice: null,
    description:
      'Everything you need to launch your tutoring business from scratch',
    featured: false,
    badge: null,
  },
  {
    name: 'GET BOOKED',
    subtitle: 'How to Get Students Teaching English Online',
    planKey: 'get-booked',
    price: 79,
    originalPrice: null,
    description: 'Proven strategies to attract and convert your first students',
    featured: false,
    badge: null,
  },
  {
    name: 'STAY BOOKED',
    subtitle: 'How to Build a Calendar That Stays Full',
    planKey: 'stay-booked',
    price: 59,
    originalPrice: null,
    description: 'Keep your schedule consistently full with long-term students',
    featured: false,
    badge: null,
  },
]

export default function CoursePricingCards({
  userAccess,
  startedSlugs = [],
  completedSlugs = [],
}: {
  userAccess: string[]
  startedSlugs?: string[]
  completedSlugs?: string[]
}) {
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleCheckout(planKey: string, planName: string) {
    if (!session) {
      window.location.href = `/auth/signup?type=teacher&next=%2Fteachers%2Fcourses`
      return
    }
    setLoadingPlan(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
        setLoadingPlan(null)
      }
    } catch (err) {
      console.error('Checkout fetch error:', err)
      setLoadingPlan(null)
    }
  }

  const included = [
    { icon: Video, label: 'Full video course access' },
    { icon: ListChecks, label: 'Structured lesson path' },
    { icon: BarChart2, label: 'Progress tracking' },
    { icon: Infinity, label: 'Lifetime access' },
    { icon: RefreshCw, label: 'All future updates included' },
  ]

  return (
    <>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch'>
        {courses.map((course) => {
          const hasAccess = userAccess.includes(course.planKey)
          const hasStarted = startedSlugs.includes(course.planKey)
          const hasCompleted = completedSlugs.includes(course.planKey)

          return (
            <div
              key={course.name}
              className='relative rounded-2xl bg-white flex flex-col'
              style={{
                border: course.featured
                  ? '2px solid #1F3A34'
                  : '1px solid #EDE4D8',
                boxShadow: course.featured
                  ? '0 20px 50px rgba(31,58,52,0.13)'
                  : '0 2px 12px rgba(31,58,52,0.05)',
              }}
            >
              {course.badge && (
                <div className='absolute -top-3.5 left-0 right-0 flex justify-center'>
                  <span
                    className='text-[10px] uppercase tracking-[0.18em] font-semibold px-4 py-1.5 rounded-full'
                    style={{
                      backgroundColor: '#C0392B',
                      color: 'white',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {course.badge}
                  </span>
                </div>
              )}

              <div className='p-7 flex flex-col flex-1'>
                {/* Name + subtitle + description */}
                <div className='mb-6'>
                  <p
                    className='text-[11px] uppercase tracking-[0.2em] font-semibold mb-1'
                    style={{
                      color: '#C2AA6A',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {course.name}
                  </p>
                  <h3
                    className='text-xl font-bold mb-2 leading-snug min-h-[3.25rem]'
                    style={{
                      color: '#1F3A34',
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                    }}
                  >
                    {course.subtitle}
                  </h3>
                  <p
                    className='text-sm leading-relaxed'
                    style={{
                      color: 'rgba(31,58,52,0.6)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {'descriptionBold' in course && (
                      <strong style={{ color: '#1F3A34' }}>
                        {course.descriptionBold}{' '}
                      </strong>
                    )}
                    {course.description}
                  </p>
                </div>

                {/* spacer — absorbs varying description heights, keeps price pinned */}
                <div className='flex-1' />

                {/* Price */}
                {!hasAccess && (
                  <div
                    className='mb-7 pb-7'
                    style={{ borderBottom: '1px solid #EDE4D8' }}
                  >
                    <div className='flex items-end gap-2 mb-1'>
                      <span
                        style={{
                          fontFamily: 'var(--font-playfair), Georgia, serif',
                          fontSize: '3.2rem',
                          fontWeight: 700,
                          lineHeight: 1,
                          color: '#1F3A34',
                        }}
                      >
                        ${course.price}
                      </span>
                      {course.originalPrice && (
                        <span
                          className='text-base line-through pb-1'
                          style={{
                            color: '#C0392B',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                        >
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    <p
                      className='text-sm'
                      style={{
                        color: 'rgba(31,58,52,0.65)',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      one-time payment
                      {course.originalPrice && (
                        <span
                          className='ml-2 font-semibold'
                          style={{ color: '#C0392B' }}
                        >
                          · 21% off
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* CTA */}
                {hasAccess && course.planKey === 'course-full' ? (
                  <div className='space-y-2'>
                    <p
                      className='text-[10px] uppercase tracking-[0.15em] font-semibold text-center mb-3'
                      style={{
                        color: 'rgba(31,58,52,0.45)',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      Start a course
                    </p>
                    {(['get-ready', 'get-booked', 'stay-booked'] as const).map(
                      (slug, i) => (
                        <a
                          key={slug}
                          href={`/learn/${slug}`}
                          className='w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200'
                          style={{
                            backgroundColor: 'rgba(31,58,52,0.06)',
                            color: '#1F3A34',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                          onMouseEnter={(e) => {
                            ;(
                              e.currentTarget as HTMLAnchorElement
                            ).style.backgroundColor = 'rgba(31,58,52,0.12)'
                          }}
                          onMouseLeave={(e) => {
                            ;(
                              e.currentTarget as HTMLAnchorElement
                            ).style.backgroundColor = 'rgba(31,58,52,0.06)'
                          }}
                        >
                          <span>
                            {['GET READY', 'GET BOOKED', 'STAY BOOKED'][i]}
                          </span>
                          <ArrowRight
                            className='w-3.5 h-3.5'
                            style={{ color: '#C2AA6A' }}
                          />
                        </a>
                      ),
                    )}
                  </div>
                ) : hasAccess && hasCompleted ? (
                  <div className='space-y-2'>
                    <p
                      className='flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold'
                      style={{
                        color: '#1F3A34',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      <CheckCircle2 className='w-4 h-4' style={{ color: '#1F7A3A' }} />
                      Course Complete
                    </p>
                    <a
                      href={`/learn/${course.planKey}`}
                      className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200'
                      style={{
                        backgroundColor: 'rgba(31,58,52,0.06)',
                        color: '#1F3A34',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      <RefreshCw className='w-4 h-4' style={{ color: '#C2AA6A' }} />
                      Revisit Course
                    </a>
                  </div>
                ) : hasAccess ? (
                  <a
                    href={`/learn/${course.planKey}`}
                    className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200'
                    style={{
                      backgroundColor: '#C2AA6A',
                      color: '#1F3A34',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    <PlayCircle className='w-4 h-4' />
                    {hasStarted ? 'Continue Learning' : 'Start Learning'}
                  </a>
                ) : (
                  <button
                    onClick={() => handleCheckout(course.planKey, course.name)}
                    disabled={loadingPlan !== null}
                    className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
                    style={{
                      backgroundColor: '#1F3A34',
                      color: 'white',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingPlan)
                        (e.currentTarget as HTMLButtonElement).style.opacity =
                          '0.85'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.opacity =
                        '1'
                    }}
                  >
                    {loadingPlan === course.name ? 'Redirecting…' : 'Enrol Now'}
                    {loadingPlan !== course.name && (
                      <ArrowRight className='w-4 h-4' />
                    )}
                  </button>
                )}

                {/* See what's inside */}
                {detailSlugs.has(course.planKey) && (
                  <Link
                    href={`/teachers/courses/${course.planKey}`}
                    className='mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-opacity duration-200 hover:opacity-70'
                    style={{
                      color: 'rgba(31,58,52,0.65)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    <ListChecks className='w-3.5 h-3.5' style={{ color: '#C2AA6A' }} />
                    See what&apos;s inside
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* What's included strip */}
      <div
        className='relative mt-10 overflow-hidden rounded-2xl px-8 py-8'
        style={{
          background:
            'linear-gradient(135deg, #1F3A34 0%, #25433C 100%)',
          boxShadow: '0 20px 45px -20px rgba(31,58,52,0.55)',
        }}
      >
        {/* Gold glow accent */}
        <div
          className='pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full'
          style={{
            background:
              'radial-gradient(circle, rgba(194,170,106,0.22), transparent 70%)',
          }}
        />
        <div className='relative'>
          <div className='mb-6 flex items-center justify-center gap-3'>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
            <p
              className='text-[11px] uppercase tracking-[0.25em] font-semibold text-center'
              style={{
                color: '#C2AA6A',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Every course includes
            </p>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
          </div>
          <div className='flex flex-wrap justify-center gap-3'>
            {included.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className='flex items-center gap-2.5 rounded-full px-4 py-2.5'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(194,170,106,0.25)',
                }}
              >
                <span
                  className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full'
                  style={{ backgroundColor: 'rgba(194,170,106,0.15)' }}
                >
                  <Icon className='w-4 h-4' style={{ color: '#C2AA6A' }} />
                </span>
                <span
                  className='text-sm font-medium'
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
