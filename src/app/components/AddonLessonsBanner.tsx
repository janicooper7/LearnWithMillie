'use client'

import { useState } from 'react'
import { Minus, Plus, ArrowRight } from 'lucide-react'

export default function AddonLessonsBanner() {
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)

  const decrement = () => setQty((q) => Math.max(1, q - 1))
  const increment = () => setQty((q) => Math.min(20, q + 1))

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'additional-lessons', quantity: qty }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    setLoading(false)
  }

  return (
    <div
      className='rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5'
      style={{ backgroundColor: '#1F3A34' }}
    >
      {/* Left — copy */}
      <div className='flex items-center gap-4'>
        <div className='w-0.5 h-10 rounded-full flex-shrink-0' style={{ backgroundColor: '#C2AA6A' }} />
        <div>
          <p
            className='text-white font-semibold text-sm'
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Need additional lessons?
          </p>
          <p
            className='text-xs mt-0.5'
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Top up at <span style={{ color: '#C2AA6A', fontWeight: 600 }}>$40</span> per lesson — no subscription needed.
          </p>
        </div>
      </div>

      {/* Right — qty selector + CTA */}
      <div className='flex items-center gap-3 flex-shrink-0'>
        {/* Quantity control */}
        <div
          className='flex items-center rounded-xl overflow-hidden'
          style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={decrement}
            disabled={qty <= 1}
            className='w-9 h-9 flex items-center justify-center transition-colors duration-150 disabled:opacity-30'
            style={{ color: 'white' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
          >
            <Minus className='w-3.5 h-3.5' />
          </button>

          <div className='w-10 text-center'>
            <span
              className='text-sm font-semibold text-white'
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {qty}
            </span>
          </div>

          <button
            onClick={increment}
            disabled={qty >= 20}
            className='w-9 h-9 flex items-center justify-center transition-colors duration-150 disabled:opacity-30'
            style={{ color: 'white' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
          >
            <Plus className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Total */}
        <span
          className='text-sm font-semibold w-14 text-right'
          style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          ${qty * 40}
        </span>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60'
          style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {loading ? 'Redirecting…' : 'Book now'}
          {!loading && <ArrowRight className='w-4 h-4' />}
        </button>
      </div>
    </div>
  )
}
