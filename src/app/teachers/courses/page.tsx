import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import { PlayCircle, Check, ChevronRight } from 'lucide-react'
import CoursePricingCards from '@/app/components/CoursePricingCards'
import CoursePromoStrip from '@/app/components/CoursePromoStrip'
import CoursePromoPopup from '@/app/components/CoursePromoPopup'
import TrilogyPurchaseCard from '@/app/components/TrilogyPurchaseCard'
import CourseContentAccordion from '@/app/components/CourseContentAccordion'

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

const whatYouLearn = [
  'Set up an online English tutoring business — from TEFL choice and platform application to a profile that converts and an intro video that books.',
  'Run a marketing system across five channels used by working online tutors — the LMNOP method and the 10 Holograms framework.',
  'Use a 5-phase trial lesson framework that took conversion from 50% to over 80%.',
  'Teach a structured 50-minute lesson — refined across 4,000+ real lessons, at every level from A1 to C2.',
  'Build AI workflows for lesson planning, materials, and vocab lists that give you back 5–8 hours a week.',
  'Set your rates, keep students for years, and build a sustainable practice with the SCALE diagnostic framework.',
]

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
    <div className="min-h-screen bg-[#F4EDE4]">
      {/* Sale strip + landing popup — hidden from anyone who already owns a course */}
      {accessedSlugs.length === 0 && (
        <>
          <CoursePromoStrip />
          <CoursePromoPopup />
        </>
      )}

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
            BOOKED — Teach English Online: The Complete Tutor Trilogy
          </h1>
          <p
            className="mb-5 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Setup, marketing, trial lessons, lesson craft &amp; retention — the complete system for
            English tutors learning to teach online, built across four years and 4,000+ lessons.
          </p>

          <p
            className="mb-3 text-sm"
            style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Created by{' '}
            <a href="#instructor" className="font-semibold underline decoration-[#C2AA6A] underline-offset-2">
              Millie Cooper
            </a>
          </p>
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span>Last updated 7/2026</span>
            <span>English</span>
            <span>35 modules · 3 courses</span>
          </div>
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

          {/* Main content */}
          <div className="py-10 lg:col-start-1 lg:row-start-1 lg:py-12">
            {/* What you'll learn */}
            <section
              className="rounded-lg bg-white p-6 md:p-8"
              style={{ border: '1px solid #E2D6C4' }}
            >
              <h2
                className="mb-6 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                What you’ll learn
              </h2>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {whatYouLearn.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#1F3A34' }} />
                    <span
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course content */}
            <section className="mt-12">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Course content
              </h2>
              <CourseContentAccordion />
            </section>

            {/* Requirements */}
            <section className="mt-12">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Requirements
              </h2>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: '#1F3A34' }}
                    />
                    <span
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section className="mt-12">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Description
              </h2>
              <div
                className="space-y-4 text-base leading-relaxed"
                style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                <p>
                  Four years ago I started teaching English online for{' '}
                  <strong style={{ color: '#1F3A34' }}>$8 an hour</strong>. Today I charge{' '}
                  <strong style={{ color: '#1F3A34' }}>$40+</strong>, I’m fully booked a month out,
                  and I’ve taught over 4,000 lessons across 300+ students from 30+ countries. BOOKED
                  is everything I figured out along the way — packaged into a three-part trilogy.
                </p>
                <p>
                  Most online tutoring courses solve one problem. BOOKED is built around the truth
                  that there isn’t one problem — there are three, in a specific order. Each course
                  finishes exactly where the next one begins.
                </p>
                <div className="space-y-3 pt-1">
                  <p>
                    <strong style={{ color: '#1F3A34' }}>Course 1 — GET READY:</strong> Setting up
                    your online tutoring business. TEFL decisions, platform applications, tech, rates,
                    profile creation, intro video, and where your first five students come from.
                  </p>
                  <p>
                    <strong style={{ color: '#1F3A34' }}>Course 2 — GET BOOKED:</strong> Marketing &amp;
                    trial-lesson mastery. The 10 Holograms framework, the LMNOP method, and my 5-phase
                    trial framework refined across four years of teaching.
                  </p>
                  <p>
                    <strong style={{ color: '#1F3A34' }}>Course 3 — STAY BOOKED:</strong> Lesson craft
                    &amp; career-building. The 50-minute lesson structure, retention systems, AI
                    workflows, and the SCALE diagnostic you’ll use for the rest of your career.
                  </p>
                </div>
                <p className="italic" style={{ color: 'rgba(31,58,52,0.6)' }}>
                  The trilogy I wish someone had handed me on day one.
                </p>
              </div>
            </section>

            {/* Who this course is for */}
            <section className="mt-12">
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Who this course is for
              </h2>
              <ul className="space-y-3">
                {whoFor.map((w) => (
                  <li key={w} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: '#1F3A34' }}
                    />
                    <span
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {w}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructor */}
            <section id="instructor" className="mt-12">
              <h2
                className="mb-5 text-2xl font-bold"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Instructor
              </h2>
              <div className="flex items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/aboutme.png"
                  alt="Millie Cooper"
                  className="h-28 w-28 flex-shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
                  style={{ objectPosition: 'center top', boxShadow: '0 8px 24px -8px rgba(31,58,52,0.4)', border: '3px solid #C2AA6A' }}
                />
                <div>
                  <p
                    className="text-lg font-bold underline decoration-[#C2AA6A] underline-offset-2"
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Millie Cooper
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Founder of Learn with Millie · TEFL-certified · UCL Master’s
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {instructorStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-white p-4 text-center"
                    style={{ border: '1px solid #E2D6C4' }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: '#C2AA6A', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="mt-1 text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 space-y-4 text-base leading-relaxed"
                style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                <p>
                  Today I’m the founder of Learn with Millie — where I tutor English online 1:1 and
                  mentor other English tutors building their own careers. The mentor side wasn’t
                  planned. After four years and over 4,000 lessons, the questions started coming in
                  faster than I could answer them in DMs.
                </p>
                <p>
                  So I spent six months turning everything I’d figured out into the playbook I wish
                  someone had handed me on day one. That playbook is BOOKED — a three-course trilogy
                  for online English tutors who want to build careers that last.
                </p>
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnail} alt={course.title} className="h-36 w-full object-cover" />
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
    </div>
  )
}
