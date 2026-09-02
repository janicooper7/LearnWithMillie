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
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='text-[11px]' style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
          Sure?
        </span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className='text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors duration-150 disabled:opacity-50'
          style={{ backgroundColor: 'rgba(232,131,111,0.18)', color: '#E8836F', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {loading ? '…' : 'Yes, cancel'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className='text-[11px] font-semibold px-2.5 py-1 rounded-full'
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
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
      style={{ backgroundColor: 'rgba(232,131,111,0.12)', color: 'rgba(232,131,111,0.85)', fontFamily: 'var(--font-inter), sans-serif' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#E8836F' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(232,131,111,0.85)' }}
    >
      Cancel
    </button>
  )
}
