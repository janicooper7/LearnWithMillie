import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TEACHING_TZ, defaultEventSlug } from '@/lib/sessionProposals'
import { formatProposal } from '@/lib/proposalNotify'
import ProposeSession, { type ProposablePerson } from './ProposeSession'
import PendingProposals, { type PendingProposal } from './PendingProposals'

export const dynamic = 'force-dynamic'

/**
 * Millie booking a time *for* someone, instead of waiting for them to book it.
 *
 * The other half of /admin/sessions: that page shows what is already on the
 * calendar, this one puts something on it. The flow deliberately mirrors what
 * the student sees in the dashboard embed — pick a session type, pick from the
 * times Cal says are free — because it is the same calendar and the same
 * availability underneath.
 */

export default async function AdminProposePage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [users, pending] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'TEACHER'] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        allowance: true,
        trialUsed: true,
        trialPurchased: true,
        stripeSubscriptionId: true,
      },
      orderBy: [{ allowance: 'desc' }, { name: 'asc' }],
    }),
    prisma.sessionProposal.findMany({
      where: { status: 'PENDING' },
      orderBy: { start: 'asc' },
      include: { user: { select: { name: true, email: true, role: true } } },
    }),
  ])

  const people: ProposablePerson[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    allowance: u.allowance,
    defaultEventSlug: defaultEventSlug(u),
  }))

  const pendingProposals: PendingProposal[] = pending.map((proposal) => {
    // Rows written before this feature settled on one clock could carry another
    // zone, so the label is forced to UK time rather than trusting the row.
    const uk = formatProposal({ ...proposal, timeZone: TEACHING_TZ })
    return {
      id: proposal.id,
      name: proposal.user.name ?? proposal.user.email,
      email: proposal.user.email,
      title: proposal.title,
      dateLabel: uk.dateLabel,
      timeLabel: uk.timeLabel,
      expiresLabel: new Intl.DateTimeFormat('en-GB', {
        timeZone: TEACHING_TZ,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(proposal.expiresAt),
    }
  })

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-5xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-[#1F3A34]'>Propose a time</h1>
            <p className='text-sm text-[#1F3A34]/60 mt-1 max-w-2xl'>
              Pick a slot for someone and it&apos;s booked straight away, so nobody else can take it.
              They get an email asking them to confirm — if they decline, or don&apos;t reply, the slot
              goes back on the calendar and their credit is returned. All times are UK time.
            </p>
          </div>
          <div className='flex gap-2'>
            <Link
              href='/admin/sessions'
              className='bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'
            >
              Upcoming sessions
            </Link>
            <Link
              href='/admin'
              className='bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'
            >
              Back to admin
            </Link>
          </div>
        </div>

        {pendingProposals.length > 0 && <PendingProposals proposals={pendingProposals} />}

        <ProposeSession people={people} />
      </main>
    </div>
  )
}
