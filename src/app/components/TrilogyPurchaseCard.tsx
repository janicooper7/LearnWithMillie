'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useCourseCheckout } from '@/lib/useCourseCheckout'
import {
  Play,
  Video,
  FileDown,
  Smartphone,
  Infinity as InfinityIcon,
  ArrowRight,
  PlayCircle,
  Star,
  X,
} from 'lucide-react'

const VIDEO_URL =
  'https://www.youtube.com/embed/KawzKRqQV3A?si=Nu95B2S9ouSqLpDi&autoplay=1'

const PRICE = 149

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
  const { enrol, loading } = useCourseCheckout()
  const [playing, setPlaying] = useState(false)

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

  function handleEnrol() {
    return enrol({
      plan: 'course-full',
      planName: 'BOOKED Trilogy',
      ctaLocation: 'trilogy_card',
      price: PRICE,
    })
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
          <Image
            src="/images/webphoto.png"
            alt="Preview this course"
            fill
            quality={75}
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
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
            <div className="mb-5 flex items-center justify-between gap-3">
              <span
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: '#1F3A34',
                }}
              >
                ${PRICE}
              </span>
              {/* Pushed to the card's right edge, so the number and the reason
                  to trust it bookend the same line and are read in one glance. */}
              <span className="relative top-[5px] flex flex-col items-end gap-1.5">
                <span className="flex gap-1" aria-label="Rated 5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-[1.05rem] w-[1.05rem]" style={{ color: '#C2AA6A', fill: '#C2AA6A' }} />
                  ))}
                </span>
                <span
                  className="text-sm font-semibold leading-none text-right"
                  style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  5 star rated by tutors
                </span>
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
              {loading ? 'Redirecting…' : <>Buy now <ArrowRight className="h-4 w-4" /></>}
            </button>

            {/* Not a third button: the trilogy is the offer, and a single
                course is the smaller thing you fall back to. */}
            <button
              onClick={scrollToPricing}
              className="mt-3 w-full text-center text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{
                color: 'rgba(31,58,52,0.65)',
                textDecorationColor: '#C2AA6A',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Buy a single course
            </button>
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
