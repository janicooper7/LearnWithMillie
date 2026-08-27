'use client'

import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { trackingContext } from '@/lib/trackClient'

const studentPlans = [
  {
    name: 'Standard',
    price: 40,
    sessions: 4,
    description: 'Ideal for flexible learning',
    featured: false,
    planKey: 'four',
  },
  {
    name: 'Advanced',
    price: 38,
    sessions: 8,
    description: 'Perfect for steady progress',
    featured: true,
    planKey: 'eight',
  },
  {
    name: 'Pro',
    price: 35,
    sessions: 12,
    description: 'Best for intensive learning',
    featured: false,
    planKey: 'twelve',
  },
]

const teacherPlans = [
  {
    name: 'Single',
    price: 50,
    sessions: 1,
    description: 'Try a session and see how it feels',
    featured: false,
    planKey: 'mentorship-single',
  },
  {
    name: 'Double',
    price: 95,
    sessions: 2,
    description: 'Build on your first session with follow-up',
    featured: true,
    planKey: 'mentorship-double',
  },
  {
    name: 'Triple',
    price: 140,
    sessions: 3,
    description: 'The best value for focused development',
    featured: false,
    planKey: 'mentorship-triple',
  },
]

interface UpgradePlanModalProps {
  onClose: () => void
  trialPurchased?: boolean
  isTeacher?: boolean
}

export default function UpgradePlanModal({ onClose, trialPurchased, isTeacher }: UpgradePlanModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (planKey: string, planName: string) => {
    setLoadingPlan(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Carries the visit so the Stripe webhook can attribute the sale.
        body: JSON.stringify({ plan: planKey, tracking: trackingContext() }),
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
          {!isTeacher && (
            <p className='text-[10px] uppercase tracking-[0.25em] font-semibold mb-2' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              No lessons remaining
            </p>
          )}
          <h2 className='text-2xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {isTeacher ? 'Choose a mentorship package' : 'Choose a plan to continue booking'}
          </h2>
        </div>

        {/* Cards */}
        <div className='grid md:grid-cols-3 gap-4'>
          {/* Trial card — students only, hidden if already purchased */}
          {!isTeacher && !trialPurchased && <div
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
          </div>}

          {(isTeacher ? teacherPlans : studentPlans).map((plan) => (
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
                    {!isTeacher && (
                      <span className='text-sm mb-1' style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
                        / lesson
                      </span>
                    )}
                  </div>
                  <p className='text-xs' style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {isTeacher
                      ? `One-time · ${plan.sessions} × 50-min ${plan.sessions === 1 ? 'session' : 'sessions'}`
                      : `$${plan.price * plan.sessions} / month · ${plan.sessions} lessons`}
                  </p>
                </div>

                <ul className='space-y-2.5 mb-6 flex-1'>
                  {(isTeacher ? [
                    `${plan.sessions} × 50-min mentorship ${plan.sessions === 1 ? 'session' : 'sessions'}`,
                    'Personalised feedback',
                    'Resource recommendations',
                  ] : [
                    `${plan.sessions} lessons per month`,
                    'Personalised lesson plans',
                    'Progress tracking',
                    'Learning materials included',
                  ]).map((feature, i) => (
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
                  {loadingPlan === plan.name ? 'Redirecting…' : isTeacher ? 'Pick this one' : 'Get Started'}
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
