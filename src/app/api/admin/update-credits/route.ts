import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { userId, delta } = await req.json()

  if (!userId || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { allowance: true } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const newAllowance = Math.max(0, user.allowance + delta)

  await prisma.user.update({
    where: { id: userId },
    data: { allowance: newAllowance },
  })

  return NextResponse.json({ allowance: newAllowance })
}
