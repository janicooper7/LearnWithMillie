'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import Link from 'next/link'

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#1F3A34', '#C2AA6A', '#2A4D45', '#D4C08A', '#F4EDE4'],
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#1F3A34', '#C2AA6A', '#2A4D45', '#D4C08A', '#F4EDE4'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div
        className='max-w-xl w-full text-center bg-white rounded-xl p-8 md:p-12 border'
        style={{ borderColor: '#EDE4D8' }}
      >
        {/* Top accent */}
        <div
          className='w-12 h-1 rounded-full mx-auto mb-8'
          style={{ backgroundColor: '#C2AA6A' }}
        ></div>

        <h1
          className='text-3xl md:text-4xl font-bold mb-4'
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          You&apos;re all set!
        </h1>
        <p
          className='text-base leading-relaxed mb-3'
          style={{ color: '#1F3A34', opacity: 0.7 }}
        >
          Welcome aboard! Your subscription is confirmed and your lesson credits are ready to use.
        </p>
        <p
          className='text-base leading-relaxed mb-8'
          style={{ color: '#1F3A34', opacity: 0.7 }}
        >
          Head to your dashboard and use the calendar to book your first lesson with Millie.
        </p>

        <Link
          href='/dashboard'
          className='inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-105'
          style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Go to My Dashboard
        </Link>

        <p
          className='text-xs mt-6'
          style={{ color: '#1F3A34', opacity: 0.45 }}
        >
          Can&apos;t wait to see you in your first lesson!
        </p>
      </div>
    </div>
  )
}
