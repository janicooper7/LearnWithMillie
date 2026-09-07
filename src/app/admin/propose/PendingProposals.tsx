'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

export type PendingProposal = {
  id: string
  name: string
  email: string
  title: string
  /** UK time, like everything else here. */
  dateLabel: string
  timeLabel: string
  expiresLabel: string
}

/**
 * Times that are held but not yet agreed to.
 *
 * Worth its own list rather than a column on /admin/sessions: every row here
 * is a slot off the calendar and a credit spent on a session nobody has said
 * yes to, which is the one part of this feature that quietly costs something
 * while it waits.
 */
export default function PendingProposals({ proposals }: { proposals: PendingProposal[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function withdraw(id: string) {
    setBusy(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Could not withdraw that time.')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not withdraw that time.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className='mb-6'>
      <div className='flex items-baseline gap-3 mb-2 px-1'>
        <h2 className='text-sm font-semibold uppercase tracking-wider text-[#1F3A34]'>
          Waiting on a reply
        </h2>
        <span className='text-xs text-[#1F3A34]/45'>
          {proposals.length} slot{proposals.length === 1 ? '' : 's'} held
        </span>
      </div>

      {error && (
        <div className='mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      <div className='bg-white rounded-xl border border-[#EDE4D8] overflow-hidden'>
        {proposals.map((proposal, i) => (
          <div
            key={proposal.id}
            className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 ${
              i > 0 ? 'border-t border-[#EDE4D8]' : ''
            }`}
          >
            <div className='sm:w-44 flex-shrink-0'>
              <div className='text-sm font-semibold text-[#1F3A34]'>{proposal.dateLabel}</div>
              <div className='text-xs text-[#1F3A34]/45 tabular-nums'>{proposal.timeLabel}</div>
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-[#1F3A34] truncate'>{proposal.name}</span>
                <span className='rounded-full bg-[#C2AA6A]/25 px-2.5 py-0.5 text-xs font-semibold text-[#8a6f2e]'>
                  Awaiting reply
                </span>
              </div>
              <div className='flex items-center gap-1.5 text-xs text-[#1F3A34]/50 mt-0.5'>
                <Clock className='w-3 h-3 flex-shrink-0' />
                <span className='truncate'>Released {proposal.expiresLabel} if no answer</span>
              </div>
            </div>

            <button
              onClick={() => withdraw(proposal.id)}
              disabled={busy === proposal.id}
              className='text-xs font-medium px-3 py-1.5 rounded-lg border border-[#c0392b]/30 text-[#c0392b] hover:bg-[#c0392b]/5 disabled:opacity-40 transition-colors sm:flex-shrink-0'
            >
              {busy === proposal.id ? 'Releasing…' : 'Withdraw'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
