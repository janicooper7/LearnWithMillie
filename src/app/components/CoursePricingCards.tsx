'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowRight, PlayCircle, Video, ListChecks, BarChart2, Infinity, RefreshCw } from 'lucide-react'

const courses = [
  {
    name: 'GET READY',
    subtitle: 'How to Set Up Your Online English Tutoring Business',
    planKey: 'get-ready',
    price: 49,
    originalPrice: null,
    description: 'Everything you need to launch your tutoring business from scratch',
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
]

export default function CoursePricingCards({ userAccess, startedSlugs = [] }: { userAccess: string[], startedSlugs?: string[] }) {
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleCheckout(planKey: string, planName: string) {
    if (!session) {
      window.location.href = `/auth/signup?next=%2Fcourses`
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
    { icon: Video,      label: 'Full video course access' },
    { icon: ListChecks, label: 'Structured lesson path' },
    { icon: BarChart2,  label: 'Progress tracking' },
    { icon: Infinity,   label: 'Lifetime access' },
    { icon: RefreshCw,  label: 'All future updates included' },
  ]

  return (
    <>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
      {courses.map((course) => {
        const hasAccess = userAccess.includes(course.planKey)
        const hasStarted = startedSlugs.includes(course.planKey)

        return (
          <div
            key={course.name}
            className="relative rounded-2xl bg-white flex flex-col"
            style={{
              border: course.featured ? '2px solid #1F3A34' : '1px solid #EDE4D8',
              boxShadow: course.featured
                ? '0 20px 50px rgba(31,58,52,0.13)'
                : '0 2px 12px rgba(31,58,52,0.05)',
            }}
          >
            {course.badge && (
              <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                <span
                  className="text-[10px] uppercase tracking-[0.18em] font-semibold px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {course.badge}
                </span>
              </div>
            )}

            <div className="p-7 flex flex-col flex-1">
              {/* Name + subtitle + description */}
              <div className="mb-6">
                <p
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1"
                  style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {course.name}
                </p>
                <h3
                  className="text-lg font-bold mb-2 leading-snug min-h-[3.25rem]"
                  style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {course.subtitle}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {'descriptionBold' in course && <strong style={{ color: '#1F3A34' }}>{course.descriptionBold} </strong>}
                  {course.description}
                </p>
              </div>

              {/* spacer — absorbs varying description heights, keeps price pinned */}
              <div className="flex-1" />

              {/* Price */}
              {!hasAccess && (
                <div className="mb-7 pb-7" style={{ borderBottom: '1px solid #EDE4D8' }}>
                  <div className="flex items-end gap-2 mb-1">
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
                        className="text-base line-through pb-1"
                        style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    one-time payment
                    {course.originalPrice && (
                      <span className="ml-2 font-semibold" style={{ color: '#C2AA6A' }}>· 21% off</span>
                    )}
                  </p>
                </div>
              )}

              {/* CTA */}
              {hasAccess && course.planKey === 'course-full' ? (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-center mb-3" style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Start a course
                  </p>
                  {(['get-ready', 'get-booked', 'stay-booked'] as const).map((slug, i) => (
                    <a
                      key={slug}
                      href={`/learn/${slug}`}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(31,58,52,0.12)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(31,58,52,0.06)' }}
                    >
                      <span>{['GET READY', 'GET BOOKED', 'STAY BOOKED'][i]}</span>
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                    </a>
                  ))}
                </div>
              ) : hasAccess ? (
                <a
                  href={`/learn/${course.planKey}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  <PlayCircle className="w-4 h-4" />
                  {hasStarted ? 'Continue Learning' : 'Start Learning'}
                </a>
              ) : (
                <button
                  onClick={() => handleCheckout(course.planKey, course.name)}
                  disabled={loadingPlan !== null}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  onMouseEnter={(e) => { if (!loadingPlan) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
                >
                  {loadingPlan === course.name ? 'Redirecting…' : 'Enrol Now'}
                  {loadingPlan !== course.name && <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>

    {/* What's included strip */}
    <div className="mt-10 rounded-2xl px-8 py-6" style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}>
      <p
        className="text-[10px] uppercase tracking-[0.2em] font-semibold text-center mb-5"
        style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Every course includes
      </p>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {included.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#C2AA6A' }} />
            <span
              className="text-sm"
              style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
