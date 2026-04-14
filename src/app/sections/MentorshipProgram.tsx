'use client'

import { useEffect, useRef } from 'react'
import { BookOpen, Target, Monitor, Mic, BarChart2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const pillars = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Lesson Design',
    description:
      'Build structured, engaging lessons from scratch. Learn how to balance grammar, vocabulary, and speaking in one session.',
  },
  {
    number: '02',
    icon: Target,
    title: 'Student-Centred Teaching',
    description:
      "Adapt your approach to each learner's goals and level. Move beyond the textbook and make every lesson feel personal.",
  },
  {
    number: '03',
    icon: Monitor,
    title: 'Online Teaching Tools',
    description:
      'Master the platforms and techniques that make remote teaching effective — from Google Meet to interactive activities.',
  },
  {
    number: '04',
    icon: Mic,
    title: 'Building Your Brand',
    description:
      'Attract students, create content that grows your audience, and build a sustainable teaching business online.',
  },
  {
    number: '05',
    icon: BarChart2,
    title: 'Feedback & Growth',
    description:
      'Give better feedback, track student progress, and build reflection habits that make you a stronger teacher over time.',
  },
]

const audiences = [
  {
    label: 'New Teachers',
    description:
      "You've just started — or are about to. You want structure, confidence, and a clear system from day one.",
  },
  {
    label: 'Experienced Teachers',
    description:
      "You've been teaching for years but feel stuck or want to refine your methods and gain a fresh perspective.",
  },
  {
    label: 'Content Creators',
    description:
      "You're building a teaching brand online and want guidance on content strategy alongside your teaching practice.",
  },
]

export default function MentorshipProgram() {
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([])
  const audienceRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      ;[...pillarsRef.current, ...audienceRef.current].forEach(
        (el) => el && gsap.set(el, { opacity: 1, y: 0 })
      )
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    pillarsRef.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top bottom-=80' },
        }
      )
    })

    audienceRef.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top bottom-=80' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section
      id='mentorship-program'
      className='section-padding'
      style={{ backgroundColor: '#1F3A34' }}
    >
      <div className='container space-y-20'>

        {/* Pillars */}
        <div>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14'>
            <div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
                <span
                  className='text-xs uppercase tracking-[0.25em] font-medium'
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  The Program
                </span>
              </div>
              <h2
                className='heading-lg text-white'
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                What you&apos;ll work on
              </h2>
            </div>
            <p
              className='text-sm leading-relaxed max-w-xs md:text-right'
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Five core pillars that shape every mentorship engagement.
            </p>
          </div>

          <div className='grid md:grid-cols-3 lg:grid-cols-5 gap-5'>
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.number}
                  ref={(el) => { pillarsRef.current[index] = el }}
                  className='rounded-2xl p-7 flex flex-col'
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <p
                    className='text-[11px] font-semibold mb-5'
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.15em' }}
                  >
                    {pillar.number}
                  </p>
                  <div
                    className='w-10 h-10 rounded-xl flex items-center justify-center mb-5'
                    style={{ backgroundColor: 'rgba(194,170,106,0.12)' }}
                  >
                    <Icon className='w-5 h-5' style={{ color: '#C2AA6A' }} />
                  </div>
                  <h3
                    className='text-base font-bold text-white mb-2'
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className='text-sm leading-relaxed'
                    style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mid-section CTA */}
        <div
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl px-8 py-7'
          style={{ backgroundColor: 'rgba(194,170,106,0.1)', border: '1px solid rgba(194,170,106,0.2)' }}
        >
          <div>
            <p
              className='text-lg font-bold text-white mb-1'
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Ready to level up your teaching?
            </p>
            <p
              className='text-sm'
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              One session is all it takes to start seeing the difference.
            </p>
          </div>
          <Link
            href='/auth/signup?type=teacher'
            className='flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Apply for mentorship <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        {/* Who it's for */}
        <div>
          <div className='mb-12'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Who it&apos;s for
              </span>
            </div>
            <h2
              className='heading-md text-white'
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Built for teachers at every stage
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-5'>
            {audiences.map((audience, index) => (
              <div
                key={audience.label}
                ref={(el) => { audienceRef.current[index] = el }}
                className='rounded-2xl p-8'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className='w-1 h-8 rounded-full mb-6'
                  style={{ backgroundColor: '#C2AA6A' }}
                />
                <h3
                  className='text-xl font-bold text-white mb-3'
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {audience.label}
                </h3>
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
