import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { userId, value } = await req.json()

  if (!userId || typeof value !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { trialPurchased: value, trialUsed: value },
    select: { trialPurchased: true, trialUsed: true },
  })

  return NextResponse.json(user)
}
