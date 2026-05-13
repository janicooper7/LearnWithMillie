'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Bell } from 'lucide-react'
import gsap from 'gsap'

export default function CoursesComingSoon() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, delay: 0.1, ease: 'power2.out' }
      )
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/courses-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="section-padding" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center" ref={heroRef}>

          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ backgroundColor: 'rgba(194,170,106,0.15)', border: '1px solid rgba(194,170,106,0.4)' }}>
            <Bell className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
            <span className="text-xs uppercase tracking-[0.2em] font-medium"
              style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Coming Soon
            </span>
          </div>

          {/* Headline */}
          <h1 className="heading-xl mb-5" style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Courses for English Teachers
          </h1>

          {/* Description */}
          <p className="text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Millie is building a suite of in-depth courses designed to help English teachers grow their skills,
            find their niche, and build a thriving teaching practice. Be the first to know when they launch.
          </p>

          {/* Subscribe form */}
          {status === 'success' ? (
            <div className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl"
              style={{ backgroundColor: 'rgba(31,58,52,0.07)', border: '1px solid rgba(31,58,52,0.12)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#1F3A34' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                You&apos;re on the list — we&apos;ll let you know as soon as they&apos;re ready.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#C2AA6A]/40"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(31,58,52,0.15)',
                  color: '#1F3A34',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#C2AA6A]/40"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(31,58,52,0.15)',
                  color: '#1F3A34',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {status === 'loading' ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>Notify me <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm" style={{ color: '#c0392b', fontFamily: 'var(--font-inter), sans-serif' }}>
              {errorMessage}
            </p>
          )}

          <p className="mt-4 text-xs" style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
            No spam. Unsubscribe any time.
          </p>

        </div>
      </div>
    </section>
  )
}
