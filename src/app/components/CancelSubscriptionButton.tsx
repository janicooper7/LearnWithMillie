'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    setLoading(true)
    await fetch('/api/cancel-subscription', { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className='text-xs transition-opacity duration-200 hover:opacity-70 disabled:opacity-40'
      style={{ color: confirmed ? '#c0392b' : 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}
    >
      {loading ? 'Cancelling…' : confirmed ? 'Tap again to confirm' : 'Cancel subscription'}
    </button>
  )
}
