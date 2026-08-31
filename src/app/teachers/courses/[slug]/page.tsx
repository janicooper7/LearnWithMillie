'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fbTrack } from '@/lib/fbPixel'
import {
  PlayCircle,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  Layers,
  ArrowRight,
  X,
  ChevronDown,
} from 'lucide-react'
import {
  courseSales,
  bundleSales,
  trilogyOrder,
  type SalesModule,
} from '@/lib/courseSalesContent'
import { track, trackingContext } from '@/lib/trackClient'

type Course = {
  id: string
  title: string
  slug: string
  description: string
  isBundle: boolean
  bundleIncludes: string[]
  thumbnail: string | null
  hasAccess: boolean
  _count: { lessons: number }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C2AA6A]/30 bg-white/10 px-3.5 py-1.5 text-xs text-white/80">
      {children}
    </span>
  )
}

function ModuleList({ modules }: { modules: SalesModule[] }) {
  return (
    <ol className="space-y-10 md:space-y-12">
      {modules.map((m, i) => (
        <li key={i} className="rounded-xl bg-white p-5 shadow-sm md:p-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#C2AA6A] md:text-base">
            Module {i + 1}
          </p>
          <p className="text-base font-semibold leading-snug text-[#1F3A34] md:text-lg">{m.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#1F3A34]/65 md:text-[15px]">{m.teaser}</p>
          {m.anchor && (
            <p className="mt-3 flex items-center gap-1.5 text-xs italic text-[#1F3A34]/45">
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-[#C2AA6A]" />
              Anchored in {m.anchor}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 font-serif text-2xl font-bold text-[#1F3A34]">{children}</h2>
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [openCourses, setOpenCourses] = useState<Set<string>>(new Set())

  const toggleCourse = (s: string) =>
    setOpenCourses((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setCourse(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  async function handlePurchase() {
    setCheckoutLoading(true)
    try {
      const planKey = `course-${slug.replace('course-', '')}`
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('courses', 'checkout_start')
        // No value: this page loads the course from the API, which doesn't carry
        // a price. The Purchase event on /thank-you still reports the real amount.
        fbTrack('InitiateCheckout', {
          currency: 'USD',
          content_name: course?.title,
          content_ids: [planKey],
          content_type: 'product',
        })
        window.location.href = data.url
      } else if (data.error === 'Unauthorized') {
        router.push('/auth/login')
      }
    } catch {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4EDE4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1F3A34] border-t-transparent" />
      </div>
    )
  }

  if (!course || (course as any).error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4EDE4]">
        <div className="text-center">
          <p className="mb-4 text-[#1F3A34]/60">Course not found.</p>
          <Link href="/teachers/courses" className="font-semibold text-[#1F3A34] underline">
            Browse all courses
          </Link>
        </div>
      </div>
    )
  }

  const isBundle = course.isBundle || slug === 'course-full'
  const sales = courseSales[slug]

  return (
    <div className="min-h-screen bg-[#F4EDE4]">
      {/* Hero */}
      <div className="bg-[#1F3A34] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/teachers/courses"
            className="mb-10 block w-fit text-sm text-white/50 transition-colors hover:text-white"
          >
            ← All Courses
          </Link>

          {isBundle ? (
            <>
              <span className="mb-4 inline-block rounded-full bg-[#C2AA6A] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1F3A34]">
                Complete Bundle
              </span>
              <h1 className="mb-3 font-serif text-4xl font-bold md:text-5xl">{bundleSales.label}</h1>
              <p className="max-w-2xl font-serif text-xl italic text-white/80">{bundleSales.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Chip>35 modules</Chip>
                <Chip>~350 min of video</Chip>
                <Chip>3 courses included</Chip>
                <Chip>Lifetime access</Chip>
              </div>
            </>
          ) : sales ? (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#C2AA6A]">
                {sales.courseNumber} · {sales.label}
              </p>
              <h1 className="mb-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                {sales.tagline}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/70">{sales.intro}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {sales.meta.map((m) => (
                  <Chip key={m}>{m}</Chip>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{course.title}</h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/70">{course.description}</p>
              <div className="mt-6 flex items-center gap-6 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="h-4 w-4" />
                  {course._count.lessons} video lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  Lifetime access
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12">
        {isBundle ? (
          <>
            {/* Why it's a trilogy */}
            <div className="space-y-4">
              {bundleSales.intro.map((p, i) => (
                <p key={i} className="leading-relaxed text-[#1F3A34]/80">
                  {p}
                </p>
              ))}
            </div>

            {/* Full curriculum, grouped by course (accordion) */}
            <div>
              <SectionHeading>The full curriculum — all 35 modules</SectionHeading>
              <div className="border-t border-[#EDE4D8]">
                {trilogyOrder.map((s) => {
                  const c = courseSales[s]
                  const open = openCourses.has(s)
                  return (
                    <div key={s} className="border-b border-[#EDE4D8]">
                      <button
                        onClick={() => toggleCourse(s)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-3 py-5 text-left transition-colors hover:opacity-80"
                      >
                        <Layers className="h-5 w-5 flex-shrink-0 text-[#C2AA6A]" />
                        <span className="font-serif text-xl font-bold uppercase tracking-wide text-[#1F3A34] md:text-2xl">
                          {c.label}
                        </span>
                        <span className="text-sm text-[#1F3A34]/45 md:text-base">
                          · {c.modules.length} modules
                        </span>
                        <ChevronDown
                          className={`ml-auto h-5 w-5 flex-shrink-0 text-[#1F3A34]/50 transition-transform duration-300 ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="pb-6">
                          <ModuleList modules={c.modules} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Why this trilogy works */}
            <div>
              <SectionHeading>Why this trilogy works</SectionHeading>
              <p className="mb-4 font-serif text-xl italic text-[#1F3A34]">{bundleSales.whyTitle}</p>
              <div className="space-y-4">
                {bundleSales.why.map((p, i) => (
                  <p key={i} className="leading-relaxed text-[#1F3A34]/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Who it's for / not for */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-[#1F3A34]">Who this is for</h3>
                <ul className="space-y-3">
                  {bundleSales.whoFor.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C2AA6A]" />
                      <span className="text-sm leading-relaxed text-[#1F3A34]/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#EDE4D8] bg-transparent p-6">
                <h3 className="mb-4 font-semibold text-[#1F3A34]/70">Who this isn’t for</h3>
                <ul className="space-y-3">
                  {bundleSales.whoNotFor.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1F3A34]/35" />
                      <span className="text-sm leading-relaxed text-[#1F3A34]/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </>
        ) : sales ? (
          /* Individual course — curriculum */
          <div>
            <SectionHeading>What’s inside</SectionHeading>
            <ModuleList modules={sales.modules} />
          </div>
        ) : (
          /* Fallback for any course without sales copy */
          <div>
            <SectionHeading>What you’ll get</SectionHeading>
            <div className="space-y-3">
              {[
                'High-quality video lessons with Millie',
                'Structured learning path with progress tracking',
                'Lifetime access — learn at your own pace',
                'All future updates to this course included',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C2AA6A]" />
                  <span className="text-[#1F3A34]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Closing enrol CTA */}
      <section className="px-4 pb-16">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl px-8 py-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #1F3A34 0%, #25433C 100%)',
            boxShadow: '0 30px 60px -25px rgba(31,58,52,0.55)',
          }}
        >
          {/* Gold glow accents */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(194,170,106,0.22), transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(194,170,106,0.14), transparent 70%)' }}
          />
          <div className="relative">
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#C2AA6A]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C2AA6A]">
                {course.hasAccess ? 'You’re in' : 'Start today'}
              </span>
              <div className="h-px w-8 bg-[#C2AA6A]" />
            </div>
            <h2 className="mb-3 font-serif text-3xl font-bold text-white md:text-4xl">
              {course.hasAccess
                ? 'Pick up where you left off'
                : isBundle
                  ? 'Ready to become a Career Tutor?'
                  : 'Ready to get started?'}
            </h2>

            {/* Bundle price */}
            {!course.hasAccess && isBundle && (
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="font-serif text-5xl font-bold text-[#C2AA6A]">
                  {bundleSales.pricing.bundlePrice}
                </span>
                <span className="text-lg text-white/55">for all three</span>
              </div>
            )}

            {/* Single-course price */}
            {!course.hasAccess && !isBundle && sales && (
              <div className="mb-3 flex items-baseline justify-center gap-2">
                <span className="font-serif text-5xl font-bold text-[#C2AA6A]">
                  ${sales.price}
                </span>
                <span className="text-sm text-white/55">one-time</span>
              </div>
            )}

            <p className="mx-auto mb-8 max-w-md leading-relaxed text-white/65">
              {course.hasAccess
                ? `You have full access. Jump back in anytime.`
                : isBundle
                  ? bundleSales.pricing.save
                  : `Enrol today — one-time payment, lifetime access, and every future update included.`}
            </p>

            {course.hasAccess ? (
              <Link
                href={`/learn/${course.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C2AA6A] px-8 py-3.5 font-bold text-[#1F3A34] transition-opacity hover:opacity-90"
              >
                <PlayCircle className="h-5 w-5" /> Start Learning
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handlePurchase}
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C2AA6A] px-8 py-3.5 font-bold text-[#1F3A34] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1F3A34] border-t-transparent" />
                  ) : (
                    <>
                      Enrol Now
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-xs text-white/45">
                  One-time payment · Lifetime access · 7-day money-back guarantee
                </p>
              </>
            )}
          </div>
        </div>

        {/* Byline */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs italic leading-relaxed text-[#1F3A34]/45">
          {bundleSales.byline}
        </p>
      </section>
    </div>
  )
}
