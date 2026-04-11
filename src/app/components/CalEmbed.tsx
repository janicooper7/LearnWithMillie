'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface CalEmbedProps {
  src: string
  allowance: number
  nextReset: string
}

export default function CalEmbed({ src, allowance, nextReset }: CalEmbedProps) {
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        // Cal.com fires this event on successful booking
        if (
          data?.type === 'cal:bookingSuccessful' ||
          data?.type === 'bookingSuccessful' ||
          data?.action === 'bookingSuccessful' ||
          data?.eventType === 'BOOKING_SUCCESSFUL'
        ) {
          setBooked(true)
        }
      } catch {}
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

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
          className='text-sm leading-relaxed mb-8 max-w-xs'
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          A calendar invitation has been sent to your email. We look forward to seeing you in your lesson.
        </p>
        <button
          onClick={() => setBooked(false)}
          className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200'
          style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
        >
          Book Another Lesson
        </button>
      </div>
    )
  }

  return (
    <div className='relative'>
      <iframe
        src={src}
        style={{ border: 0, width: '100%', height: '600px', opacity: allowance === 0 ? 0.4 : 1 }}
        frameBorder='0'
      />
      {allowance === 0 && (
        <div className='absolute inset-0 flex flex-col items-center justify-center' style={{ backgroundColor: 'rgba(244,237,228,0.6)' }}>
          <p className='text-sm font-medium mb-1' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
            No credits remaining
          </p>
          <p className='text-xs mb-5' style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Credits reset on {nextReset}
          </p>
          <a
            href='/#pricing'
            className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Upgrade Plan
          </a>
        </div>
      )}
    </div>
  )
}
