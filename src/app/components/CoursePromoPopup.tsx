'use client'

// Landing popup that hands the visitor the current discount code to copy.
//
// Shown once per visitor (per code) to everyone who lands on the course pages
// and doesn't already own a course — no traffic-source branching, so paid,
// organic and direct visitors all see exactly the same offer.

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, Sparkles, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { PROMO, discountedPrice } from '@/lib/promo'

// Bumping the code resets everyone's dismissal, so a new offer gets seen again.
const DISMISSED_KEY = `lwm:promo-dismissed:${PROMO.code}`

const OPEN_DELAY_MS = 4000

/** Clipboard API needs a secure context; fall back for plain http and old Safari. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Denied or unavailable — try the legacy path below.
  }

  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

export default function CoursePromoPopup() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyButtonRef = useRef<HTMLButtonElement>(null)

  // Open on a timer, or immediately on exit intent — whichever comes first.
  // Exit intent only fires on desktop; the timer covers mobile.
  useEffect(() => {
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      // Storage blocked — better to show the offer than to hide it.
    }
    if (dismissed) return

    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)

    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) setOpen(true)
    }
    document.addEventListener('mouseout', onExitIntent)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mouseout', onExitIntent)
    }
  }, [])

  const close = useCallback((reason: 'dismiss' | 'cta') => {
    setOpen(false)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Not fatal — worst case the popup returns on the next page load.
    }
    trackEvent('promo_popup_close', { promo_code: PROMO.code, reason })
  }, [])

  // Report the impression once the popup is actually on screen.
  useEffect(() => {
    if (!open) return
    trackEvent('promo_popup_view', {
      promo_code: PROMO.code,
      percent_off: PROMO.percentOff,
    })
  }, [open])

  // Escape to close, body scroll locked while open, focus into the dialog.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close('dismiss')
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    copyButtonRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  async function handleCopy() {
    const ok = await copyToClipboard(PROMO.code)
    if (!ok) return
    setCopied(true)
    trackEvent('promo_code_copied', {
      promo_code: PROMO.code,
      percent_off: PROMO.percentOff,
    })
    window.setTimeout(() => setCopied(false), 2500)
  }

  // Copies and closes, leaving the visitor exactly where they were on the page.
  async function handleEnrol() {
    await handleCopy()
    trackEvent('promo_popup_cta', { promo_code: PROMO.code })
    close('cta')
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
      style={{ backgroundColor: 'rgba(10,18,16,0.85)', backdropFilter: 'blur(2px)' }}
      onClick={() => close('dismiss')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => close('dismiss')}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dark header band — carries the discount */}
        <div
          className="relative px-7 pb-7 pt-8 text-center"
          style={{ background: 'linear-gradient(135deg, #1F3A34 0%, #25433C 100%)' }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(194,170,106,0.28), transparent 70%)' }}
          />
          <div className="relative">
            <p
              className="mb-3 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Welcome — your offer
            </p>
            <h2
              id="promo-popup-title"
              className="text-4xl font-bold leading-none text-white sm:text-[2.75rem]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {PROMO.percentOff}% off
            </h2>
            <p
              className="mt-2.5 text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Every BOOKED course is {PROMO.percentOff}% off with the code below.
            </p>
          </div>
        </div>

        {/* Code + actions */}
        <div className="px-7 pb-7 pt-6">
          <p
            className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Your code
          </p>

          <button
            ref={copyButtonRef}
            onClick={handleCopy}
            className="group flex w-full items-center justify-center gap-3 rounded-xl py-4 transition-colors"
            style={{
              border: '2px dashed #C2AA6A',
              backgroundColor: copied ? 'rgba(31,122,58,0.07)' : 'rgba(194,170,106,0.09)',
            }}
            aria-label={`Copy discount code ${PROMO.code}`}
          >
            <span
              className="text-2xl font-bold tracking-[0.18em]"
              style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {PROMO.code}
            </span>
            {copied ? (
              <Check className="h-5 w-5 flex-shrink-0" style={{ color: '#1F7A3A' }} />
            ) : (
              <Copy
                className="h-5 w-5 flex-shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                style={{ color: '#1F3A34' }}
              />
            )}
          </button>

          <p
            className="mt-2.5 text-center text-xs"
            style={{
              color: copied ? '#1F7A3A' : 'rgba(31,58,52,0.5)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {copied ? 'Copied — paste it at checkout' : 'Tap the code to copy it'}
          </p>

          <p
            className="mt-5 text-center text-sm"
            style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            The full trilogy drops from{' '}
            <span className="line-through" style={{ color: 'rgba(31,58,52,0.45)' }}>
              $149
            </span>{' '}
            to{' '}
            <strong style={{ color: '#C0392B' }}>{discountedPrice(149)}</strong>
          </p>

          <button
            onClick={handleEnrol}
            className="mt-5 w-full rounded-lg py-3.5 text-base font-bold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#C2AA6A',
              color: '#1F3A34',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Copy code &amp; continue
          </button>

          <button
            onClick={() => close('dismiss')}
            className="mt-3 w-full text-xs transition-opacity hover:opacity-70"
            style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
