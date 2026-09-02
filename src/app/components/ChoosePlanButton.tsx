'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import UpgradePlanModal from './UpgradePlanModal'

interface ChoosePlanButtonProps {
  trialPurchased: boolean
  label?: string
}

export default function ChoosePlanButton({ trialPurchased, label = 'Choose your plan' }: ChoosePlanButtonProps) {
  const [showPlans, setShowPlans] = useState(false)

  return (
    <>
      {showPlans && <UpgradePlanModal onClose={() => setShowPlans(false)} trialPurchased={trialPurchased} />}
      <button
        onClick={() => setShowPlans(true)}
        className='inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:brightness-110'
        style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label} <ArrowRight className='w-4 h-4' />
      </button>
    </>
  )
}
