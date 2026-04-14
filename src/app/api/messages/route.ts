import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)

  // Lightweight unread-count check (no side effects)
  if (searchParams.get('unread') === '1') {
    const count = await prisma.message.count({
      where: { userId: session.user.id, fromAdmin: true, readByUser: false },
    })
    return NextResponse.json({ count })
  }

  // Mark admin replies as read now that the user is viewing the chat
  await prisma.message.updateMany({
    where: { userId: session.user.id, fromAdmin: true, readByUser: false },
    data: { readByUser: true },
  })

  const messages = await prisma.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const message = await prisma.message.create({
    data: { userId: session.user.id, content: content.trim(), fromAdmin: false },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  return NextResponse.json(message, { status: 201 })
}
