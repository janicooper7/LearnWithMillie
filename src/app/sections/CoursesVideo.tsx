'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const VIDEO_URL = 'https://www.youtube.com/embed/oAR4aK8bgkg?si=E4czYntQtsfwbwwe'

const courses = [
  {
    name: 'GET READY',
    copy: 'sets you up — TEFL, tech, rates, profile, intro video. Everything from idea to live.',
  },
  {
    name: 'GET BOOKED',
    copy: 'gets you students — the marketing system, the trial framework, the positioning that pulls the right people in.',
  },
  {
    name: 'STAY BOOKED',
    copy: 'turns it into a career — the lesson planning and materials, the retention system, and the longevity work that makes you irreplaceable.',
  },
]

const stats = [
  { value: '$40+', label: 'per hour' },
  { value: '4,000+', label: 'lessons taught' },
  { value: '300+', label: 'students' },
  { value: '30+', label: 'countries' },
]

export default function CoursesVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

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

  // JS-driven sticky: keeps the video pinned within the section as you scroll.
  // (CSS position:sticky is broken here by an ancestor's overflow-x-hidden.)
  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const grid = gridRef.current
      const box = boxRef.current
      if (!grid || !box) return

      // Only pin on desktop, where the two columns sit side by side.
      if (window.innerWidth < 1024) {
        box.style.transform = ''
        return
      }

      const rect = grid.getBoundingClientRect()
      const travel = rect.height - box.offsetHeight
      if (travel <= 0) {
        box.style.transform = ''
        return
      }

      // Pin the video 150px from the top of the viewport, clamped to the section.
      const stickyTop = 150
      const y = Math.min(Math.max(stickyTop - rect.top, 0), travel)
      box.style.transform = `translateY(${y}px)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      className="pb-16 md:pb-24 px-4"
      style={{ backgroundColor: '#1F3A34' }}
      ref={sectionRef}
    >
      <div
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-start"
        ref={gridRef}
      >
        {/* Video — JS-pinned on desktop */}
        <div>
          <div ref={boxRef} className="will-change-transform">
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

        {/* Narrative */}
        <div className="text-white">
          {/* Intro */}
          <div data-reveal>
            <div className="flex items-center gap-3 mb-4">
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
              className="text-lg md:text-xl leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.88)',
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
              className="mt-4 text-lg md:text-xl leading-relaxed italic"
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}
            >
              <strong className="font-bold uppercase">The trilogy</strong> is
              everything I learned along the way.
            </p>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-4 gap-3 my-8 py-6"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.12)',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
            data-reveal
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{
                    color: '#C2AA6A',
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] md:text-xs uppercase tracking-[0.12em] mt-1"
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

          {/* The three courses */}
          <div className="space-y-4" data-reveal>
            {courses.map((c) => (
              <div key={c.name} className="flex gap-3">
                <div
                  className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#C2AA6A' }}
                />
                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  <strong
                    style={{
                      color: 'white',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {c.name}
                  </strong>{' '}
                  {c.copy}
                </p>
              </div>
            ))}
          </div>

          {/* Bundle line */}
          <p
            className="mt-6 text-base leading-relaxed"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
            data-reveal
          >
            You can buy them separately. But each course finishes where the next
            begins. The bundle is what makes you a{' '}
            <strong style={{ color: '#C2AA6A' }}>Career Tutor</strong>.
          </p>

          {/* Freedom */}
          <p
            className="mt-6 text-base leading-relaxed"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
            data-reveal
          >
            And honestly? By the end of it, you might end up stealing my
            students. That&apos;s a risk I&apos;m willing to take. You set the
            hours. You set the rates. You teach from home, in your slippers if
            you want.
          </p>

          {/* Close */}
          <p
            className="mt-6 text-lg leading-relaxed"
            style={{
              color: 'white',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
            data-reveal
          >
            You don&apos;t have to take four years to figure this out yourself.
            By the end of BOOKED, you won&apos;t just be someone who tutors
            online. You&apos;ll be a{' '}
            <strong style={{ color: '#C2AA6A' }}>Career Tutor</strong> — with a
            real, scalable practice that holds your life.
          </p>

          <p
            className="mt-6 text-xl md:text-2xl font-bold"
            style={{
              color: 'white',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
            data-reveal
          >
            BOOKED. Live from today. 🤍
          </p>
        </div>
      </div>
    </section>
  )
}
