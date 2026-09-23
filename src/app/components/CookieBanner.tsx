'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onConsentOpen, readConsent, saveConsent } from '@/lib/consent'

/**
 * Cookie consent banner.
 *
 * "Accept all" and "Reject all" are deliberately the same size and weight —
 * the ICO treats a reject option that is harder to find or less prominent than
 * accept as nudging, which invalidates the consent.
 *
 * Shown until a choice is made, and again whenever the footer's "Cookie
 * settings" link is used, so a choice can be withdrawn as easily as it was
 * given.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [managing, setManaging] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const existing = readConsent()
    if (!existing) setOpen(true)

    return onConsentOpen(() => {
      const current = readConsent()
      setAnalytics(current?.analytics ?? false)
      setMarketing(current?.marketing ?? false)
      setManaging(true)
      setOpen(true)
    })
  }, [])

  function decide(choice: { analytics: boolean; marketing: boolean }) {
    const previous = readConsent()
    saveConsent(choice)
    setOpen(false)
    setManaging(false)

    // Tags that already ran can't be unloaded from the page, so withdrawing
    // consent for one reloads it without them.
    const withdrew =
      (previous?.analytics && !choice.analytics) ||
      (previous?.marketing && !choice.marketing)
    if (withdrew) window.location.reload()
  }

  if (!open) return null

  return (
    <div
      role='dialog'
      aria-modal='false'
      aria-labelledby='cookie-banner-title'
      className='fixed inset-x-0 bottom-0 z-[110] p-4 sm:p-6 pointer-events-none'
    >
      <div className='pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-[#EDE4D8] bg-white p-5 sm:p-6 shadow-2xl'>
        <h2 id='cookie-banner-title' className='text-base font-bold text-[#1F3A34]'>
          Cookies on LearnWithMillie
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-[#1F3A34]/70'>
          I use a few essential cookies to make the site work. With your
          permission I&rsquo;d also like to use analytics cookies to see how the
          site is used, and advertising cookies from Meta and TikTok to measure
          my ads. You can change your mind any time from &ldquo;Cookie
          settings&rdquo; at the bottom of every page.{' '}
          <Link href='/privacy#cookies' className='font-semibold text-[#1F3A34] underline underline-offset-2'>
            Read the cookie policy
          </Link>
          .
        </p>

        {managing && (
          <div className='mt-4 space-y-3'>
            <Toggle
              id='consent-essential'
              label='Essential'
              detail='Sign-in, checkout and remembering this choice. Always on.'
              checked
              disabled
            />
            <Toggle
              id='consent-analytics'
              label='Analytics'
              detail='Google Analytics and my own visit counter, so I can see which pages help people.'
              checked={analytics}
              onChange={setAnalytics}
            />
            <Toggle
              id='consent-marketing'
              label='Advertising'
              detail='Meta (Facebook/Instagram) and TikTok pixels, so I can measure and improve my ads.'
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className='mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center'>
          {managing ? (
            <button
              onClick={() => decide({ analytics, marketing })}
              className='rounded-xl border-2 border-[#1F3A34] px-5 py-2.5 text-sm font-semibold text-[#1F3A34] transition-colors hover:bg-[#F4EDE4]'
            >
              Save choices
            </button>
          ) : (
            <button
              onClick={() => setManaging(true)}
              className='rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1F3A34] underline underline-offset-2'
            >
              Manage
            </button>
          )}
          <div className='flex gap-2.5 sm:ml-auto'>
            <button
              onClick={() => decide({ analytics: false, marketing: false })}
              className='flex-1 rounded-xl bg-[#1F3A34] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 sm:flex-none'
            >
              Reject all
            </button>
            <button
              onClick={() => decide({ analytics: true, marketing: true })}
              className='flex-1 rounded-xl bg-[#1F3A34] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 sm:flex-none'
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  id,
  label,
  detail,
  checked,
  disabled,
  onChange,
}: {
  id: string
  label: string
  detail: string
  checked: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 rounded-xl border border-[#EDE4D8] bg-[#F4EDE4]/40 px-4 py-3 ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <input
        id={id}
        type='checkbox'
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className='mt-0.5 h-4 w-4 flex-shrink-0 rounded'
        style={{ accentColor: '#1F3A34' }}
      />
      <span>
        <span className='block text-sm font-semibold text-[#1F3A34]'>{label}</span>
        <span className='block text-xs leading-relaxed text-[#1F3A34]/60'>{detail}</span>
      </span>
    </label>
  )
}
