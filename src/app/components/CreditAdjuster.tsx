'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreditAdjuster({ userId, allowance }: { userId: string; allowance: number }) {
  const [value, setValue] = useState(allowance)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const adjust = async (delta: number) => {
    setLoading(true)
    const res = await fetch('/api/admin/update-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, delta }),
    })
    const data = await res.json()
    if (res.ok) {
      setValue(data.allowance)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={() => adjust(-1)}
        disabled={loading || value === 0}
        className='w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-70 disabled:opacity-30'
        style={{ backgroundColor: 'rgba(31,58,52,0.08)', color: '#1F3A34' }}
      >
        −
      </button>
      <span className='text-sm font-semibold w-4 text-center' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
        {value}
      </span>
      <button
        onClick={() => adjust(1)}
        disabled={loading}
        className='w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-70 disabled:opacity-30'
        style={{ backgroundColor: 'rgba(31,58,52,0.08)', color: '#1F3A34' }}
      >
        +
      </button>
    </div>
  )
}
