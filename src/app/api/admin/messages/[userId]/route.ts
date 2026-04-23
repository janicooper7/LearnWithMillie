import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

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

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const oldestUnread = await prisma.message.findFirst({
    where: { userId, fromAdmin: true, readByUser: false },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  })

  const message = await prisma.message.create({
    data: { userId, content: content.trim(), fromAdmin: true },
    select: { id: true, content: true, fromAdmin: true, createdAt: true },
  })

  const shouldNotify = !oldestUnread || (Date.now() - new Date(oldestUnread.createdAt).getTime() > 10 * 60 * 1000)
  if (shouldNotify) {
    const recipientName = target.name ?? target.email
    sendMail({
      to: target.email,
      subject: 'Millie replied to your message',
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #1F3A34;">You have a new message from Millie</h2>
          <p>Hi ${recipientName},</p>
          <p>Millie replied to your message:</p>
          <blockquote style="border-left: 3px solid #C2AA6A; margin: 16px 0; padding: 10px 16px; background: #F4EDE4; border-radius: 4px;">
            ${content.trim()}
          </blockquote>
          <p style="color: #666; font-size: 13px;">Log in to your dashboard to continue the conversation.</p>
        </div>
      `,
    }).catch(() => {})
  }

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
