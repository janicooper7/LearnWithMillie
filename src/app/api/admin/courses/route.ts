import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { lessons: true, userAccess: true } } },
  })

  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, slug, description, stripePriceId, order, isBundle, bundleIncludes, published, thumbnail } = body

  if (!title || !slug) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description: description ?? '',
      stripePriceId: stripePriceId ?? null,
      order: order ?? 0,
      isBundle: isBundle ?? false,
      bundleIncludes: bundleIncludes ?? [],
      published: published ?? false,
      thumbnail: thumbnail ?? null,
    },
  })

  return NextResponse.json(course, { status: 201 })
}
