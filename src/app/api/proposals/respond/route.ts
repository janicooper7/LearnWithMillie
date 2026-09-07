import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { acceptProposal, declineProposal, verifyProposalToken } from '@/lib/sessionProposals'
import { sendProposalResponseNotice } from '@/lib/proposalNotify'

export const dynamic = 'force-dynamic'

/**
 * A student answering a time Millie proposed.
 *
 * Two ways in, because the email has to work before anyone logs in: either the
 * signed-in user owns the proposal, or the request carries the signed token
 * from the emailed link. The token proves the person opened Millie's email,
 * which is the same bar the unsubscribe links clear — and the worst a leaked
 * one allows is declining a lesson, which refunds the credit and cancels a
 * booking that is already visible to its owner.
 */
export async function POST(req: NextRequest) {
  let body: { id?: string; action?: string; token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { id, action, token } = body
  if (!id || (action !== 'accept' && action !== 'decline')) {
    return NextResponse.json({ error: 'Missing proposal id or action' }, { status: 400 })
  }

  const proposal = await prisma.sessionProposal.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  })
  if (!proposal) return NextResponse.json({ error: 'That proposal no longer exists.' }, { status: 404 })

  const session = await auth()
  const isOwner = session?.user?.id === proposal.userId
  const hasToken = !!token && verifyProposalToken(id, token)
  if (!isOwner && !hasToken) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const result =
    action === 'accept' ? await acceptProposal(proposal.id) : await declineProposal(proposal.id)

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 })

  await sendProposalResponseNotice(proposal, proposal.user, action === 'accept')

  return NextResponse.json({ status: result.status })
}
