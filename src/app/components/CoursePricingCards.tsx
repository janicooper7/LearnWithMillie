'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { ArrowRight, PlayCircle } from 'lucide-react'

const courses = [
  {
    name: 'Course 1',
    planKey: 'course-1',
    price: 39,
    description: 'Start your English journey',
    featured: false,
    badge: null,
    features: [
      'Full video course access',
      'Structured lesson path',
      'Progress tracking',
      'Lifetime access',
      'All future updates included',
    ],
  },
  {
    name: 'Course 2',
    planKey: 'course-2',
    price: 39,
    description: 'Build on your foundations',
    featured: false,
    badge: null,
    features: [
      'Full video course access',
      'Structured lesson path',
      'Progress tracking',
      'Lifetime access',
      'All future updates included',
    ],
  },
  {
    name: 'Course 3',
    planKey: 'course-3',
    price: 39,
    description: 'Master advanced skills',
    featured: false,
    badge: null,
    features: [
      'Full video course access',
      'Structured lesson path',
      'Progress tracking',
      'Lifetime access',
      'All future updates included',
    ],
  },
  {
    name: 'Full Course',
    planKey: 'course-full',
    price: 69,
    description: 'Complete English mastery bundle',
    featured: true,
    badge: 'Best Value',
    features: [
      'All 3 courses included',
      'Full video course access',
      'Structured lesson path',
      'Progress tracking',
      'Lifetime access',
      'All future updates included',
    ],
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
      if (data.url) window.location.href = data.url
    } catch {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
      {courses.map((course) => {
        const hasAccess = userAccess.includes(course.planKey)
        const hasStarted = startedSlugs.includes(course.planKey)

        return (
          <div
            key={course.name}
            className="relative rounded-2xl bg-white flex flex-col"
            style={{
              border: course.featured ? '2px solid #1F3A34' : '1px solid #EDE4D8',
              transform: course.featured ? 'translateY(-6px)' : 'none',
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
              {/* Name + description */}
              <div className="mb-6">
                <h3
                  className="text-2xl font-bold mb-1.5"
                  style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {course.name}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {course.description}
                </p>
              </div>

              {/* Price */}
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
                </div>
                <p className="text-sm" style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  one-time payment
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-8 flex-1">
                {course.features.map((feature, i) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(31,58,52,0.08)' }}
                    >
                      <CheckIcon className="w-3 h-3" style={{ color: '#1F3A34' }} />
                    </div>
                    <span
                      className="text-sm leading-relaxed"
                      style={{
                        color: 'rgba(31,58,52,0.75)',
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {hasAccess ? (
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
  )
}
