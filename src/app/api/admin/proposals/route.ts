import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TEACHING_TZ, createProposal } from '@/lib/sessionProposals'
import { sendProposalEmail } from '@/lib/proposalNotify'

export const dynamic = 'force-dynamic'

/** Millie proposing a time to one person. */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: {
    userId?: string
    eventTypeSlug?: string
    start?: string
    message?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { userId, eventTypeSlug, start, message } = body
  if (!userId || !eventTypeSlug || !start) {
    return NextResponse.json({ error: 'Missing userId, eventTypeSlug or start' }, { status: 400 })
  }

  const startDate = new Date(start)
  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ error: 'Invalid start time' }, { status: 400 })
  }

  const result = await createProposal({
    userId,
    eventTypeSlug,
    start: startDate,
    // Not a caller's choice: see TEACHING_TZ.
    timeZone: TEACHING_TZ,
    message: message ?? null,
  })

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  // The slot is held either way — a failed send is worth telling Millie about
  // so she can nudge them, but it is not a reason to undo the booking.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  })
  const emailed = user ? await sendProposalEmail(result.proposal, user) : false

  return NextResponse.json({ proposal: result.proposal, emailed })
}
