// Sale strip shown beneath the nav on the course pages.
// Advertises the current discount code; apply it at Stripe checkout.

import { PROMO } from '@/lib/promo'

export default function CoursePromoStrip() {
  const content = (
    <p className="text-base md:text-lg font-medium">
      <span className="font-bold">{PROMO.percentOff}% OFF</span> every course with code{' '}
      <span className="font-bold tracking-wide bg-white/20 rounded px-1.5 py-0.5">{PROMO.code}</span>
      {' '}— apply at checkout
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
