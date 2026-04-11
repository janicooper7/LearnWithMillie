'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import UpgradePlanModal from './UpgradePlanModal'

interface CreditsCardActionsProps {
  trialPurchased: boolean
}

export default function CreditsCardActions({ trialPurchased }: CreditsCardActionsProps) {
  const [showModal, setShowModal] = useState(false)
  const [loadingTrial, setLoadingTrial] = useState(false)

  const handleTrialCheckout = async () => {
    setLoadingTrial(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'trial' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    setLoadingTrial(false)
  }

  return (
    <>
      {showModal && <UpgradePlanModal onClose={() => setShowModal(false)} trialPurchased={trialPurchased} />}
      <div className='flex flex-row gap-2.5 mt-4'>
        <button
          onClick={() => setShowModal(true)}
          className='inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 hover:brightness-110'
          style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Buy Credits <ArrowRight className='w-3.5 h-3.5' />
        </button>
        {!trialPurchased && (
          <button
            onClick={handleTrialCheckout}
            disabled={loadingTrial}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-60'
            style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: '#1F3A34', border: '1px solid rgba(31,58,52,0.15)', fontFamily: 'var(--font-inter), sans-serif' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(31,58,52,0.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(31,58,52,0.06)' }}
          >
            {loadingTrial ? 'Redirecting…' : 'Book Trial Lesson — $20'}
            {!loadingTrial && <ArrowRight className='w-3.5 h-3.5' />}
          </button>
        )}
      </div>
    </>
  )
}
