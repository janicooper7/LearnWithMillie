import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle, Check, ChevronRight } from 'lucide-react'
import CoursePricingCards from '@/app/components/CoursePricingCards'
import TrilogyPurchaseCard from '@/app/components/TrilogyPurchaseCard'
import CourseContentAccordion from '@/app/components/CourseContentAccordion'
import CourseTrustBar from '@/app/components/CourseTrustBar'
import CourseOutcomes from '@/app/components/CourseOutcomes'
import CourseDisclosure from '@/app/components/CourseDisclosure'
import CourseTestimonials from '@/app/components/CourseTestimonials'
import CourseGuarantee from '@/app/components/CourseGuarantee'
import CourseFaq from '@/app/components/CourseFaq'
import CourseFaqSchema from '@/app/components/CourseFaqSchema'
import CourseStickyCta from '@/app/components/CourseStickyCta'

export const metadata: Metadata = {
  title: 'Courses for English Teachers',
  description:
    'Online courses for English teachers — set up your tutoring business, market it across five channels, and convert trial lessons with a proven 5-phase framework.',
  openGraph: {
    title: 'Courses for English Teachers',
    description:
      'Online courses for English teachers — build your tutoring business, find students, and convert more trial lessons.',
    url: '/teachers/courses',
  },
}

export const dynamic = 'force-dynamic'

const requirements = [
  'No prior teaching or tutoring experience required — the trilogy is built for total beginners as well as existing tutors.',
  'A laptop, webcam, and stable internet connection.',
  'Fluent English (native or near-native proficiency).',
  'A few hours each week to apply what you learn — this is a system you take action with, not just watch.',
]

const whoFor = [
  'Aspiring online English tutors who don’t know where to start.',
  'Stay-at-home parents looking for flexible, remote work from a laptop.',
  'Career changers who want a teaching career that fits real life.',
  'Existing tutors looking to grow their practice and develop their teaching skills.',
  'Anyone who’s tried teaching English online and quit — ready to come back with a system.',
]

const instructorStats = [
  { value: '4,000+', label: 'Lessons taught' },
  { value: '300+', label: 'Students' },
  { value: '30+', label: 'Countries' },
  { value: '4 yrs', label: 'Teaching online' },
]

export default async function CoursesPage() {
  const session = await auth()

  // Fetch which course slugs the user already owns
  const accessedSlugs: string[] = []
  if (session?.user?.id) {
    const access = await prisma.userCourseAccess.findMany({
      where: { userId: session.user.id },
      include: { course: { select: { slug: true } } },
    })
    accessedSlugs.push(...access.map((a) => a.course.slug))
  }

  // Which owned courses has the user started (any lesson progress)
  const startedSlugs: string[] = []
  if (session?.user?.id && accessedSlugs.length > 0) {
    const progress = await prisma.userLessonProgress.findMany({
      where: { userId: session.user.id },
      select: { lesson: { select: { course: { select: { slug: true } } } } },
    })
    const unique = [...new Set(progress.map((p) => p.lesson.course.slug))]
    startedSlugs.push(...unique)
  }

  // Purchased non-bundle courses with progress for the "My Courses" section
  const myCourses = session?.user?.id
    ? await prisma.userCourseAccess.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              isBundle: true,
              _count: { select: { lessons: true } },
              lessons: {
                select: {
                  progress: {
                    where: { userId: session.user.id },
                    select: { id: true, completedAt: true },
                  },
                },
              },
            },
          },
        },
      })
    : []

  const displayCourses = myCourses.filter(({ course }) => !course.isBundle)
  const hasFullAccess = accessedSlugs.includes('course-full')

  // Owned courses where every lesson is marked complete
  const completedSlugs = myCourses
    .filter(
      ({ course }) =>
        !course.isBundle &&
        course._count.lessons > 0 &&
        course.lessons.every((l) => l.progress.some((p) => p.completedAt))
    )
    .map(({ course }) => course.slug)

  return (
    <div className={`min-h-screen bg-[#F4EDE4] ${hasFullAccess ? '' : 'pb-24 lg:pb-0'}`}>
      <CourseFaqSchema />

      {/* ===== Udemy-style hero band ===== */}
      <div className="bg-[#1F3A34] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:pl-8 lg:pr-[416px]">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm"
            style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <Link href="/teachers" className="transition-opacity hover:opacity-80">
              For Teachers
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="opacity-80">Teacher Training</span>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold leading-tight md:text-[2.7rem]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            BOOKED — Teach English Online:
            <br />
            The Complete Tutor Trilogy
          </h1>
          <p
            className="max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Most tutors don&rsquo;t struggle because they teach badly — they struggle because nobody
            shows them how to get found, get booked, and get paid what they&rsquo;re worth. BOOKED is
            the exact system that took me from $8 an hour to $40+ and a calendar that fills itself.
          </p>

        </div>
      </div>

      {/* ===== Body grid with sticky purchase card ===== */}
      <div className="container">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-14">
          {/* Purchase card — DOM-first so mobile shows it near the top; pulled up
              into the dark hero and sticky on desktop */}
          {/* pt on mobile only — on desktop the card is pulled up into the hero */}
          <aside className="pt-8 lg:col-start-2 lg:row-start-1 lg:pt-0">
            <div
              className={`lg:sticky lg:-mt-[340px] ${
                accessedSlugs.length === 0 ? 'lg:top-32' : 'lg:top-24'
              }`}
            >
              <TrilogyPurchaseCard hasFullAccess={hasFullAccess} />
            </div>
          </aside>

          {/* Main content — one idea per band, generously spaced. The page used
              to run six prose sections back to back; everything that isn't a
              reason to buy now lives behind a disclosure at the foot. */}
          <div className="space-y-14 py-10 lg:col-start-1 lg:row-start-1 lg:space-y-16 lg:py-12">
            {/* Proof leads. A cold visitor needs a reason to believe before
                any claim of ours means anything, so another teacher's result
                is the first thing under the hero — badges back it up next. */}
            <CourseTestimonials />

            <CourseTrustBar />

            <CourseOutcomes />

            {/* Course content — closed by default, opened by the curious */}
            <section>
              <h2
                className="mb-2 text-3xl font-bold md:text-4xl"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                What&rsquo;s inside
              </h2>
              <p
                className="mb-6 text-lg leading-relaxed"
                style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Three courses that run in order. Tap one to see every module.
              </p>
              <CourseContentAccordion />
            </section>

            {/* Instructor */}
            <section id="instructor" className="scroll-mt-24">
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Who&rsquo;s teaching you
              </h2>
              <div className="flex items-center gap-6 sm:gap-8">
                <Image
                  src="/images/aboutme.png"
                  alt="Millie Cooper"
                  width={192}
                  height={224}
                  quality={75}
                  sizes="192px"
                  className="h-44 w-36 flex-shrink-0 rounded-2xl object-cover sm:h-56 sm:w-48"
                  style={{ objectPosition: 'center top', boxShadow: '0 12px 32px -12px rgba(31,58,52,0.45)', border: '2px solid #C2AA6A' }}
                />
                <div>
                  <p
                    className="text-xl font-bold"
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Millie Cooper
                  </p>
                  <p
                    className="mt-1 text-base leading-relaxed"
                    style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Founder of Learn with Millie · TEFL-certified · UCL Master&rsquo;s
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <CourseDisclosure
                  icon="heart"
                  title="Millie’s story"
                  summary="From $8 an hour to $40+ and fully booked"
                >
                  <div
                    className="space-y-4 text-lg leading-relaxed"
                    style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    <p>
                      Today I&rsquo;m the founder of Learn with Millie — where I tutor English online
                      1:1 and mentor other English tutors building their own careers. The mentor
                      side wasn&rsquo;t planned. After four years and over 4,000 lessons, the questions
                      started coming in faster than I could answer them in DMs.
                    </p>
                    <p>
                      So I spent six months turning everything I&rsquo;d figured out into the playbook I
                      wish someone had handed me on day one. That playbook is BOOKED — a
                      three-course trilogy for online English tutors who want to build careers that
                      last.
                    </p>
                  </div>
                </CourseDisclosure>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {instructorStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white p-5 text-center"
                    style={{ border: '1px solid #E2D6C4' }}
                  >
                    <div
                      className="text-3xl font-bold"
                      style={{ color: '#C2AA6A', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="mt-1.5 text-xs uppercase tracking-[0.12em]"
                      style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The long-form copy, folded away. It answers the questions a
                serious buyer has left, without taxing the ones who don't. */}
            <section>
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Still deciding?
              </h2>
              <div className="space-y-3">
                <CourseDisclosure
                  icon="layers"
                  title="Why three courses, not one?"
                  summary="How the trilogy fits together"
                >
                  <div
                    className="space-y-4 text-lg leading-relaxed"
                    style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    <p>
                      Four years ago I started teaching English online for{' '}
                      <strong style={{ color: '#1F3A34' }}>$8 an hour</strong>. Today I charge{' '}
                      <strong style={{ color: '#1F3A34' }}>$40+</strong>, I&rsquo;m fully booked a month
                      out, and I&rsquo;ve taught over 4,000 lessons across 300+ students from 30+
                      countries. BOOKED is everything I figured out along the way.
                    </p>
                    <p>
                      Most online tutoring courses solve one problem. BOOKED is built around the
                      truth that there isn&rsquo;t one problem — there are three, in a specific order.
                      Each course finishes exactly where the next one begins.
                    </p>
                    <p>
                      <strong style={{ color: '#1F3A34' }}>1 — GET READY:</strong> TEFL decisions,
                      platform applications, tech, rates, profile, intro video, and where your first
                      five students come from.
                    </p>
                    <p>
                      <strong style={{ color: '#1F3A34' }}>2 — GET BOOKED:</strong> The 10 Holograms
                      framework, the LMNOP method, and my 5-phase trial framework.
                    </p>
                    <p>
                      <strong style={{ color: '#1F3A34' }}>3 — STAY BOOKED:</strong> The 50-minute
                      lesson structure, retention systems, AI workflows, and the SCALE diagnostic.
                    </p>
                    <p className="italic" style={{ color: 'rgba(31,58,52,0.6)' }}>
                      The trilogy I wish someone had handed me on day one.
                    </p>
                  </div>
                </CourseDisclosure>

                <CourseDisclosure
                  icon="who"
                  title="Who this is for"
                  summary="Complete beginners and working tutors alike"
                >
                  <ul className="space-y-4">
                    {whoFor.map((w) => (
                      <li key={w} className="flex items-start gap-3.5">
                        <Check className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: '#C2AA6A' }} />
                        <span
                          className="text-lg leading-relaxed"
                          style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          {w}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CourseDisclosure>

                <CourseDisclosure
                  icon="checklist"
                  title="What you need to start"
                  summary="No teaching experience required"
                >
                  <ul className="space-y-4">
                    {requirements.map((r) => (
                      <li key={r} className="flex items-start gap-3.5">
                        <Check className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: '#C2AA6A' }} />
                        <span
                          className="text-lg leading-relaxed"
                          style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          {r}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CourseDisclosure>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ===== Pricing: single courses or the full trilogy ===== */}
      <section id="pricing" className="section-padding scroll-mt-24" style={{ backgroundColor: '#F4EDE4' }}>
        <div className="container">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className="text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Ways to enrol
                </span>
              </div>
              <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
                Buy the trilogy,<br />or a single course
              </h2>
            </div>
            <p
              className="max-w-xs text-base leading-relaxed md:text-right"
              style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              One-time payment. Lifetime access. Learn at your own pace.
            </p>
          </div>

          <CoursePricingCards userAccess={accessedSlugs} startedSlugs={startedSlugs} completedSlugs={completedSlugs} />
        </div>
      </section>

      {/* The guarantee is the last objection standing at the decision point, so
          it gets a full-width band of its own rather than a line of small print
          inside the card. Full-bleed, so it lives outside the container above. */}
      <CourseGuarantee />

      {/* ===== FAQ ===== */}
      <section className="section-padding" style={{ backgroundColor: '#F4EDE4' }}>
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className="text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Before you enrol
                </span>
                <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
              </div>
              <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
                Questions teachers ask
              </h2>
            </div>
            <CourseFaq />
          </div>
        </div>
      </section>

      {/* My Courses — only if user has purchased individual (non-bundle) courses */}
      {displayCourses.length > 0 && (
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className="text-xs font-medium uppercase tracking-[0.25em]"
                style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Your Courses
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayCourses.map(({ course }) => {
                const total = course._count.lessons
                const hasStarted = course.lessons.some((l) => l.progress.length > 0)
                const completed = course.lessons.reduce(
                  (acc, l) => acc + (l.progress.some((p) => p.completedAt) ? 1 : 0),
                  0
                )
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                return (
                  <Link
                    key={course.id}
                    href={`/learn/${course.slug}`}
                    className="block overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-md"
                    style={{ border: '1px solid #EDE4D8' }}
                  >
                    {course.thumbnail ? (
                      // Stays a plain <img>: thumbnails are arbitrary URLs
                      // entered in the admin, and next/image throws on any
                      // host that isn't in next.config's remotePatterns.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        decoding="async"
                        className="h-36 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center" style={{ backgroundColor: '#1F3A34' }}>
                        <PlayCircle className="h-10 w-10" style={{ color: '#C2AA6A' }} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="mb-3 font-semibold" style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {course.title}
                      </p>
                      <div className="mb-1.5 h-1.5 w-full rounded-full" style={{ backgroundColor: 'rgba(31,58,52,0.1)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#C2AA6A' }} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <p className="text-xs" style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                          {completed}/{total} lessons · {pct}% complete
                        </p>
                        <span className="text-xs font-medium" style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                          {hasStarted ? 'Continue →' : 'Start →'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CourseStickyCta hasFullAccess={hasFullAccess} />
    </div>
  )
}
