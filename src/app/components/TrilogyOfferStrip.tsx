'use client'

import { useEffect, useState } from 'react'
import { TRILOGY_OFFER } from '@/lib/trilogyOffer'

// Sale strip shown beneath the nav on the course pages.
//
// "Ends tonight" means the visitor's own midnight, so the countdown is worked
// out in their browser and rolls over to a fresh 24 hours when it hits zero.
// The server can't know the visitor's clock, so the first render shows the
// words without the timer and the timer fills in after hydration.

function untilMidnight(now: Date): string {
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const total = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export default function TrilogyOfferStrip() {
  const [remaining, setRemaining] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(untilMidnight(new Date()))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!TRILOGY_OFFER.enabled) return null

  const content = (
    <p className="text-sm md:text-base">
      <span className="font-bold">{TRILOGY_OFFER.percentOff}% OFF</span> the BOOKED Trilogy
      <span className="hidden sm:inline"> — </span>
      <span className="block sm:inline">
        <span className="font-bold">ends tonight</span>
        {/* Fixed width so the strip doesn't jiggle as the digits change */}
        <span className="ml-2 inline-block min-w-[4.75rem] text-left font-mono font-bold tabular-nums">
          {remaining ?? ''}
        </span>
      </span>
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
        className="fixed top-[72px] left-0 right-0 z-40 bg-[#C0392B] px-4 py-2.5 text-center text-white"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {content}
      </div>
    </div>
  )
}
