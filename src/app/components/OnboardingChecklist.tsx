'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import UpgradePlanModal from './UpgradePlanModal'
import { track, trackingContext } from '@/lib/trackClient'

interface OnboardingChecklistProps {
  trialDone: boolean
  bookingDone: boolean
  planDone: boolean
}

// Steps 2–4 are the ones people drop out of: they land on the dashboard, book a
// slot in the calendar without any credits, and the Cal webhook silently cancels
// it. Showing the order explicitly (buy → book → plan) is the fix.
export default function OnboardingChecklist({ trialDone, bookingDone, planDone }: OnboardingChecklistProps) {
  const [showPlans, setShowPlans] = useState(false)
  const [loadingTrial, setLoadingTrial] = useState(false)

  const handleTrialCheckout = async () => {
    setLoadingTrial(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'trial', tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('lessons', 'checkout_start')
        window.location.href = data.url
        return
      }
    } catch {}
    setLoadingTrial(false)
  }

  const scrollToCalendar = () => {
    document.getElementById('book-lesson')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const steps = [
    {
      title: 'Create your account',
      hint: "Done — you're signed in.",
      done: true,
      cta: null as null | { label: string; onClick: () => void; loading?: boolean },
    },
    {
      title: 'Buy a trial lesson',
      hint: '20 minutes with Millie.',
      done: trialDone,
      cta: { label: loadingTrial ? 'Redirecting…' : 'Buy trial — $20', onClick: handleTrialCheckout, loading: loadingTrial },
    },
    {
      title: 'Book your lesson',
      hint: 'Pick a time in the calendar below.',
      done: bookingDone,
      cta: { label: 'Pick a time', onClick: scrollToCalendar },
    },
    {
      title: 'Select a plan',
      hint: 'Keep going with monthly lessons.',
      done: planDone,
      cta: { label: 'See plans', onClick: () => setShowPlans(true) },
    },
  ]

  // The first unfinished step is the only one we push — everything after it is
  // still greyed out so there is one obvious thing to do.
  const activeIndex = steps.findIndex((s) => !s.done)
  if (activeIndex === -1) return null

  // Counts the step you're standing on, not the ones behind you — "Step 2 of 4"
  // while step 2 is the one being asked of you.
  const currentStep = activeIndex + 1

  return (
    <>
      {showPlans && <UpgradePlanModal onClose={() => setShowPlans(false)} trialPurchased={trialDone} />}

      <div className='mb-8 bg-white rounded-2xl p-5 sm:p-7' style={{ border: '1px solid #EDE4D8' }}>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div>
            <p className='text-[13px] uppercase tracking-[0.2em] font-semibold mb-1.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Getting started
            </p>
            <h2 className='text-2xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your first steps
            </h2>
          </div>
          <span className='flex-shrink-0 text-[13px] font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap' style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <div className='w-full rounded-full h-1 mb-6' style={{ backgroundColor: 'rgba(31,58,52,0.08)' }}>
          <div className='h-1 rounded-full transition-all duration-500' style={{ width: `${(currentStep / steps.length) * 100}%`, backgroundColor: '#C2AA6A' }} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
          {steps.map((step, i) => {
            const isActive = i === activeIndex
            return (
              <div
                key={step.title}
                className='rounded-xl p-5 flex flex-col'
                style={{
                  backgroundColor: isActive ? '#1F3A34' : step.done ? 'rgba(31,58,52,0.04)' : 'transparent',
                  border: isActive ? '1px solid #1F3A34' : step.done ? '1px solid #EDE4D8' : '1px dashed rgba(31,58,52,0.15)',
                }}
              >
                <div className='flex items-center gap-2.5 mb-2.5'>
                  <div
                    className='w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{
                      backgroundColor: step.done ? '#C2AA6A' : isActive ? 'rgba(255,255,255,0.15)' : 'rgba(31,58,52,0.08)',
                    }}
                  >
                    {step.done ? (
                      <Check className='w-3.5 h-3.5 text-white' strokeWidth={3} />
                    ) : (
                      <span className='text-[12px] font-bold' style={{ color: isActive ? 'white' : 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <p
                    className='text-[15px] font-semibold leading-tight'
                    style={{
                      color: isActive ? 'white' : step.done ? 'rgba(31,58,52,0.55)' : 'rgba(31,58,52,0.45)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {step.title}
                  </p>
                </div>

                <p
                  className='text-sm leading-relaxed mb-4'
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(31,58,52,0.4)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {step.hint}
                </p>

                {isActive && step.cta && (
                  <button
                    onClick={step.cta.onClick}
                    disabled={step.cta.loading}
                    className='mt-auto w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 disabled:opacity-60'
                    style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {step.cta.label}
                    {!step.cta.loading && <ArrowRight className='w-4 h-4' />}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
