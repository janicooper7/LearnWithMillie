import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const course = await prisma.course.findUnique({
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

  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...course,
    hasAccess: session?.user?.id ? (course as any).userAccess?.length > 0 : false,
    userAccess: undefined,
  })
}
