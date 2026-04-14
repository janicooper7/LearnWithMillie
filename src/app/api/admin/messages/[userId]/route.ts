import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params

  await prisma.message.updateMany({
    where: { userId, fromAdmin: false, readByAdmin: false },
    data: { readByAdmin: true },
  })

  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params
  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const message = await prisma.message.create({
    data: { userId, content: content.trim(), fromAdmin: true },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  return NextResponse.json(message, { status: 201 })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params

  await prisma.message.deleteMany({ where: { userId } })

  return NextResponse.json({ deleted: true })
}
