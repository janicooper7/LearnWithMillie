import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()

  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isBundle: true,
      bundleIncludes: true,
      thumbnail: true,
      order: true,
      _count: { select: { lessons: true } },
      ...(session?.user?.id
        ? { userAccess: { where: { userId: session.user.id }, select: { id: true } } }
        : {}),
    },
  })

  const result = courses.map((c) => ({
    ...c,
    hasAccess: session?.user?.id
      ? (c as any).userAccess?.length > 0
      : false,
    userAccess: undefined,
  }))

  return NextResponse.json(result)
}
