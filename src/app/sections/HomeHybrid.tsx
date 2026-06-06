'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, GraduationCap, Sparkles, CalendarCheck, BookOpen, Users, Star, BadgeCheck } from 'lucide-react'
import gsap from 'gsap'

type PathKey = 'students' | 'teachers'

const paths = [
  {
    key: 'students' as PathKey,
    eyebrow: 'For Students',
    icon: GraduationCap,
    title: 'Learn English',
    accent: 'with confidence',
    body: 'Personalised one-on-one lessons built around your goals — from Business English and interview prep to everyday conversation.',
    points: ['Business English', 'Interview prep', 'Conversational fluency'],
    href: '/students',
    cta: 'Explore learning',
  },
  {
    key: 'teachers' as PathKey,
    eyebrow: 'For Teachers',
    icon: Sparkles,
    title: 'Teach English',
    accent: 'and grow your career',
    body: 'Mentorship, courses, and free classroom tools to help English teachers build confidence, structure, and a thriving online presence.',
    points: ['1-on-1 mentorship', 'Teacher courses', 'Debate Generator', 'Free Platform Finder'],
    href: '/mentorship',
    cta: 'Explore teaching',
  },
]

export default function HomeHybrid() {
  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!introRef.current) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(
      introRef.current.children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, delay: 0.1 }
    )
    return () => { tl.kill() }
  }, [])

  return (
    <section
      className='relative flex flex-col'
      style={{ backgroundColor: '#F4EDE4', minHeight: 'calc(100vh - 72px)' }}
    >
      {/* ── Intro ── */}
      <div ref={introRef} className='container text-center pt-12 pb-8 md:pt-16 md:pb-10'>
        <div className='flex items-center justify-center gap-3 mb-5'>
          <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }} />
          <span
            className='text-xs uppercase tracking-[0.25em] font-medium'
            style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            English Tutoring &amp; Teacher Mentorship
          </span>
          <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }} />
        </div>

        <h1
          className='mb-4'
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            fontWeight: 700,
            color: '#1F3A34',
            lineHeight: 1.1,
          }}
        >
          Learn English. Teach English.
          <br />
          <span style={{ fontStyle: 'italic' }}>Master both with Millie.</span>
        </h1>
        <p
          className='text-base md:text-lg max-w-2xl mx-auto'
          style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Whether you want to speak English with confidence or grow a thriving teaching career,
          you&apos;ll learn directly from Millie Cooper — a certified TEFL tutor in London. Personalised
          one-to-one English lessons for students, plus mentorship, courses, and free ESL teaching
          tools for teachers.
        </p>

        {/* Trust signals */}
        <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mt-8'>
          {[
            { icon: CalendarCheck, label: '4+ years teaching' },
            { icon: BookOpen,      label: '2,000+ lessons' },
            { icon: Users,         label: '200+ students' },
            { icon: Star,          label: '5★ rated' },
            { icon: BadgeCheck,    label: 'TEFL certified' },
          ].map(({ icon: Icon, label }, i) => (
            <span key={label} className='inline-flex items-center gap-x-5'>
              {i > 0 && (
                <span aria-hidden className='h-5 w-px' style={{ backgroundColor: 'rgba(31,58,52,0.18)' }} />
              )}
              <span className='inline-flex items-center gap-2' style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                <Icon className='w-4 h-4 flex-shrink-0' style={{ color: '#C2AA6A' }} strokeWidth={2.2} />
                <span className='text-sm md:text-base font-semibold' style={{ color: '#1F3A34' }}>
                  {label}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Split panels ── */}
      <div className='flex-1 flex flex-col md:flex-row gap-4 lg:gap-5 container pb-12 md:pb-16'>
        {paths.map((p) => {
          const Icon = p.icon
          const isDark = p.key === 'teachers'

          return (
            <Link
              key={p.key}
              href={p.href}
              className='relative flex flex-col overflow-hidden rounded-3xl p-8 lg:p-12'
              style={{
                flexGrow: 1,
                flexBasis: 0,
                minHeight: '420px',
                backgroundColor: isDark ? '#1F3A34' : '#FFFFFF',
                border: isDark ? '1px solid #1F3A34' : '1px solid #EDE4D8',
                boxShadow: '0 2px 10px -6px rgba(31,58,52,0.15)',
              }}
            >
              {/* Decorative oversized icon */}
              <Icon
                className='absolute -right-6 -bottom-6'
                style={{
                  width: '180px',
                  height: '180px',
                  color: isDark ? 'rgba(194,170,106,0.14)' : 'rgba(31,58,52,0.05)',
                  strokeWidth: 1,
                }}
              />

              {/* Eyebrow */}
              <div className='flex items-center gap-3 mb-6 relative z-10'>
                <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className='text-xs uppercase tracking-[0.22em] font-semibold'
                  style={{
                    color: isDark ? '#C2AA6A' : 'rgba(31,58,52,0.55)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {p.eyebrow}
                </span>
              </div>

              {/* Title */}
              <h2
                className='relative z-10 mb-4'
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(1.9rem, 3vw, 2.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.08,
                  color: isDark ? '#F4EDE4' : '#1F3A34',
                }}
              >
                {p.title}
                <br />
                <span style={{ fontStyle: 'italic', color: isDark ? '#C2AA6A' : 'rgba(31,58,52,0.55)' }}>
                  {p.accent}
                </span>
              </h2>

              {/* Body */}
              <p
                className='relative z-10 text-base leading-relaxed mb-7 max-w-md'
                style={{
                  color: isDark ? 'rgba(244,237,228,0.78)' : 'rgba(31,58,52,0.7)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {p.body}
              </p>

              {/* Feature chips */}
              <div className='relative z-10 flex flex-wrap gap-2 mb-8'>
                {p.points.map((point) => (
                  <span
                    key={point}
                    className='px-3.5 py-1.5 rounded-full text-xs font-medium'
                    style={{
                      fontFamily: 'var(--font-inter), sans-serif',
                      color: isDark ? '#F4EDE4' : '#1F3A34',
                      backgroundColor: isDark ? 'rgba(244,237,228,0.1)' : 'rgba(31,58,52,0.06)',
                      border: isDark ? '1px solid rgba(244,237,228,0.18)' : '1px solid rgba(31,58,52,0.1)',
                    }}
                  >
                    {point}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <span
                className='relative z-10 mt-auto inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold self-start'
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  letterSpacing: '0.03em',
                  backgroundColor: isDark ? '#F4EDE4' : '#1F3A34',
                  color: isDark ? '#1F3A34' : '#FFFFFF',
                }}
              >
                {p.cta}
                <ArrowRight className='w-4 h-4' />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
