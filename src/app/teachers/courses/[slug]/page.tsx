import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import CourseDetail, { type Course } from './CourseDetail'
import CourseSchema from '@/app/components/CourseSchema'

// Fetched on the server (rather than client-side from /api/courses/[slug]) so the
// course heading and copy are in the initial HTML for search engines.
export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const record = await prisma.course.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isBundle: true,
      bundleIncludes: true,
      thumbnail: true,
      _count: { select: { lessons: true } },
      ...(session?.user?.id
        ? { userAccess: { where: { userId: session.user.id }, select: { id: true } } }
        : {}),
    },
  })

  let course: Course | null = null
  if (record) {
    const { userAccess, ...rest } = record as typeof record & { userAccess?: { id: string }[] }
    course = { ...rest, hasAccess: (userAccess?.length ?? 0) > 0 }
  }

  return (
    <>
      <CourseSchema slug={slug} />
      <CourseDetail slug={slug} course={course} />
    </>
  )
}
