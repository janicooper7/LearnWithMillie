'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import UpgradePlanModal from './UpgradePlanModal'

interface CalEmbedProps {
  src: string
  allowance: number
  nextReset: string
}

interface BookingInfo {
  startTime: string
  endTime: string
}

export default function CalEmbed({ src, allowance: initialAllowance, nextReset }: CalEmbedProps) {
  const router = useRouter()
  const [booked, setBooked] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [allowance, setAllowance] = useState(initialAllowance)
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)
  const [iframeHidden, setIframeHidden] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

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

        // Extract booking date/time from Cal.com payload
        const booking = data?.data?.booking ?? data?.booking ?? data?.payload ?? {}
        const startTime = booking?.startTime ?? booking?.start ?? null
        const endTime = booking?.endTime ?? booking?.end ?? null
        if (startTime) setBookingInfo({ startTime, endTime })

        // Hide iframe immediately — no flash
        setIframeHidden(true)

        // Check current allowance — actual deduction is handled by the Cal.com webhook
        try {
          const res = await fetch('/api/deduct-credit', { method: 'POST' })
          if (res.ok) {
            const json = await res.json()
            if (json.skipped) {
              setCancelled(true)
              return
            }
            // Show optimistic allowance (webhook will decrement by 1)
            setAllowance(Math.max(0, (json.allowance ?? 1) - 1))
          }
        } catch {}

        setBooked(true)
        // Refresh server-rendered credits card after a short delay to let the webhook fire
        setTimeout(() => router.refresh(), 3000)
      } catch {}
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [router])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  if (cancelled) {
    return (
      <>
        {showUpgradeModal && <UpgradePlanModal onClose={() => { setShowUpgradeModal(false); setCancelled(false); setIframeHidden(false) }} />}
        <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
          <div className='w-14 h-14 rounded-full flex items-center justify-center mb-6' style={{ backgroundColor: 'rgba(192,57,43,0.07)' }}>
            <XCircle className='w-7 h-7' style={{ color: '#c0392b' }} />
          </div>
          <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-2' style={{ color: '#c0392b', fontFamily: 'var(--font-inter), sans-serif' }}>
            Booking cancelled
          </p>
          <h3 className='text-xl font-bold mb-3' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            No credits remaining
          </h3>
          <p className='text-sm leading-relaxed mb-7 max-w-xs' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Your booking was automatically cancelled because you have no lesson credits left. Credits reset on {nextReset}.
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:brightness-110'
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            View Plans
          </button>
        </div>
      </>
    )
  }

  if (booked) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
        <div className='w-14 h-14 rounded-full flex items-center justify-center mb-6' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
          <CheckCircle className='w-7 h-7' style={{ color: '#1F3A34' }} />
        </div>
        <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-2' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
          Booking confirmed
        </p>
        <h3 className='text-xl font-bold mb-4' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          You&apos;re all set!
        </h3>

        {bookingInfo && (
          <div className='mb-6 px-6 py-4 rounded-2xl' style={{ backgroundColor: '#F4EDE4', border: '1px solid #EDE4D8' }}>
            <p className='text-xs uppercase tracking-[0.15em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Your lesson
            </p>
            <p className='text-base font-semibold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {formatDate(bookingInfo.startTime)}
            </p>
            {bookingInfo.endTime && (
              <p className='text-sm mt-1' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {formatTime(bookingInfo.startTime)} – {formatTime(bookingInfo.endTime)}
              </p>
            )}
          </div>
        )}

        <p className='text-sm leading-relaxed mb-2 max-w-xs' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
          A calendar invitation has been sent to your email.
        </p>
        <p className='text-sm font-medium mb-8' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
          {allowance} {allowance === 1 ? 'credit' : 'credits'} remaining this month
        </p>
        {allowance > 0 && (
          <button
            onClick={() => { setBooked(false); setIframeHidden(false) }}
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
    <>
      {showUpgradeModal && <UpgradePlanModal onClose={() => { setShowUpgradeModal(false); setCancelled(false); setIframeHidden(false) }} />}
      <iframe
        src={src}
        style={{
          border: 0,
          width: '100%',
          height: '600px',
          display: 'block',
          opacity: iframeHidden ? 0 : 1,
          pointerEvents: iframeHidden ? 'none' : 'auto',
          transition: 'opacity 0.1s',
        }}
        frameBorder='0'
      />
    </>
  )
}
