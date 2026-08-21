'use client'

import { useEffect, useState } from 'react'
import { PROMO, PROMO_TIMEZONE, PROMO_LOCALE, isPromoActive } from '@/lib/promo'

// Sale strip shown beneath the nav on the course pages.
// The prices on the page are already the sale prices, and /api/checkout puts
// the code on the Stripe session — nobody has to type anything.
//
// The deadline is one absolute instant, rendered in whatever timezone the
// visitor is actually in. A teacher in Sydney shouldn't have to work out what
// "31 August UK time" means for them — and for them the local date genuinely is
// 1 September, which Intl handles for free.

// The strip is written in English, so a browser-locale date would drop another
// language into the middle of the sentence. We take the visitor's locale only
// when it is already an English one — which is what gets a US reader
// "6:59 PM EDT" instead of en-GB's "18:59 GMT-4" — and fall back to en-GB
// otherwise, keeping their timezone either way.
function englishLocale(): string {
  const preferred =
    typeof navigator !== 'undefined'
      ? (navigator.languages ?? [navigator.language]).find((l) =>
          l?.toLowerCase().startsWith('en')
        )
      : undefined
  return preferred || PROMO_LOCALE
}

function formatDeadline(timeZone: string, locale: string = PROMO_LOCALE) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(PROMO.endsAt)
}

export default function CoursePromoStrip() {
  // Server and first client render must agree, so both start on UK time; the
  // effect below swaps in the visitor's own zone once we're past hydration.
  const [deadline, setDeadline] = useState(() => formatDeadline(PROMO_TIMEZONE))
  // Re-checked on the client so an open tab doesn't keep advertising a sale
  // that ended while it sat there.
  const [active, setActive] = useState(true)

  useEffect(() => {
    const tick = () => setActive(isPromoActive())
    tick()

    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = englishLocale()
    if ((localZone && localZone !== PROMO_TIMEZONE) || locale !== PROMO_LOCALE) {
      setDeadline(formatDeadline(localZone || PROMO_TIMEZONE, locale))
    }

    const timer = setInterval(tick, 60_000)
    return () => clearInterval(timer)
  }, [])

  if (!isPromoActive() || !active) return null

  const content = (
    <p className="text-sm md:text-base">
      <span className="font-bold">{PROMO.percentOff}% OFF</span> every course
      <span className="hidden sm:inline"> — </span>
      <span className="block sm:inline">
        ends{' '}
        <time dateTime={PROMO.endsAt.toISOString()} className="font-bold">
          {deadline}
        </time>
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
        className="fixed top-[72px] left-0 right-0 z-40 bg-[#C0392B] text-white text-center px-4 py-2.5"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {content}
      </div>
    </div>
  )
}
