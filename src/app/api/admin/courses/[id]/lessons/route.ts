import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const lessons = await prisma.courseLesson.findMany({
    where: { courseId: id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(lessons)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { title, description, vimeoId, vimeoHash, duration, order } = body

  if (!title || !vimeoId) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const lesson = await prisma.courseLesson.create({
    data: {
      courseId: id,
      title,
      description: description ?? null,
      vimeoId,
      vimeoHash: vimeoHash ?? null,
      duration: duration ? Number(duration) : null,
      order: order ?? 0,
    },
  })

  return NextResponse.json(lesson, { status: 201 })
}
