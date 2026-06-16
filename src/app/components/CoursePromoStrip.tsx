'use client'

import { useEffect, useState } from 'react'

// Offer ends 18:00 UK time (BST, UTC+1) on 17 June 2026 = 17:00 UTC.
const OFFER_DEADLINE = new Date('2026-06-17T17:00:00Z').getTime()

function getRemaining() {
  return Math.max(0, OFFER_DEADLINE - Date.now())
}

function format(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (days > 0 || hours > 0) parts.push(`${hours}h`)
  parts.push(`${minutes}m`)
  if (days === 0) parts.push(`${seconds}s`)
  return parts.join(' ')
}

export default function CoursePromoStrip() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    setRemaining(getRemaining())
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  // Hide the strip once the offer has expired
  if (remaining === 0) return null

  const content = (
    <p className="text-sm font-medium">
      Launch day offer — <span className="font-bold">10% off</span> with code{' '}
      <span className="font-bold tracking-wide bg-white/20 rounded px-1.5 py-0.5">COURSE10</span>
      {remaining !== null && (
        <span className="block sm:inline">
          <span className="hidden sm:inline">{' · '}</span>Ends in{' '}
          <span className="font-bold tabular-nums">{format(remaining)}</span>
        </span>
      )}
    </p>
  )

  // The fixed strip is lifted out of normal flow, so an invisible spacer with
  // identical markup reserves the exact (responsive) height beneath the nav.
  return (
    <div className="relative">
      <div className="invisible px-4 py-2.5" aria-hidden="true">
        {content}
      </div>
      <div
        className="fixed top-[72px] left-0 right-0 z-40 bg-[#C0392B] text-white text-center px-4 py-2.5"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {content}
      </div>
    </div>
  )
}
