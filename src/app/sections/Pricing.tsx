'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckIcon } from '@heroicons/react/24/solid'
import { ArrowRight } from 'lucide-react'
import { track, trackingContext } from '@/lib/trackClient'

const plans = [
  {
    name: 'Standard',
    price: 40,
    lessons: 4,
    description: 'Ideal for flexible learning',
    featured: false,
    planKey: 'four',
    features: [
      '4 lessons per month',
      'Personalised lesson plans',
      'Progress tracking',
      'Learning materials included',
      'Priority scheduling',
      'Email support between lessons',
    ],
  },
  {
    name: 'Advanced',
    price: 38,
    lessons: 8,
    description: 'Perfect for steady progress',
    featured: true,
    planKey: 'eight',
    features: [
      '8 lessons per month',
      'Personalised lesson plans',
      'Progress tracking',
      'Learning materials included',
      'Priority scheduling',
      'Email support between lessons',
    ],
  },
  {
    name: 'Pro',
    price: 35,
    lessons: 12,
    description: 'Best for intensive learning',
    featured: false,
    planKey: 'twelve',
    features: [
      '12 lessons per month',
      'Personalised lesson plans',
      'Progress tracking',
      'Learning materials included',
      'Priority scheduling',
      'Email support between lessons',
    ],
  },
]

export default function Pricing() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { data: session } = useSession()

  const handleCheckout = async (planKey: string, planName: string) => {
    if (!session) {
      window.location.href = `/auth/signup?next=%2F%23pricing`
      return
    }
    setLoadingPlan(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('lessons', 'checkout_start')
        window.location.href = data.url
      } else console.error('Checkout error:', data.error)
    } catch (err) {
      console.error('Checkout failed:', err)
    } finally {
      setLoadingPlan(null)
    }
  }

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
          y: 0, opacity: 1, duration: 0.6, delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top bottom-=80' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section className='section-padding' id='pricing' style={{ backgroundColor: '#F4EDE4' }}>
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
            <h2 className='heading-lg' style={{ color: '#1F3A34' }}>
              Simple,<br />Transparent Pricing
            </h2>
          </div>
          <p
            className='text-base leading-relaxed max-w-xs md:text-right'
            style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            All plans include personalised attention and flexible scheduling.
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className='rounded-2xl overflow-hidden mb-6' style={{ border: '1px solid #EDE4D8' }}>
          <div
            className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-8 py-7'
            style={{ backgroundColor: '#fff' }}
          >
            <div className='flex items-start gap-5'>
              <div className='w-0.5 self-stretch rounded-full flex-shrink-0' style={{ backgroundColor: '#C2AA6A', minHeight: '40px' }} />
              <div>
                <p className='text-[11px] uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                  New Students
                </p>
                <p className='text-base font-semibold mb-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  Start with a 20-minute trial lesson — $20
                </p>
                <p className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  No commitment. Discuss your goals and see if we&apos;re a good fit.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCheckout('trial', 'Trial')}
              disabled={loadingPlan !== null}
              className='flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:brightness-105 disabled:opacity-60'
              style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {loadingPlan === 'Trial' ? 'Redirecting…' : 'Book Trial Lesson'}
              {loadingPlan !== 'Trial' && <ArrowRight className='w-4 h-4' />}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className='grid md:grid-cols-3 gap-5 mb-0'>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              ref={(el) => { cardsRef.current[index] = el }}
              className='relative rounded-2xl bg-white flex flex-col'
              style={{
                border: plan.featured ? '2px solid #1F3A34' : '1px solid #EDE4D8',
                transform: plan.featured ? 'translateY(-6px)' : 'none',
                boxShadow: plan.featured
                  ? '0 20px 50px rgba(31,58,52,0.13)'
                  : '0 2px 12px rgba(31,58,52,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = plan.featured
                  ? '0 24px 60px rgba(31,58,52,0.18)'
                  : '0 12px 32px rgba(31,58,52,0.1)'
                if (!plan.featured) el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = plan.featured
                  ? '0 20px 50px rgba(31,58,52,0.13)'
                  : '0 2px 12px rgba(31,58,52,0.05)'
                el.style.transform = plan.featured ? 'translateY(-6px)' : 'none'
              }}
            >
              {/* Most Popular badge */}
              {plan.featured && (
                <div className='absolute -top-3.5 left-0 right-0 flex justify-center'>
                  <span
                    className='text-[10px] uppercase tracking-[0.18em] font-semibold px-4 py-1.5 rounded-full'
                    style={{
                      backgroundColor: '#C2AA6A',
                      color: 'white',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className='p-8 flex flex-col flex-1'>

                {/* Plan name + description */}
                <div className='mb-6'>
                  <h3
                    className='text-2xl font-bold mb-1.5'
                    style={{
                      color: '#1F3A34',
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className='text-sm'
                    style={{
                      color: 'rgba(31,58,52,0.7)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div
                  className='mb-7 pb-7'
                  style={{ borderBottom: '1px solid #EDE4D8' }}
                >
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
                      ${plan.price}
                    </span>
                    <span
                      className='text-base mb-1.5'
                      style={{
                        color: 'rgba(31,58,52,0.65)',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      / lesson
                    </span>
                  </div>
                  <p
                    className='text-sm'
                    style={{
                      color: 'rgba(31,58,52,0.65)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    ${plan.price * plan.lessons} / month &nbsp;·&nbsp; 50 min per lesson
                  </p>
                </div>

                {/* Features */}
                <ul className='space-y-3.5 mb-8 flex-1'>
                  {plan.features.map((feature, i) => (
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

                {/* CTA */}
                <button
                  onClick={() => handleCheckout(plan.planKey, plan.name)}
                  disabled={loadingPlan !== null}
                  className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
                  style={{
                    backgroundColor: '#1F3A34',
                    color: 'white',
                    fontFamily: 'var(--font-inter), sans-serif',
                    letterSpacing: '0.03em',
                  }}
                  onMouseEnter={(e) => { if (!loadingPlan) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
                >
                  {loadingPlan === plan.name ? 'Redirecting…' : 'Get Started'}
                  {loadingPlan !== plan.name && <ArrowRight className='w-4 h-4' />}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
