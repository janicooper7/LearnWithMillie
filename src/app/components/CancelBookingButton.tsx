'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelBookingButton({ uid }: { uid: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      })
      if (res.ok) {
        setTimeout(() => router.refresh(), 1500)
      }
    } catch {}
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className='flex items-center gap-1.5'>
        <span className='text-[11px]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
          Sure?
        </span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className='text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors duration-150 disabled:opacity-50'
          style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: '#c0392b', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {loading ? '…' : 'Yes, cancel'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className='text-[11px] font-semibold px-2.5 py-1 rounded-full'
          style={{ backgroundColor: 'rgba(31,58,52,0.07)', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Keep
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className='text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors duration-150'
      style={{ backgroundColor: 'rgba(192,57,43,0.07)', color: 'rgba(192,57,43,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(192,57,43,0.7)' }}
    >
      Cancel
    </button>
  )
}
