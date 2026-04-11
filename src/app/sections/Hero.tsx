'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const tickerItems = [
  'Business English',
  'TEFL Certified',
  'Interview Preparation',
  '100% Personalised',
  'Conversational Fluency',
  'Flexible Scheduling',
  '4+ Years Teaching',
  'London Based',
]

export default function Hero() {
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const line1Ref    = useRef<HTMLDivElement>(null)
  const line2Ref    = useRef<HTMLDivElement>(null)
  const bodyRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const imgWrapRef  = useRef<HTMLDivElement>(null)
  const blockRef    = useRef<HTMLDivElement>(null)
  const badge1Ref   = useRef<HTMLDivElement>(null)
  const badge2Ref   = useRef<HTMLDivElement>(null)
  const tickerRef   = useRef<HTMLDivElement>(null)


  // Mouse parallax (desktop only)
  useEffect(() => {
    if (window.innerWidth < 1024) return

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2
      const cy = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to(imgWrapRef.current, { x: cx * 12, y: cy *  9, duration: 1.4, ease: 'power2.out' })
      gsap.to(blockRef.current,   { x: cx * -7, y: cy * -5, duration: 1.9, ease: 'power2.out' })
      gsap.to(badge1Ref.current,  { x: cx * 18, y: cy * 13, duration: 1.2, ease: 'power2.out' })
      gsap.to(badge2Ref.current,  { x: cx *-15, y: cy *-10, duration: 1.2, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Entrance + ticker
  useEffect(() => {
    const isMobile = window.innerWidth < 768

    // Ticker — measure after paint
    requestAnimationFrame(() => {
      if (tickerRef.current) {
        const half = tickerRef.current.scrollWidth / 2
        gsap.fromTo(
          tickerRef.current,
          { x: 0 },
          { x: -half, duration: 28, repeat: -1, ease: 'none' }
        )
      }
    })

    const all = [eyebrowRef, line1Ref, line2Ref, bodyRef, ctaRef,
                 blockRef, imgWrapRef, badge1Ref, badge2Ref]

    if (isMobile) {
      all.forEach((r) => { if (r.current) gsap.set(r.current, { opacity: 1, y: 0, x: 0, scale: 1 }) })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Left column
    tl.fromTo(eyebrowRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65 }, 0.25)
      .fromTo(line1Ref.current,    { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.9  }, '-=0.3')
      .fromTo(line2Ref.current,    { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.9  }, '-=0.68')
      .fromTo(bodyRef.current,     { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6  }, '-=0.4')
      .fromTo(ctaRef.current,      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')

    // Right column — block first, then image over it, then badges
    tl.fromTo(blockRef.current,   { opacity: 0, x: 20, y: 20 }, { opacity: 1, x: 0, y: 0, duration: 0.55 }, 0.4)
      .fromTo(imgWrapRef.current, { opacity: 0, x: 10, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, '-=0.35')
      .fromTo(badge1Ref.current,  { opacity: 0, scale: 0.85, y: 8 },  { opacity: 1, scale: 1, y: 0, duration: 0.35 }, '-=0.15')
      .fromTo(badge2Ref.current,  { opacity: 0, scale: 0.85, y: 8 },  { opacity: 1, scale: 1, y: 0, duration: 0.35 }, '-=0.25')

    return () => { tl.kill() }
  }, [])

  return (
    <section
      className='relative w-full min-h-screen flex flex-col -mt-[80px] overflow-hidden'
      style={{ backgroundColor: '#F4EDE4', minHeight: '100vh' }}
    >
      {/* ── Content ── */}
      <div className='flex-1 flex items-center'>
        <div className='container relative z-10 px-4 py-28 lg:py-0'>
          <div className='grid lg:grid-cols-2 gap-14 lg:gap-10 xl:gap-20 items-center'>

            {/* LEFT */}
            <div>
              {/* Eyebrow */}
              <div ref={eyebrowRef} className='flex items-center gap-3 mb-8' style={{ opacity: 0 }}>
                <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className='text-xs uppercase tracking-[0.25em] font-medium'
                  style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  TEFL Certified
                </span>
                <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }} />
              </div>

              {/* Heading */}
              <div className='mb-5'>
                <div
                  ref={line1Ref}
                  style={{
                    opacity: 0,
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                    fontWeight: 700,
                    color: '#1F3A34',
                    lineHeight: 1.06,
                  }}
                >
                  Learn English
                </div>
                <div
                  ref={line2Ref}
                  style={{
                    opacity: 0,
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#1F3A34',
                    lineHeight: 1.06,
                  }}
                >
                  With Millie
                </div>
              </div>


              {/* Body */}
              <p
                ref={bodyRef}
                className='text-base md:text-lg leading-relaxed mb-9 max-w-md'
                style={{
                  opacity: 0,
                  color: '#1F3A34',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                Personalized lessons built around your goals — speak with
                confidence in any situation.
              </p>

              {/* CTA row */}
              <div ref={ctaRef} className='flex items-center gap-6' style={{ opacity: 0 }}>
                <a href='/auth/signup' className='btn-primary px-8 py-3'>
                  Book a Lesson
                </a>
                <a
                  href='#lesson-options'
                  className='flex items-center gap-1.5 text-sm font-medium transition-opacity duration-200 hover:opacity-100'
                  style={{ color: '#1F3A34', opacity: 0.5, fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  View services
                  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' className='mt-px'>
                    <path d='M2 7h10M8 3l4 4-4 4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </a>
              </div>
            </div>

            {/* RIGHT — image composition */}
            <div className='relative hidden lg:block'>
              {/*
                Composition logic:
                - outerWrapper: positions everything relative to itself
                - blockRef: solid green rectangle, offset 22px down-right from image (z-index 1)
                - imgWrapRef: photo on top of green block (z-index 2)
                - gold accent bar: left edge of the whole composition
                - badges: float outside the composition (z-index 10)
              */}
              <div className='relative mx-auto' style={{ maxWidth: '420px' }}>

                {/* Gold vertical accent line */}
                <div
                  className='absolute rounded-full'
                  style={{
                    left: '-20px',
                    top: '10%',
                    bottom: '10%',
                    width: '2px',
                    backgroundColor: '#C2AA6A',
                    opacity: 0.55,
                  }}
                />

                {/* Offset green background block */}
                <div
                  ref={blockRef}
                  className='absolute rounded-2xl'
                  style={{
                    opacity: 0,
                    top: '22px',
                    left: '22px',
                    right: '-22px',
                    bottom: '-22px',
                    backgroundColor: '#1F3A34',
                    zIndex: 1,
                  }}
                />

                {/* Photo */}
                <div
                  ref={imgWrapRef}
                  className='relative rounded-2xl overflow-hidden'
                  style={{
                    opacity: 0,
                    aspectRatio: '3/4',
                    zIndex: 2,
                    cursor: 'default',
                  }}
                >
                  <Image
                    src='/images/aboutme.png'
                    alt='Millie — English Tutor'
                    fill
                    priority
                    className='object-cover object-top'
                    sizes='420px'
                    quality={92}
                  />
                  {/* Bottom gradient on the photo */}
                  <div
                    className='absolute inset-0 pointer-events-none'
                    style={{
                      background: 'linear-gradient(to top, rgba(31,58,52,0.25) 0%, transparent 45%)',
                    }}
                  />
                </div>

                {/* Badge 1 — TEFL, top-left */}
                <div
                  ref={badge1Ref}
                  className='absolute flex items-center gap-2.5 bg-white rounded-xl shadow-lg'
                  style={{
                    opacity: 0,
                    top: '-14px',
                    left: '-14px',
                    zIndex: 10,
                    padding: '10px 14px',
                    border: '1px solid #EDE4D8',
                  }}
                >
                  <div
                    className='w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold'
                    style={{ backgroundColor: '#1F3A34' }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className='text-xs font-semibold leading-none mb-0.5' style={{ color: '#1F3A34' }}>
                      TEFL Certified
                    </div>
                    <div className='text-[10px] leading-none' style={{ color: 'rgba(31,58,52,0.65)' }}>
                      Qualified Teacher
                    </div>
                  </div>
                </div>

                {/* Badge 2 — Experience, bottom-right */}
                <div
                  ref={badge2Ref}
                  className='absolute flex items-center gap-2.5 bg-white rounded-xl shadow-lg'
                  style={{
                    opacity: 0,
                    bottom: '-14px',
                    right: '-36px',
                    zIndex: 10,
                    padding: '10px 14px',
                    border: '1px solid #EDE4D8',
                  }}
                >
                  <div
                    className='w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{ backgroundColor: 'rgba(194,170,106,0.15)' }}
                  >
                    <span className='text-xs font-bold' style={{ color: '#C2AA6A' }}>4+</span>
                  </div>
                  <div>
                    <div className='text-xs font-semibold leading-none mb-0.5' style={{ color: '#1F3A34' }}>
                      Years Experience
                    </div>
                    <div className='text-[10px] leading-none' style={{ color: 'rgba(31,58,52,0.65)' }}>
                      Online Teaching
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scrolling ticker strip ── */}
      <div
        className='relative overflow-hidden border-t'
        style={{ borderColor: 'rgba(31,58,52,0.1)', backgroundColor: 'rgba(31,58,52,0.03)' }}
      >
        <div style={{ padding: '11px 0' }}>
          <div ref={tickerRef} className='flex whitespace-nowrap' style={{ willChange: 'transform' }}>
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className='inline-flex items-center flex-shrink-0'>
                <span
                  className='text-[11px] uppercase tracking-[0.22em] font-medium px-7'
                  style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item}
                </span>
                <span style={{ color: '#C2AA6A', opacity: 0.55, fontSize: '7px', lineHeight: 1 }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
