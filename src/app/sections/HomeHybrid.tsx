'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  CalendarCheck,
  BookOpen,
  Users,
  Star,
  BadgeCheck,
} from 'lucide-react'
import gsap from 'gsap'
import ClimateBadge from '../components/ClimateBadge'

type PathKey = 'students' | 'teachers'

const paths = [
  {
    key: 'students' as PathKey,
    eyebrow: 'Learn English with confidence',
    icon: GraduationCap,
    title: 'Students',
    accent: '',
    body: 'Personalised one-on-one lessons built around your goals — from Business English and interview prep to everyday conversation.',
    points: ['Business English', 'Interview prep', 'Conversational fluency'],
    href: '/students',
    cta: 'Explore learning',
  },
  {
    key: 'teachers' as PathKey,
    eyebrow: 'Teach English & grow your career',
    icon: Sparkles,
    title: 'Teachers',
    accent: '',
    body: 'Mentorship, courses, and free classroom tools to help English teachers build confidence, structure, and a thriving online presence.',
    points: [
      '1-on-1 mentorship',
      'Teacher courses',
      'Debate Generator',
      'Free Platform Finder',
    ],
    href: '/teachers',
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
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, delay: 0.1 },
    )
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      className='relative md:flex md:flex-col'
      style={{ backgroundColor: '#F4EDE4', minHeight: 'calc(100dvh - 72px)' }}
    >
      {/* ── Intro ── */}
      <div ref={introRef} className='container pt-12 pb-16 md:pt-16 md:pb-24'>
        <div className='grid lg:grid-cols-[420px_1fr] gap-8 lg:gap-24 items-center'>
          {/* Right — copy */}
          <div className='text-center lg:text-left order-first lg:order-last'>
            <div className='flex items-start justify-center lg:justify-start gap-3 mb-5'>
              <div
                className='h-px w-10 mt-[0.5em]'
                style={{ backgroundColor: '#C2AA6A' }}
              />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{
                  color: 'rgba(31,58,52,0.6)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                English Tutoring &amp; Teacher Mentorship
              </span>
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
              Speak English with confidence.
              <br />
              Teach it with purpose.
            </h1>
            <p
              className='text-base md:text-lg max-w-2xl mx-auto lg:mx-0'
              style={{
                color: 'rgba(31,58,52,0.65)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Whether you want to speak English with confidence or grow a
              thriving teaching career, you&apos;ll learn directly from Millie
              Cooper — a certified TEFL tutor in London. Personalised one-to-one
              English lessons for students, plus mentorship, courses, and free
              ESL teaching tools for teachers.
            </p>

            {/* Trust signals */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-8'>
              {[
                { icon: CalendarCheck, label: '4+ years teaching' },
                { icon: BookOpen, label: '4,000+ lessons' },
                { icon: Users, label: '300+ students' },
                { icon: Star, label: '5★ rated' },
                { icon: BadgeCheck, label: 'TEFL certified' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className='inline-flex items-center gap-2 px-3.5 py-2 rounded-full'
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    backgroundColor: 'white',
                    border: '1px solid #EDE4D8',
                  }}
                >
                  <Icon
                    className='w-4 h-4 flex-shrink-0'
                    style={{ color: '#C2AA6A' }}
                    strokeWidth={2.2}
                  />
                  <span
                    className='text-sm font-semibold'
                    style={{ color: '#1F3A34' }}
                  >
                    {label}
                  </span>
                </span>
              ))}
            </div>

            {/* Climate initiative */}
            <div className='mt-6 flex justify-center lg:justify-start'>
              <ClimateBadge variant='card' />
            </div>
          </div>

          {/* Left — photo composition */}
          <div className='relative order-last lg:order-first'>
            <div
              className='relative mx-auto lg:mx-0'
              style={{ maxWidth: '420px' }}
            >
              {/* Offset green block */}
              <div
                className='absolute rounded-2xl hidden sm:block'
                style={{
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
                className='relative rounded-2xl overflow-hidden'
                style={{ aspectRatio: '3/4', zIndex: 2 }}
              >
                <Image
                  src='/images/aboutme.png'
                  alt='Millie Cooper — certified TEFL English tutor in London'
                  fill
                  priority
                  className='object-cover object-top'
                  sizes='(max-width: 1024px) 90vw, 420px'
                  quality={92}
                />
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{
                    background:
                      'linear-gradient(to top, rgba(31,58,52,0.2) 0%, transparent 50%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Split panels ── */}
      <div className='md:flex-1 flex flex-col md:flex-row gap-4 lg:gap-5 container pb-12 md:pb-16'>
        {paths.map((p) => {
          const Icon = p.icon
          const isDark = p.key === 'teachers'

          return (
            <Link
              key={p.key}
              href={p.href}
              className='relative flex flex-col overflow-hidden rounded-3xl px-8 pt-8 pb-6 lg:p-12 md:flex-1'
              style={{
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
                  color: isDark
                    ? 'rgba(194,170,106,0.14)'
                    : 'rgba(31,58,52,0.05)',
                  strokeWidth: 1,
                }}
              />

              {/* Eyebrow */}
              <div className='flex items-start gap-3 mb-6 relative z-10'>
                <div
                  className='h-px w-8 mt-[0.5em]'
                  style={{ backgroundColor: '#C2AA6A' }}
                />
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
                {p.accent && (
                  <>
                    <br />
                    <span
                      style={{
                        fontStyle: 'italic',
                        color: isDark ? '#C2AA6A' : 'rgba(31,58,52,0.55)',
                      }}
                    >
                      {p.accent}
                    </span>
                  </>
                )}
              </h2>

              {/* Body */}
              <p
                className='relative z-10 text-base leading-relaxed mb-7 max-w-md'
                style={{
                  color: isDark
                    ? 'rgba(244,237,228,0.78)'
                    : 'rgba(31,58,52,0.7)',
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
                      backgroundColor: isDark
                        ? 'rgba(244,237,228,0.1)'
                        : 'rgba(31,58,52,0.06)',
                      border: isDark
                        ? '1px solid rgba(244,237,228,0.18)'
                        : '1px solid rgba(31,58,52,0.1)',
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
