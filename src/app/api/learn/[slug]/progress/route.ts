import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, completed } = await req.json()
  if (!lessonId) return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })

  // Verify the lesson belongs to this course and user has access
  const lesson = await prisma.courseLesson.findFirst({
    where: { id: lessonId, course: { slug } },
    select: {
      id: true,
      course: {
        select: {
          userAccess: { where: { userId: session.user.id }, select: { id: true } },
        },
      },
    },
  })

  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
  if (lesson.course.userAccess.length === 0) return NextResponse.json({ error: 'No access' }, { status: 403 })

  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: {
      userId: session.user.id,
      lessonId,
      completedAt: completed ? new Date() : null,
    },
    update: { completedAt: completed ? new Date() : null },
  })

  return NextResponse.json({ completedAt: progress.completedAt })
}

// Reset all progress for this course so the learner can redo it from scratch.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const course = await prisma.course.findFirst({
    where: { slug, userAccess: { some: { userId: session.user.id } } },
    select: { id: true },
  })
  if (!course) return NextResponse.json({ error: 'No access' }, { status: 403 })

  await prisma.userLessonProgress.deleteMany({
    where: { userId: session.user.id, lesson: { courseId: course.id } },
  })

  return NextResponse.json({ ok: true })
}
