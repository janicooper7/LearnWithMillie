import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import CoursePlayer from '@/app/components/CoursePlayer'
import Link from 'next/link'

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      isBundle: true,
      userAccess: { where: { userId: session.user.id }, select: { id: true } },
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          vimeoId: true,
          vimeoHash: true,
          duration: true,
          order: true,
          progress: {
            where: { userId: session.user.id },
            select: { completedAt: true },
          },
        },
      },
    },
  })

  if (!course) notFound()

  // Bundles have no lessons — send users to /courses to pick an individual course
  if (course.isBundle) redirect('/courses')

  if (course.userAccess.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4EDE4] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#1F3A34]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#1F3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1F3A34] mb-2">Access Required</h1>
          <p className="text-[#1F3A34]/60 mb-6">You haven&apos;t purchased this course yet.</p>
          <Link href={`/courses/${slug}`} className="bg-[#1F3A34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1F3A34]/90 transition-colors">
            View Course
          </Link>
        </div>
      </div>
    )
  }

  const lessons = course.lessons.map((l) => ({
    ...l,
    completedAt: (l.progress[0]?.completedAt ?? null)?.toISOString() ?? null,
    progress: undefined,
  }))

  return (
    <div className="min-h-screen bg-[#F4EDE4]">
      <div className="bg-[#1F3A34] px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors">
          ← Back to Dashboard
        </Link>
        <span className="text-[#C2AA6A] text-sm font-medium">{course.title}</span>
        <div />
      </div>
      <CoursePlayer courseSlug={slug} courseTitle={course.title} lessons={lessons} />
    </div>
  )
}
