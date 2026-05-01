import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const course = await prisma.course.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      stripePriceId: body.stripePriceId ?? null,
      order: body.order ?? 0,
      isBundle: body.isBundle ?? false,
      bundleIncludes: body.bundleIncludes ?? [],
      published: body.published ?? false,
      thumbnail: body.thumbnail ?? null,
    },
  })

  return NextResponse.json(course)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.course.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
