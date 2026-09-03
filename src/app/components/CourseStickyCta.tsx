'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useCourseCheckout } from '@/lib/useCourseCheckout'

const PRICE = 149

// Persistent enrol bar for mobile. The desktop layout already keeps the
// purchase card in view with `lg:sticky`, so this is hidden from `lg` up.
//
// It stays out of the way until the reader has scrolled past the purchase card
// near the top of the page — showing it immediately would just cover the card
// it duplicates.
export default function CourseStickyCta({ hasFullAccess }: { hasFullAccess: boolean }) {
  const { enrol, loading } = useCourseCheckout()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (hasFullAccess) return
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasFullAccess])

  if (hasFullAccess) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 lg:hidden"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2D6C4',
        boxShadow: '0 -8px 28px -12px rgba(31,58,52,0.35)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold leading-none"
              style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              ${PRICE}
            </span>
          </div>
          <p
            className="mt-0.5 truncate text-[11px]"
            style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            All 3 courses · 7-day guarantee
          </p>
        </div>

        <button
          onClick={() =>
            enrol({
              plan: 'course-full',
              planName: 'BOOKED Trilogy',
              ctaLocation: 'sticky_bar',
              price: PRICE,
            })
          }
          disabled={loading || !visible}
          tabIndex={visible ? 0 : -1}
          className="ml-auto flex flex-shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {loading ? 'Redirecting…' : <>Buy now <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  )
}
