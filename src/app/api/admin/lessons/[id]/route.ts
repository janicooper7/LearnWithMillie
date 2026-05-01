import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const lesson = await prisma.courseLesson.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description ?? null,
      vimeoId: body.vimeoId,
      vimeoHash: body.vimeoHash ?? null,
      duration: body.duration ? Number(body.duration) : null,
      order: body.order ?? 0,
    },
  })

  return NextResponse.json(lesson)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.courseLesson.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
