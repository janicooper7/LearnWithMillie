import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    where: { messages: { some: {} } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, fromAdmin: true, createdAt: true },
      },
      _count: {
        select: {
          messages: { where: { fromAdmin: false, readByAdmin: false } },
        },
      },
    },
  })

  const conversations = users
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      lastMessage: u.messages[0] ?? null,
      unreadCount: u._count.messages,
    }))
    .sort((a, b) => {
      if (!a.lastMessage) return 1
      if (!b.lastMessage) return -1
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    })

  return NextResponse.json(conversations)
}
