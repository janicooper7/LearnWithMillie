import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { withdrawProposal } from '@/lib/sessionProposals'

export const dynamic = 'force-dynamic'

/**
 * Millie taking a proposed time back — the slot returns to the calendar and the
 * credit goes back to the student, exactly as a decline would.
 *
 * Only reaches PENDING proposals. Once someone has confirmed, the session is an
 * ordinary booking and is cancelled from Cal.com like any other.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { id } = await params
  const result = await withdrawProposal(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 })

  return NextResponse.json({ status: result.status })
}
