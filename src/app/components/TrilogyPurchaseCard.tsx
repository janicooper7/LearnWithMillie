'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import { trackEvent } from '@/lib/analytics'
import { track, trackingContext } from '@/lib/trackClient'
import { fbTrack } from '@/lib/fbPixel'
import {
  Play,
  Video,
  FileDown,
  Smartphone,
  Infinity as InfinityIcon,
  ShieldCheck,
  ArrowRight,
  PlayCircle,
  X,
} from 'lucide-react'

const VIDEO_URL =
  'https://www.youtube.com/embed/KawzKRqQV3A?si=Nu95B2S9ouSqLpDi&autoplay=1'

const includes = [
  { icon: Video, label: '~350 minutes of on-demand video' },
  { icon: FileDown, label: 'Worksheets, templates & downloads' },
  { icon: Smartphone, label: 'Access on mobile and desktop' },
  { icon: InfinityIcon, label: 'Full lifetime access' },
]

export default function TrilogyPurchaseCard({
  hasFullAccess,
}: {
  hasFullAccess: boolean
}) {
  const { data: session } = useSession()
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  // Close the video modal on Escape, and lock body scroll while it's open
  useEffect(() => {
    if (!playing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [playing])

  async function handleEnrol() {
    // Fired for every click, signed in or not — a signed-out click never
    // reaches Stripe, so the two need telling apart in reporting.
    trackEvent('enrol_click', {
      plan: 'course-full',
      plan_name: 'BOOKED Trilogy',
      cta_location: 'trilogy_card',
      signed_in: Boolean(session),
      value: 149,
      currency: 'USD',
    })
    track('courses', 'enrol_click')

    if (!session) {
      window.location.href =
        '/auth/signup?type=teacher&next=%2Fteachers%2Fcourses'
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'course-full', tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        trackEvent('begin_checkout', {
          currency: 'USD',
          value: 149,
          items: [{ item_id: 'course-full', item_name: 'BOOKED Trilogy', price: 149 }],
        })
        track('courses', 'checkout_start', { value: 149 })
        fbTrack('InitiateCheckout', {
          value: 149,
          currency: 'USD',
          content_name: 'BOOKED Trilogy',
          content_ids: ['course-full'],
          content_type: 'product',
        })
        window.location.href = data.url
      } else setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  function scrollToPricing() {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
    <div
      className="overflow-hidden rounded-xl bg-white"
      style={{ boxShadow: '0 24px 60px -20px rgba(31,58,52,0.35)', border: '1px solid #EDE4D8' }}
    >
      {/* Video preview — opens a modal */}
      <div className="relative aspect-video w-full bg-[#1F3A34]">
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label="Preview this course"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/webphoto.png"
            alt="Preview this course"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0" style={{ background: 'rgba(31,58,52,0.35)' }} />
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              <Play className="h-6 w-6 translate-x-0.5" style={{ color: '#1F3A34', fill: '#1F3A34' }} />
            </span>
          </span>
          <span
            className="absolute bottom-0 left-0 right-0 px-4 py-3 text-left text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Preview this course
          </span>
        </button>
      </div>

      <div className="p-6">
        {hasFullAccess ? (
          <>
            <p
              className="mb-1 text-lg font-bold"
              style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              You own the full trilogy
            </p>
            <p
              className="mb-5 text-sm"
              style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Full lifetime access. Jump back in anytime.
            </p>
            {(['get-ready', 'get-booked', 'stay-booked'] as const).map((slug, i) => (
              <a
                key={slug}
                href={`/learn/${slug}`}
                className="mb-2.5 flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                <span className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" style={{ color: '#C2AA6A' }} />
                  {['GET READY', 'GET BOOKED', 'STAY BOOKED'][i]}
                </span>
                <ArrowRight className="h-4 w-4" style={{ color: '#C2AA6A' }} />
              </a>
            ))}
          </>
        ) : (
          <>
            {/* Price */}
            <div className="mb-1 flex items-end gap-2.5">
              <span
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: '#1F3A34',
                }}
              >
                $149
              </span>
              <span
                className="pb-1 text-lg line-through"
                style={{ color: '#C0392B', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                $187
              </span>
              <span
                className="ml-auto pb-1 text-sm font-bold"
                style={{ color: '#C0392B', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Save $38
              </span>
            </div>
            <p
              className="mb-5 text-sm"
              style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              All 3 courses · one-time payment
            </p>

            {/* CTAs */}
            <button
              onClick={handleEnrol}
              disabled={loading}
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {loading ? 'Redirecting…' : <>Enrol now <ArrowRight className="h-4 w-4" /></>}
            </button>
            <button
              onClick={scrollToPricing}
              className="flex w-full items-center justify-center rounded-lg py-3 text-base font-bold transition-colors"
              style={{ border: '1.5px solid #1F3A34', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Buy a single course
            </button>

            <p
              className="mt-4 flex items-center justify-center gap-1.5 text-xs"
              style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#C2AA6A' }} />
              7-day money-back guarantee
            </p>
          </>
        )}

        {/* Includes */}
        <div className="mt-6 pt-5" style={{ borderTop: '1px solid #EDE4D8' }}>
          <p
            className="mb-3 text-sm font-bold"
            style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            This course includes:
          </p>
          <ul className="space-y-2.5">
            {includes.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: 'rgba(31,58,52,0.55)' }} />
                <span
                  className="text-sm"
                  style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Video preview modal */}
    {playing &&
      createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(10,18,16,0.85)', backdropFilter: 'blur(2px)' }}
          onClick={() => setPlaying(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Course preview video"
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(false)}
              aria-label="Close video"
              className="absolute right-0 -top-11 flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              className="relative aspect-video w-full overflow-hidden rounded-xl bg-black"
              style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src={VIDEO_URL}
                title="Preview this course"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
