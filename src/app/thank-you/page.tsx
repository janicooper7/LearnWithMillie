'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import Link from 'next/link'

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation
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

      // Confetti from the left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#4A5568', '#718096', '#90A4AE', '#A0AEC0'],
      })

      // Confetti from the right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#4A5568', '#718096', '#90A4AE', '#A0AEC0'],
      })
    }, 250)

    // Cleanup
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12'>
        <h1 className='heading-lg text-gray-900 mb-6'>Thank You!</h1>
        <p className='text-gray-600 text-lg mb-8'>
          Your enquiry has been received successfully. I&apos;ll get back to you
          as soon as possible to discuss your English learning journey.
        </p>
        <div className='space-y-4'>
          <Link
            href='/'
            className='inline-block w-full md:w-auto px-8 py-3 rounded-full bg-custom-pink text-white font-semibold hover:bg-opacity-90 transition-colors'
          >
            Return to Home
          </Link>
          <p className='text-gray-500 text-sm'>
            In the meantime, feel free to explore more about my teaching methods
            and success stories.
          </p>
        </div>
      </div>
    </div>
  )
}
