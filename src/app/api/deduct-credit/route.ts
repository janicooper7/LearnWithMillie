import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// This endpoint only CHECKS current allowance — actual deduction is handled
// atomically by the Cal.com webhook (BOOKING_CREATED) to avoid race conditions.
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { allowance: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.allowance <= 0) {
    return NextResponse.json({ allowance: 0, skipped: true })
  }

  return NextResponse.json({ allowance: user.allowance })
}
