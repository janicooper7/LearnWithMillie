'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setLoading(true)
    await fetch('/api/cancel-subscription', { method: 'POST' })
    setLoading(false)
    setConfirming(false)
    router.refresh()
  }

  // Two explicit buttons rather than a tap-twice link: cancelling is the one
  // action here we don't want anyone taking by accident, and backing out has to
  // be as easy to reach as going through with it.
  if (confirming) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
          Cancel your subscription? You&apos;ll keep your lessons until the end of the current billing period.
        </p>
        <div className='flex flex-wrap gap-2.5'>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className='inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:brightness-110 disabled:opacity-50'
            style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Keep my plan
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className='inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:brightness-105 disabled:opacity-50'
            style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.25)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {loading ? 'Cancelling…' : 'Yes, cancel'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className='text-sm transition-colors duration-200'
      style={{ color: 'rgba(31,58,52,0.45)', textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: 'var(--font-inter), sans-serif' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(31,58,52,0.45)' }}
    >
      Cancel subscription
    </button>
  )
}
