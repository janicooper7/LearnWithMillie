import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      allowance: true,
      addonLessonsEnabled: true,
      trialPurchased: true,
      trialUsed: true,
      stripeSubscriptionId: true,
      upcomingLessons: true,
      createdAt: true,
      image: true,
    },
  })

  return NextResponse.json(users)
}
