'use client'

import { useEffect, useRef } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const packages = [
  {
    name: 'Single',
    price: 50,
    sessions: 1,
    description: 'Try a session and see how it feels',
    featured: false,
    features: [
      '1 × 50-min mentorship session',
      'Personalised feedback',
      'Resource recommendations',
    ],
  },
  {
    name: 'Double',
    price: 95,
    sessions: 2,
    description: 'Build on your first session with follow-up',
    featured: true,
    features: [
      '2 × 50-min mentorship sessions',
      'Personalised feedback',
      'Resource recommendations',
    ],
  },
  {
    name: 'Triple',
    price: 140,
    sessions: 3,
    description: 'The best value for focused development',
    featured: false,
    features: [
      '3 × 50-min mentorship sessions',
      'Personalised feedback',
      'Resource recommendations',
    ],
  },
]

export default function MentorshipPricing() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      cardsRef.current.forEach((c) => c && gsap.set(c, { y: 0, opacity: 1 }))
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top bottom-=80' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section
      id='mentorship-pricing'
      className='section-padding'
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>

        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Investment
              </span>
            </div>
            <h2
              className='heading-lg'
              style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Mentorship<br />Packages
            </h2>
          </div>
          <p
            className='text-base leading-relaxed max-w-xs md:text-right'
            style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            All sessions are 50 minutes, one-on-one with Millie.
          </p>
        </div>

        {/* Cards */}
        <div className='grid md:grid-cols-3 gap-5 mb-8'>
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              ref={(el) => { cardsRef.current[index] = el }}
              className='relative rounded-2xl bg-white flex flex-col'
              style={{
                border: pkg.featured ? '2px solid #1F3A34' : '1px solid #EDE4D8',
                transform: pkg.featured ? 'translateY(-6px)' : 'none',
                boxShadow: pkg.featured
                  ? '0 20px 50px rgba(31,58,52,0.13)'
                  : '0 2px 12px rgba(31,58,52,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = pkg.featured
                  ? '0 24px 60px rgba(31,58,52,0.18)'
                  : '0 12px 32px rgba(31,58,52,0.1)'
                if (!pkg.featured) el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = pkg.featured
                  ? '0 20px 50px rgba(31,58,52,0.13)'
                  : '0 2px 12px rgba(31,58,52,0.05)'
                el.style.transform = pkg.featured ? 'translateY(-6px)' : 'none'
              }}
            >
              {pkg.featured && (
                <div className='absolute -top-3.5 left-0 right-0 flex justify-center'>
                  <span
                    className='text-[10px] uppercase tracking-[0.18em] font-semibold px-4 py-1.5 rounded-full'
                    style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className='p-8 flex flex-col flex-1'>
                <div className='mb-6'>
                  <h3
                    className='text-2xl font-bold mb-1.5'
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className='text-sm'
                    style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className='mb-7 pb-7' style={{ borderBottom: '1px solid #EDE4D8' }}>
                  <div className='flex items-end gap-2 mb-1.5'>
                    <span
                      style={{
                        fontFamily: 'var(--font-playfair), Georgia, serif',
                        fontSize: '3.2rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        color: '#1F3A34',
                      }}
                    >
                      ${pkg.price}
                    </span>
                  </div>
                  <p
                    className='text-sm'
                    style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    One-time payment &nbsp;·&nbsp; 50 min sessions
                  </p>
                </div>

                <ul className='space-y-3.5 mb-8 flex-1'>
                  {pkg.features.map((feature, i) => (
                    <li key={feature} className='flex items-center gap-3'>
                      <div
                        className='w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0'
                        style={{ backgroundColor: 'rgba(31,58,52,0.08)' }}
                      >
                        <CheckIcon className='w-3 h-3' style={{ color: '#1F3A34' }} />
                      </div>
                      <span
                        className='text-sm leading-relaxed'
                        style={{
                          color: 'rgba(31,58,52,0.75)',
                          fontFamily: 'var(--font-inter), sans-serif',
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href='/auth/signup?type=teacher'
                  className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-85'
                  style={{
                    backgroundColor: '#1F3A34',
                    color: 'white',
                    fontFamily: 'var(--font-inter), sans-serif',
                    letterSpacing: '0.03em',
                  }}
                >
                  Apply Now <ArrowRight className='w-4 h-4' />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Below-cards nudge */}
        <p
          className='text-center text-sm'
          style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Not sure where to start?{' '}
          <Link
            href='/contact'
            className='font-medium underline underline-offset-2 transition-colors duration-200'
            style={{ color: '#1F3A34' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C2AA6A' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#1F3A34' }}
          >
            Send Millie a message
          </Link>{' '}
          and she&apos;ll help you find the right fit.
        </p>

      </div>
    </section>
  )
}
