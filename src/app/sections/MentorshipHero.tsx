'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const stats = [
  { value: '4k+', label: 'Lessons taught' },
  { value: '5★', label: 'Average rating' },
  { value: '300+', label: 'Students taught' },
  { value: '4+', label: 'Years teaching' },
]

type MentorshipHeroProps = {
  /** Anchor id for the section — lets a page avoid duplicate ids. */
  id?: string
  eyebrow?: string
  headline?: React.ReactNode
  subheading?: React.ReactNode
}

export default function MentorshipHero({
  id = 'mentorship-hero',
  eyebrow = 'Teacher Mentorship',
  headline = (
    <>Teach with confidence.<br />Grow with purpose.</>
  ),
  subheading = (
    <>
      Personalised one-on-one mentorship for English teachers at every stage.
      Whether you&apos;re just starting out or refining your craft, Millie helps
      you build confidence, structure, and real results — in and out of the classroom.
    </>
  ),
}: MentorshipHeroProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.1 }
    )
  }, [])

  return (
    <section id={id} className='section-padding' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>
        <div className='grid lg:grid-cols-2 gap-16 lg:gap-20 items-center'>
          <div ref={contentRef}>

            {/* Label */}
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              className='heading-xl mb-6'
              style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {headline}
            </h1>

            {/* Subheading */}
            <p
              className='text-lg leading-relaxed mb-10 max-w-2xl'
              style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {subheading}
            </p>

            {/* Stats */}
            <div
              className='flex flex-wrap gap-10 mt-14 pt-10'
              style={{ borderTop: '1px solid rgba(31,58,52,0.1)' }}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p
                    className='text-3xl font-bold mb-0.5'
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className='text-sm'
                    style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Image */}
          <div className='relative hidden lg:block'>
            {/* Gold vertical line */}
            <div
              className='absolute rounded-full'
              style={{ left: '-20px', top: '10%', bottom: '10%', width: '2px', backgroundColor: '#C2AA6A', opacity: 0.55 }}
            />
            {/* Offset green block */}
            <div
              className='absolute rounded-2xl'
              style={{ top: '22px', left: '22px', right: '-22px', bottom: '-22px', backgroundColor: '#1F3A34', zIndex: 1 }}
            />
            {/* Photo */}
            <div className='relative rounded-2xl overflow-hidden' style={{ aspectRatio: '3/4', zIndex: 2 }}>
              <Image
                src='/images/aboutme.png'
                alt='Millie — Teacher Mentor'
                fill
                className='object-cover object-top'
                sizes='520px'
                quality={75}
              />
              <div
                className='absolute inset-0 pointer-events-none'
                style={{ background: 'linear-gradient(to top, rgba(31,58,52,0.2) 0%, transparent 50%)' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
