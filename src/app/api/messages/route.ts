import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

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

  // Find the oldest unread message from this user (if any)
  const oldestUnread = await prisma.message.findFirst({
    where: { userId: session.user.id, fromAdmin: false, readByAdmin: false },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  })

  const message = await prisma.message.create({
    data: { userId: session.user.id, content: content.trim(), fromAdmin: false },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  // Notify admin if: no prior unread messages, OR the oldest unread is >1 hour old (reminder)
  const shouldNotify = !oldestUnread || (Date.now() - new Date(oldestUnread.createdAt).getTime() > 10 * 60 * 1000)
  if (shouldNotify && process.env.RECIPIENT_EMAIL) {
    const senderName = session.user.name ?? session.user.email ?? 'A student'
    sendMail({
      to: process.env.RECIPIENT_EMAIL,
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #1F3A34;">New message on LearnWithMillie</h2>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <blockquote style="border-left: 3px solid #C2AA6A; margin: 16px 0; padding: 10px 16px; background: #F4EDE4; border-radius: 4px;">
            ${content.trim()}
          </blockquote>
          <p style="color: #666; font-size: 13px;">Log in to your admin dashboard to reply.</p>
        </div>
      `,
    }).catch(() => {})
  }

  return NextResponse.json(message, { status: 201 })
}
