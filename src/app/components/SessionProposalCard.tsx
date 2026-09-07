'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarClock, CheckCircle2, XCircle } from 'lucide-react'

export type ProposalCardData = {
  id: string
  dateLabel: string
  timeLabel: string
  timeZoneLabel: string
  durationLabel: string
  message: string | null
  /** 'lesson' or 'session', matching how the rest of the dashboard speaks. */
  noun: string
  expiresLabel: string
}

/**
 * A time Millie picked, waiting on an answer.
 *
 * The copy has to be straight about an unusual situation: the slot is already
 * booked — that is what stops someone else taking it — so this is not "would
 * you like this time" but "this is yours unless you say otherwise". Saying it
 * plainly is what keeps the Cal.com invite already sitting in their inbox from
 * reading as a contradiction.
 *
 * Used both on the dashboard and on the page the email links to, which is why
 * it takes an optional `token`: away from a logged-in session that signature is
 * the only thing proving the person opened Millie's email.
 */
export default function SessionProposalCard({
  proposal,
  token,
  onResolved,
}: {
  proposal: ProposalCardData
  token?: string
  onResolved?: (status: 'ACCEPTED' | 'DECLINED') => void
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null)
  const [resolved, setResolved] = useState<'ACCEPTED' | 'DECLINED' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function respond(action: 'accept' | 'decline') {
    setBusy(action)
    setError(null)
    try {
      const res = await fetch('/api/proposals/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proposal.id, action, token }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.')

      const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED'
      setResolved(status)
      onResolved?.(status)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  if (resolved) {
    const accepted = resolved === 'ACCEPTED'
    return (
      <div
        className='rounded-2xl p-5 sm:p-7 text-center'
        style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
      >
        <div
          className='w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'
          style={{ backgroundColor: accepted ? 'rgba(31,58,52,0.07)' : 'rgba(192,57,43,0.07)' }}
        >
          {accepted ? (
            <CheckCircle2 className='w-6 h-6' style={{ color: '#1F3A34' }} />
          ) : (
            <XCircle className='w-6 h-6' style={{ color: '#c0392b' }} />
          )}
        </div>
        <h3
          className='text-lg font-bold mb-2'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {accepted ? "You're all set" : 'No problem'}
        </h3>
        <p
          className='text-sm leading-relaxed max-w-sm mx-auto'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {accepted
            ? `${proposal.dateLabel} at ${proposal.timeLabel} is confirmed. It's already in your calendar — I'll see you then.`
            : `That time has been released and your ${proposal.noun} is back in your account. Pick any time that suits you from the calendar below.`}
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-2xl overflow-hidden' style={{ border: '1px solid #C2AA6A' }}>
      <div className='px-5 py-4 sm:px-7' style={{ backgroundColor: '#1F3A34' }}>
        <div className='flex items-center gap-2.5'>
          <CalendarClock className='w-4 h-4 flex-shrink-0' style={{ color: '#C2AA6A' }} />
          <p
            className='text-xs uppercase tracking-[0.16em] font-semibold'
            style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Millie has held a time for you
          </p>
        </div>
      </div>

      <div className='bg-white px-5 py-6 sm:px-7'>
        <p
          className='text-2xl font-bold'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {proposal.dateLabel}
        </p>
        <p
          className='text-lg font-semibold mt-1'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {proposal.timeLabel}
        </p>
        <p
          className='text-sm mt-1.5'
          style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {proposal.durationLabel} · {proposal.timeZoneLabel}
        </p>

        {proposal.message && (
          <div
            className='mt-5 rounded-xl px-4 py-3.5 text-sm leading-relaxed'
            style={{
              backgroundColor: '#F4EDE4',
              border: '1px solid #EDE4D8',
              color: 'rgba(31,58,52,0.75)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            <span style={{ color: '#1F3A34', fontWeight: 600 }}>From Millie: </span>
            {proposal.message}
          </div>
        )}

        <p
          className='text-sm leading-relaxed mt-5'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          The slot is booked and held for you, so nobody else can take it. If it doesn&apos;t work,
          decline and your {proposal.noun} goes straight back to your account — then pick your own
          time from the calendar. If you don&apos;t reply by{' '}
          <span style={{ color: '#1F3A34', fontWeight: 600 }}>{proposal.expiresLabel}</span>, the time
          is released automatically.
        </p>

        {error && (
          <div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <div className='mt-6 flex flex-col gap-2.5 sm:flex-row'>
          <button
            onClick={() => respond('accept')}
            disabled={busy !== null}
            className='flex-1 px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed'
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {busy === 'accept' ? 'Confirming…' : 'Yes, that works'}
          </button>
          <button
            onClick={() => respond('decline')}
            disabled={busy !== null}
            className='flex-1 px-6 py-3 text-sm font-medium rounded-xl transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
            style={{
              border: '1px solid rgba(31,58,52,0.2)',
              color: 'rgba(31,58,52,0.7)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {busy === 'decline' ? 'Releasing…' : "This time doesn't work"}
          </button>
        </div>
      </div>
    </div>
  )
}
