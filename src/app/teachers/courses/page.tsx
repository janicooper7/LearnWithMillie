import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'
import { PlayCircle } from 'lucide-react'
import CoursePricingCards from '@/app/components/CoursePricingCards'

export const dynamic = 'force-dynamic'

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

  return (
    <div className="min-h-screen bg-[#F4EDE4]">
      {/* Hero */}
      <div className="bg-[#1F3A34] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Courses - Learn at Your Own Pace
          </h1>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Structured video courses designed by Millie. Watch anytime, track your progress, and go at your own speed.
          </p>
        </div>
      </div>

      {/* Pricing cards */}
      <section className="section-padding" style={{ backgroundColor: '#F4EDE4' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className="text-xs uppercase tracking-[0.25em] font-medium"
                  style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Investment
                </span>
              </div>
              <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
                Choose Your<br />Course
              </h2>
            </div>
            <p
              className="text-base leading-relaxed max-w-xs md:text-right"
              style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              One-time payment. Lifetime access. Learn at your own pace.
            </p>
          </div>

          <CoursePricingCards userAccess={accessedSlugs} startedSlugs={startedSlugs} />
        </div>
      </section>

      {/* My Courses — only if user has purchased individual (non-bundle) courses */}
      {displayCourses.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className="text-xs uppercase tracking-[0.25em] font-medium"
                style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Your Courses
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    className="block bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    style={{ border: '1px solid #EDE4D8' }}
                  >
                    {course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 flex items-center justify-center" style={{ backgroundColor: '#1F3A34' }}>
                        <PlayCircle className="w-10 h-10" style={{ color: '#C2AA6A' }} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-semibold mb-3 truncate" style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {course.title}
                      </p>
                      <div className="w-full rounded-full h-1.5 mb-1.5" style={{ backgroundColor: 'rgba(31,58,52,0.1)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#C2AA6A' }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
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
