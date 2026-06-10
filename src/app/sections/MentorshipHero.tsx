'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'

const stats = [
  { value: '4k+', label: 'Lessons taught' },
  { value: '5★', label: 'Average rating' },
  { value: '300+', label: 'Students taught' },
  { value: '4+', label: 'Years teaching' },
]

export default function MentorshipHero({ programHref = '#mentorship-program' }: { programHref?: string }) {
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
    <section id='mentorship-hero' className='section-padding' style={{ backgroundColor: '#F4EDE4' }}>
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
                Teacher Mentorship
              </span>
            </div>

            {/* Headline */}
            <h1
              className='heading-xl mb-6'
              style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Teach with confidence.<br />Grow with purpose.
            </h1>

            {/* Subheading */}
            <p
              className='text-lg leading-relaxed mb-10 max-w-2xl'
              style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Personalised one-on-one mentorship for English teachers at every stage.
              Whether you&apos;re just starting out or refining your craft, Millie helps
              you build confidence, structure, and real results — in and out of the classroom.
            </p>

            {/* CTAs */}
            <div className='flex flex-wrap items-center gap-4'>
              <Link
                href='/auth/signup?type=teacher'
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110'
                style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Apply for mentorship <ArrowRight className='w-4 h-4' />
              </Link>
              <a
                href={programHref}
                className='inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200'
                style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C2AA6A' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1F3A34' }}
              >
                See what&apos;s included <ArrowRight className='w-4 h-4' />
              </a>
            </div>

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
                quality={92}
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
