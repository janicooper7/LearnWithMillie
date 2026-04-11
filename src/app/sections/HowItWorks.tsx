'use client'

import { useEffect, useRef } from 'react'
import { UserPlus, CreditCard, CalendarCheck, GraduationCap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create an account',
    description: 'Sign up in seconds. No commitments — just create your free student account to get started.',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Buy lessons or a trial lesson',
    description: 'New students can book a 20-minute trial lesson for $20. Ready to commit? Choose a monthly plan.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Pick a time that works for you',
    description: 'Browse Millie\'s live availability and book directly from your dashboard — 20 minutes for a trial or 50 minutes for a full lesson.',
  },
  {
    number: '04',
    icon: GraduationCap,
    title: 'Start learning',
    description: 'Join your lesson on Google Meet. Personalised to your goals — every single session.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      stepsRef.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }))
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    stepsRef.current.forEach((el, i) => {
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
    <section ref={sectionRef} id='how-it-works' className='section-padding' style={{ backgroundColor: '#1F3A34' }}>
      <div className='container'>

        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span className='text-xs uppercase tracking-[0.25em] font-medium' style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Getting started
              </span>
            </div>
            <h2 className='heading-lg text-white' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              How it works
            </h2>
          </div>
          <Link
            href='/auth/signup'
            className='inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg self-start md:self-auto transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Get started <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        {/* Steps */}
        <div className='grid md:grid-cols-4 gap-5'>
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                ref={(el) => { stepsRef.current[index] = el }}
                className='relative rounded-2xl p-7 flex flex-col'
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div
                    className='hidden md:block absolute top-10 -right-2.5 w-5 h-px z-10'
                    style={{ backgroundColor: 'rgba(194,170,106,0.4)' }}
                  />
                )}

                {/* Step number */}
                <p className='text-[11px] font-semibold mb-5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.15em' }}>
                  {step.number}
                </p>

                {/* Icon */}
                <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-5' style={{ backgroundColor: 'rgba(194,170,106,0.12)' }}>
                  <Icon className='w-5 h-5' style={{ color: '#C2AA6A' }} />
                </div>

                {/* Content */}
                <h3 className='text-base font-bold text-white mb-2' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {step.title}
                </h3>
                <p className='text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
