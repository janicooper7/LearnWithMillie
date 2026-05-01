import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
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

  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (course.userAccess.length === 0) return NextResponse.json({ error: 'No access' }, { status: 403 })

  const lessons = course.lessons.map((l) => ({
    ...l,
    completedAt: l.progress[0]?.completedAt ?? null,
    progress: undefined,
  }))

  return NextResponse.json({ ...course, lessons, userAccess: undefined })
}
