'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import UpgradePlanModal from './UpgradePlanModal'
import { track, trackingContext } from '@/lib/trackClient'

interface BookLessonCardProps {
  trialPurchased: boolean
  isTeacher?: boolean
}

export default function BookLessonCard({ trialPurchased, isTeacher }: BookLessonCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [loadingTrial, setLoadingTrial] = useState(false)

  const handleTrialCheckout = async () => {
    setLoadingTrial(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The trial is bought from the dashboard, but the visit that earned it
        // started on a marketing page. Sending the ids lets the Stripe webhook
        // attribute the sale back to that visit instead of dropping it.
        body: JSON.stringify({ plan: 'trial', tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('lessons', 'checkout_start')
        window.location.href = data.url
      }
    } catch {}
    setLoadingTrial(false)
  }

  return (
    <>
      {showModal && <UpgradePlanModal onClose={() => setShowModal(false)} trialPurchased={trialPurchased} isTeacher={isTeacher} />}
      <div className='rounded-2xl p-5 sm:p-7 flex flex-col' style={{ backgroundColor: '#1F3A34' }}>
        <div className='w-0.5 h-8 rounded-full mb-5' style={{ backgroundColor: '#C2AA6A' }} />
        <h2 className='text-lg sm:text-xl font-bold text-white mb-3' style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          {isTeacher ? 'Ready for your mentorship session?' : 'Ready for your next lesson?'}
        </h2>
        <p className='text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
          {isTeacher
            ? 'Book a mentorship session with Millie and keep developing your teaching craft.'
            : 'Book a session with Millie and keep making progress toward your goals.'}
        </p>
        <div className='flex flex-col gap-2.5 mt-6'>
          <button
            onClick={() => setShowModal(true)}
            className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {isTeacher ? 'Pick your package' : 'Buy Lessons'} <ArrowRight className='w-4 h-4' />
          </button>
          {!isTeacher && !trialPurchased && (
            <button
              onClick={handleTrialCheckout}
              disabled={loadingTrial}
              className='w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-60'
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-inter), sans-serif' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.14)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)' }}
            >
              {loadingTrial ? 'Redirecting…' : 'Book Trial Lesson — $20'}
              {!loadingTrial && <ArrowRight className='w-4 h-4' />}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
