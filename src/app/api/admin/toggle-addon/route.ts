import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { userId, enabled } = await req.json()

  if (!userId || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { addonLessonsEnabled: enabled },
    select: { addonLessonsEnabled: true },
  })

  return NextResponse.json({ addonLessonsEnabled: user.addonLessonsEnabled })
}
