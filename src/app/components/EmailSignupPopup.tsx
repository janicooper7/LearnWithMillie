'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { X, Check, Copy, GraduationCap, Sparkles } from 'lucide-react'
import { track } from '@/lib/trackClient'
import { isTrackablePath } from '@/lib/tracking'
import { SIGNUP_OFFER, SIGNUP_OFFER_HEADLINE } from '@/lib/signupOffer'
import type { Audience } from '@/lib/email/types'

/**
 * The list-building popup: pick teacher or student, leave an email, get the
 * welcome discount code.
 *
 * Two steps rather than one form. The audience question is the thing this
 * exists for — an address with no audience on it can't be mailed anything
 * specific — and asking it first means it's answered by everyone who gets as
 * far as typing an email, rather than being a radio button people skip past.
 * It also makes the first interaction a single click, which is a far easier
 * yes than a text field.
 */

const DELAY_MS = 5000
const STORAGE_KEY = 'lwm:signup-popup'
/** How long a dismissal lasts. Long enough not to nag, short enough that a
 *  visitor who comes back months later is asked again. */
const DISMISS_DAYS = 30

type Stored = { state: 'subscribed' | 'dismissed'; at: number }

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

function writeStored(state: Stored['state']) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, at: Date.now() }))
  } catch {
    // Private mode or storage disabled. The popup will show again next visit,
    // which is worse than nothing but not worth blocking a signup over.
  }
}

/** Whether this visitor should be asked at all. */
function shouldShow(): boolean {
  const stored = readStored()
  if (!stored) return true
  // Someone who joined is never asked again, whatever the calendar says.
  if (stored.state === 'subscribed') return false
  return Date.now() - stored.at > DISMISS_DAYS * 24 * 60 * 60 * 1000
}

export default function EmailSignupPopup() {
  const pathname = usePathname()
  const { status } = useSession()

  const [open, setOpen] = useState(false)
  const [audience, setAudience] = useState<Audience | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Signed-in visitors are already customers with their own journey emails, and
  // the admin and dashboard areas aren't marketing surfaces at all.
  const eligible = status === 'unauthenticated' && !!pathname && isTrackablePath(pathname)

  useEffect(() => {
    if (!eligible || !shouldShow()) return

    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
    // Deliberately keyed on eligibility alone, not the path: the timer runs
    // once per page load, so browsing to a second page mid-countdown doesn't
    // restart it and someone who reads three short pages still gets asked.
  }, [eligible])

  const close = useCallback(() => {
    setOpen(false)
    // A dismissal after signing up must not overwrite the permanent record.
    writeStored(done ? 'subscribed' : 'dismissed')
  }, [done])

  // Escape closes, and the scroll behind the modal is locked while it's up.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, close])

  /**
   * Focus follows the step. On step two it goes to the email field, so
   * choosing an audience flows straight into typing rather than needing a
   * second aim; on step one it goes to the close button instead — a keyboard
   * visitor needs to land inside the dialog, and the fastest thing to hand
   * them is the way out of it.
   */
  useEffect(() => {
    if (!open || done) return
    if (audience) emailRef.current?.focus()
    else closeRef.current?.focus()
  }, [open, audience, done])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || !audience) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          audience,
          name: name.trim() || undefined,
          source: pathname,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setDone(true)
      writeStored('subscribed')
      track(null, `newsletter_signup_${audience}`)
    } catch {
      setError('Could not reach the server. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(SIGNUP_OFFER.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked — the code is on screen and selectable anyway.
    }
  }

  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='signup-popup-title'
    >
      <div
        className='absolute inset-0 bg-[#1F3A34]/45 backdrop-blur-[2px]'
        onClick={close}
        aria-hidden='true'
      />

      <div className='relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EDE4D8] overflow-hidden animate-fade-in'>
        {/* The close button sits on the dark green header before signup and on
            white after, so its colour has to flip or it vanishes into one. */}
        <button
          ref={closeRef}
          onClick={close}
          aria-label='Close'
          className={`absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full transition-colors ${
            done
              ? 'text-[#1F3A34]/45 hover:text-[#1F3A34] hover:bg-[#1F3A34]/5'
              : 'text-white/55 hover:text-white hover:bg-white/10'
          }`}
        >
          <X className='w-4 h-4' strokeWidth={2} />
        </button>

        {done ? (
          <div className='px-7 py-9 text-center'>
            <div className='mx-auto w-12 h-12 rounded-full bg-[#C2AA6A]/20 flex items-center justify-center mb-4'>
              <Check className='w-6 h-6 text-[#1F3A34]' strokeWidth={2.5} />
            </div>
            <h2 id='signup-popup-title' className='text-2xl font-bold text-[#1F3A34] mb-2'>
              You&rsquo;re in
            </h2>
            <p className='text-sm text-[#1F3A34]/70 leading-relaxed mb-5'>
              Your code is on its way to <span className='font-semibold'>{email}</span>. Here it is
              in the meantime &mdash; use it at checkout.
            </p>

            <button
              onClick={copyCode}
              className='w-full group flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#C2AA6A] bg-[#F4EDE4] px-4 py-4 transition-colors hover:bg-[#EDE4D8]'
            >
              <span className='font-mono text-xl font-bold tracking-[0.16em] text-[#1F3A34]'>
                {SIGNUP_OFFER.code}
              </span>
              {copied ? (
                <Check className='w-4 h-4 text-[#1F3A34]' strokeWidth={2.5} />
              ) : (
                <Copy className='w-4 h-4 text-[#1F3A34]/50 group-hover:text-[#1F3A34]' />
              )}
            </button>
            <p className='mt-2.5 text-xs text-[#1F3A34]/45'>
              {copied ? 'Copied to your clipboard' : 'Tap to copy'} &middot; first order
            </p>

            <button
              onClick={close}
              className='mt-6 w-full rounded-xl bg-[#1F3A34] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110'
            >
              Start browsing
            </button>
          </div>
        ) : (
          <>
            <div className='bg-[#1F3A34] px-7 pt-7 pb-6 text-center'>
              <div className='inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C2AA6A] mb-2.5'>
                <Sparkles className='w-3.5 h-3.5' />
                Join the family
              </div>
              <h2 id='signup-popup-title' className='text-[26px] leading-tight font-bold text-white'>
                {SIGNUP_OFFER_HEADLINE}
              </h2>
              <p className='mt-2.5 text-sm leading-relaxed text-white/70'>
                {audience
                  ? 'Where should I send your code?'
                  : 'Courses, mentorship, lessons, tools — it works on whatever you start with. Tell me which one you are and the code is yours.'}
              </p>
            </div>

            <div className='px-7 py-6'>
              {!audience ? (
                <div className='space-y-2.5'>
                  <AudienceButton
                    icon={<GraduationCap className='w-5 h-5' strokeWidth={1.75} />}
                    label="I'm a teacher"
                    detail='Courses, mentorship and teaching tools'
                    onClick={() => setAudience('teacher')}
                  />
                  <AudienceButton
                    icon={<Sparkles className='w-5 h-5' strokeWidth={1.75} />}
                    label="I'm learning English"
                    detail='One-to-one lessons with Millie'
                    onClick={() => setAudience('student')}
                  />
                  <p className='pt-1 text-center text-xs text-[#1F3A34]/45'>
                    One email to get you started, then only what&rsquo;s worth sending.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className='space-y-3'>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='First name (optional)'
                    autoComplete='given-name'
                    className='w-full rounded-xl border border-[#EDE4D8] bg-[#F4EDE4]/50 px-4 py-3 text-sm text-[#1F3A34] placeholder:text-[#1F3A34]/40 outline-none transition-colors focus:border-[#C2AA6A] focus:bg-white'
                  />
                  <input
                    ref={emailRef}
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    autoComplete='email'
                    className='w-full rounded-xl border border-[#EDE4D8] bg-[#F4EDE4]/50 px-4 py-3 text-sm text-[#1F3A34] placeholder:text-[#1F3A34]/40 outline-none transition-colors focus:border-[#C2AA6A] focus:bg-white'
                  />

                  {error && <p className='text-xs text-red-600'>{error}</p>}

                  <button
                    type='submit'
                    disabled={submitting}
                    className='w-full rounded-xl bg-[#C2AA6A] px-6 py-3.5 text-sm font-bold text-[#1F3A34] transition-all hover:brightness-105 disabled:opacity-60'
                  >
                    {submitting ? 'Sending…' : `Send my ${SIGNUP_OFFER.percentOff}% code`}
                  </button>

                  <div className='flex items-center justify-between pt-0.5'>
                    <button
                      type='button'
                      onClick={() => setAudience(null)}
                      className='text-xs text-[#1F3A34]/50 underline underline-offset-2 hover:text-[#1F3A34]'
                    >
                      Back
                    </button>
                    <span className='text-xs text-[#1F3A34]/45'>Unsubscribe any time</span>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AudienceButton({
  icon,
  label,
  detail,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  detail: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='group flex w-full items-center gap-3.5 rounded-xl border border-[#EDE4D8] bg-white px-4 py-3.5 text-left transition-all hover:border-[#C2AA6A] hover:bg-[#F4EDE4]/60'
    >
      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EDE4] text-[#1F3A34] transition-colors group-hover:bg-[#C2AA6A]/25'>
        {icon}
      </span>
      <span className='min-w-0'>
        <span className='block text-sm font-semibold text-[#1F3A34]'>{label}</span>
        <span className='block text-xs text-[#1F3A34]/55'>{detail}</span>
      </span>
    </button>
  )
}
