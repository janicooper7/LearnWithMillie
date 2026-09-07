import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { verifyProposalToken, sessionNoun } from '@/lib/sessionProposals'
import { formatProposal } from '@/lib/proposalNotify'
import SessionProposalCard from '@/app/components/SessionProposalCard'

export const dynamic = 'force-dynamic'

/**
 * Where the "confirm or change this time" link in Millie's email lands.
 *
 * Reachable without signing in, on a signed token — someone reading their email
 * on a phone should be able to answer in one tap, and asking them to log in
 * first is how a proposal sits unanswered until it expires. The dashboard shows
 * the same card to anyone already signed in.
 */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-xl mx-auto px-6 py-16'>{children}</main>
    </div>
  )
}

function Message({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: { href: string; label: string }
}) {
  return (
    <Shell>
      <div className='bg-white rounded-2xl px-6 py-12 text-center' style={{ border: '1px solid #EDE4D8' }}>
        <h1
          className='text-xl font-bold mb-3'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {title}
        </h1>
        <p
          className='text-sm leading-relaxed max-w-sm mx-auto'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {body}
        </p>
        {action && (
          <Link
            href={action.href}
            className='inline-flex items-center gap-2 mt-7 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {action.label}
          </Link>
        )}
      </div>
    </Shell>
  )
}

export default async function ProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { id } = await params
  const { t } = await searchParams

  const proposal = await prisma.sessionProposal.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, role: true } } },
  })

  if (!proposal) {
    return (
      <Message
        title='We couldn’t find that'
        body='This link may be from an old email, or the time has since been taken off the calendar.'
        action={{ href: '/dashboard', label: 'Go to your dashboard' }}
      />
    )
  }

  const session = await auth()
  const hasToken = !!t && verifyProposalToken(id, t)
  const isOwner = session?.user?.id === proposal.userId

  if (!hasToken && !isOwner) {
    return (
      <Message
        title='Sign in to see this'
        body='This link has expired or is incomplete. Sign in and any time Millie has held for you will be waiting on your dashboard.'
        action={{ href: '/auth/login', label: 'Sign in' }}
      />
    )
  }

  const noun = sessionNoun(proposal.user.role)

  if (proposal.status !== 'PENDING') {
    const body =
      proposal.status === 'ACCEPTED'
        ? `This time is confirmed and in your calendar. Nothing more to do — see you then.`
        : proposal.status === 'DECLINED'
          ? `You've already declined this time, and your ${noun} is back in your account. Pick another whenever you're ready.`
          : proposal.status === 'WITHDRAWN'
            ? `Millie has taken this time back and your ${noun} is in your account. She'll usually follow up with another.`
            : `Nobody replied in time, so the slot went back on the calendar and your ${noun} was returned. Pick any time that suits you.`

    return (
      <Message
        title={proposal.status === 'ACCEPTED' ? 'Already confirmed' : 'This time has been released'}
        body={body}
        action={{ href: '/dashboard#book-lesson', label: 'Go to your dashboard' }}
      />
    )
  }

  if (proposal.expiresAt <= new Date()) {
    return (
      <Message
        title='This time has been released'
        body={`The deadline to reply has passed, so the slot goes back on the calendar and your ${noun} is returned. Pick any time that suits you.`}
        action={{ href: '/dashboard#book-lesson', label: 'Pick your own time' }}
      />
    )
  }

  const parts = formatProposal(proposal)

  return (
    <Shell>
      <SessionProposalCard
        token={t}
        proposal={{
          id: proposal.id,
          dateLabel: parts.dateLabel,
          timeLabel: parts.timeLabel,
          timeZoneLabel: parts.timeZoneLabel,
          durationLabel: parts.durationLabel,
          message: proposal.message,
          noun,
          expiresLabel: new Intl.DateTimeFormat('en-GB', {
            timeZone: proposal.timeZone,
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          }).format(proposal.expiresAt),
        }}
      />

      <p
        className='text-center text-sm mt-6'
        style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <Link href='/dashboard' style={{ color: '#1F3A34', fontWeight: 600 }}>
          Go to your dashboard
        </Link>
      </p>
    </Shell>
  )
}
