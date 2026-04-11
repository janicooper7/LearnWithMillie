'use client'

import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { CheckIcon } from '@heroicons/react/24/solid'

const plans = [
  {
    name: 'Standard',
    price: 40,
    lessons: 4,
    description: 'Ideal for flexible learning',
    featured: false,
    planKey: 'four',
  },
  {
    name: 'Advanced',
    price: 38,
    lessons: 8,
    description: 'Perfect for steady progress',
    featured: true,
    planKey: 'eight',
  },
  {
    name: 'Pro',
    price: 35,
    lessons: 12,
    description: 'Best for intensive learning',
    featured: false,
    planKey: 'twelve',
  },
]

interface UpgradePlanModalProps {
  onClose: () => void
}

export default function UpgradePlanModal({ onClose }: UpgradePlanModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (planKey: string, planName: string) => {
    setLoadingPlan(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    setLoadingPlan(null)
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center px-4'
      style={{ backgroundColor: 'rgba(31,58,52,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className='relative w-full max-w-4xl rounded-2xl p-6 md:p-8'
        style={{ backgroundColor: '#F4EDE4', border: '1px solid #EDE4D8', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70'
          style={{ backgroundColor: 'rgba(31,58,52,0.08)' }}
        >
          <X className='w-4 h-4' style={{ color: '#1F3A34' }} />
        </button>

        {/* Header */}
        <div className='mb-7 text-center'>
          <p className='text-[10px] uppercase tracking-[0.25em] font-semibold mb-2' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            No credits remaining
          </p>
          <h2 className='text-2xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Choose a plan to continue booking
          </h2>
        </div>

        {/* Cards */}
        <div className='grid md:grid-cols-3 gap-4'>
          {/* Trial card */}
          <div
            className='md:col-span-3 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <div className='flex items-start gap-4'>
              <div className='w-0.5 self-stretch rounded-full flex-shrink-0' style={{ backgroundColor: '#C2AA6A', minHeight: '36px' }} />
              <div>
                <p className='text-[10px] uppercase tracking-[0.2em] font-semibold mb-0.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                  New Students
                </p>
                <p className='text-sm font-semibold mb-0.5' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  Book a 20-minute trial lesson — $20
                </p>
                <p className='text-xs' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  No commitment. Discuss your goals and see if we&apos;re a good fit.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCheckout('trial', 'Trial')}
              disabled={loadingPlan !== null}
              className='flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:brightness-105 disabled:opacity-60'
              style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {loadingPlan === 'Trial' ? 'Redirecting…' : 'Book Trial'}
              {loadingPlan !== 'Trial' && <ArrowRight className='w-4 h-4' />}
            </button>
          </div>

          {plans.map((plan) => (
            <div
              key={plan.name}
              className='relative rounded-2xl bg-white flex flex-col'
              style={{
                border: plan.featured ? '2px solid #1F3A34' : '1px solid #EDE4D8',
                transform: plan.featured ? 'translateY(-4px)' : 'none',
                boxShadow: plan.featured ? '0 16px 40px rgba(31,58,52,0.12)' : '0 2px 8px rgba(31,58,52,0.05)',
              }}
            >
              {plan.featured && (
                <div className='absolute -top-3 left-0 right-0 flex justify-center'>
                  <span
                    className='text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-1 rounded-full'
                    style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className='p-6 flex flex-col flex-1'>
                <h3 className='text-xl font-bold mb-1' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {plan.name}
                </h3>
                <p className='text-xs mb-5' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {plan.description}
                </p>

                <div className='mb-5 pb-5' style={{ borderBottom: '1px solid #EDE4D8' }}>
                  <div className='flex items-end gap-1.5 mb-1'>
                    <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1, color: '#1F3A34' }}>
                      ${plan.price}
                    </span>
                    <span className='text-sm mb-1' style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      / lesson
                    </span>
                  </div>
                  <p className='text-xs' style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    ${plan.price * plan.lessons} / month · {plan.lessons} lessons
                  </p>
                </div>

                <ul className='space-y-2.5 mb-6 flex-1'>
                  {[
                    `${plan.lessons} lessons per month`,
                    'Personalised lesson plans',
                    'Progress tracking',
                    'Learning materials included',
                  ].map((feature, i) => (
                    <li key={feature} className='flex items-center gap-2.5'>
                      <div className='w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0' style={{ backgroundColor: 'rgba(31,58,52,0.08)' }}>
                        <CheckIcon className='w-2.5 h-2.5' style={{ color: '#1F3A34' }} />
                      </div>
                      <span className='text-xs' style={{ color: 'rgba(31,58,52,0.75)', fontFamily: 'var(--font-inter), sans-serif', fontWeight: i === 0 ? 600 : 400 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.planKey, plan.name)}
                  disabled={loadingPlan !== null}
                  className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-60'
                  style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
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
    </div>
  )
}
