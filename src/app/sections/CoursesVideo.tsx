'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const VIDEO_URL = 'https://www.youtube.com/embed/KawzKRqQV3A?si=Nu95B2S9ouSqLpDi'

const stats = [
  { value: '$40+', label: 'earn per hour' },
  { value: '4,000+', label: 'lessons taught' },
  { value: '300+', label: 'students' },
  { value: '30+', label: 'countries' },
]

export default function CoursesVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Reveal animation for the copy
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('[data-reveal]'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          stagger: 0.08,
        }
      )
    }
  }, [])

  return (
    <section
      className="pb-16 md:pb-24 px-4"
      style={{ backgroundColor: '#1F3A34' }}
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top: narrative + video, vertically centered */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Narrative */}
          <div className="text-white order-2 lg:order-1" data-reveal>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className="text-xs uppercase tracking-[0.25em] font-medium"
                style={{
                  color: '#C2AA6A',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                I&apos;m Millie
              </span>
            </div>
            <p
              className="text-xl md:text-2xl leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Four years ago I started teaching English online for{' '}
              <strong style={{ color: 'white' }}>$8 an hour</strong>. Today I
              charge <strong style={{ color: '#C2AA6A' }}>$40+</strong>, I&apos;m
              fully booked a month out, and I&apos;ve taught over{' '}
              <strong style={{ color: 'white' }}>4,000 lessons</strong> across{' '}
              <strong style={{ color: 'white' }}>300+ students</strong> from{' '}
              <strong style={{ color: 'white' }}>30+ countries</strong>.
            </p>
            <p
              className="mt-6 text-xl md:text-2xl leading-snug italic"
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}
            >
              <strong className="font-bold uppercase not-italic" style={{ color: 'white' }}>
                The trilogy
              </strong>{' '}
              is everything I learned along the way.
            </p>
          </div>

          {/* Video */}
          <div className="order-1 lg:order-2" data-reveal>
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{
                paddingBottom: '56.25%',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={VIDEO_URL}
                title="From $8 to $40 an hour teaching online — the system I wish I had"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p
              className="text-center text-xs mt-3"
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              From $8 to $40+ an hour online — the system I wish I had.
            </p>

            {/* Money-back badge */}
            <div
              className="mt-4 flex items-center justify-center gap-2.5 rounded-full px-5 py-2.5"
              style={{
                backgroundColor: 'rgba(194,170,106,0.1)',
                border: '1px solid rgba(194,170,106,0.3)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C2AA6A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span
                className="font-bold uppercase"
                style={{
                  color: '#C2AA6A',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                7-Day Money-Back Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Stats — full-width band anchoring the section */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mt-12 md:mt-16 pt-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
          data-reveal
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl md:text-5xl font-bold"
                style={{
                  color: '#C2AA6A',
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] md:text-xs uppercase tracking-[0.16em] mt-2"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
