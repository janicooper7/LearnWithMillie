'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CalEmbedProps {
  src: string
  allowance: number
  nextReset: string
}

export default function CalEmbed({ src, allowance: initialAllowance, nextReset }: CalEmbedProps) {
  const router = useRouter()
  const [booked, setBooked] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [allowance, setAllowance] = useState(initialAllowance)

  useEffect(() => {
    const handler = async (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        const isBookingSuccess =
          data?.type === 'cal:bookingSuccessful' ||
          data?.type === 'bookingSuccessful' ||
          data?.action === 'bookingSuccessful' ||
          data?.eventType === 'BOOKING_SUCCESSFUL'

        if (!isBookingSuccess) return

        // Deduct credit immediately
        try {
          const res = await fetch('/api/deduct-credit', { method: 'POST' })
          if (res.ok) {
            const json = await res.json()
            if (json.skipped) {
              // 0 credits — webhook will cancel the booking server-side
              setCancelled(true)
              return
            }
            setAllowance(json.allowance ?? 0)
          }
        } catch {}

        setBooked(true)

        // Refresh server data so upcoming bookings appear
        setTimeout(() => router.refresh(), 2000)
      } catch {}
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [router])

  if (cancelled) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
        <div
          className='w-14 h-14 rounded-full flex items-center justify-center mb-6'
          style={{ backgroundColor: 'rgba(192,57,43,0.07)' }}
        >
          <XCircle className='w-7 h-7' style={{ color: '#c0392b' }} />
        </div>
        <p
          className='text-xs uppercase tracking-[0.2em] font-semibold mb-2'
          style={{ color: '#c0392b', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Booking cancelled
        </p>
        <h3
          className='text-xl font-bold mb-3'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          No credits remaining
        </h3>
        <p
          className='text-sm leading-relaxed mb-7 max-w-xs'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Your booking was automatically cancelled because you have no lesson credits left. Credits reset on {nextReset}.
        </p>
        <a
          href='/#pricing'
          className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:brightness-110'
          style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Upgrade Plan
        </a>
      </div>
    )
  }

  if (booked) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
        <div
          className='w-14 h-14 rounded-full flex items-center justify-center mb-6'
          style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
        >
          <CheckCircle className='w-7 h-7' style={{ color: '#1F3A34' }} />
        </div>
        <p
          className='text-xs uppercase tracking-[0.2em] font-semibold mb-2'
          style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Booking confirmed
        </p>
        <h3
          className='text-xl font-bold mb-3'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          You&apos;re all set!
        </h3>
        <p
          className='text-sm leading-relaxed mb-2 max-w-xs'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          A calendar invitation has been sent to your email. We look forward to seeing you in your lesson.
        </p>
        <p
          className='text-sm font-medium mb-8'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {allowance} {allowance === 1 ? 'credit' : 'credits'} remaining this month
        </p>
        {allowance > 0 && (
          <button
            onClick={() => setBooked(false)}
            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200'
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
          >
            Book Another Lesson
          </button>
        )}
      </div>
    )
  }

  return (
    <iframe
      src={src}
      style={{ border: 0, width: '100%', height: '600px', display: 'block' }}
      frameBorder='0'
    />
  )
}
