'use client'

import { useState } from 'react'
import {
  Lock,
  Check,
  Infinity as InfinityIcon,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Brain,
} from 'lucide-react'

const PERKS = [
  { icon: Sparkles, label: 'Hundreds of ready-to-use ESL debate topics' },
  { icon: MessageSquare, label: 'Key vocabulary with example sentences for every topic' },
  { icon: Brain, label: 'Perfect for speaking practice & critical thinking' },
  { icon: InfinityIcon, label: 'One-time payment — lifetime access, no subscription' },
]

export default function DebateGeneratorPaywall({ loggedIn }: { loggedIn: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const NEXT = '/teachers/debategenerator'

  async function handlePurchase() {
    if (!loggedIn) {
      window.location.href = `/auth/login?next=${encodeURIComponent(NEXT)}`
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/debate-generator/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen py-20' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>
        {/* Hero */}
        <div className='text-center mb-12'>
          <h1 className='heading-lg text-gray-900 mb-6'>
            Random Debate <span className='text-gradient-primary'>Generator</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Get inspired with thought-provoking ESL debate topics and key vocabulary.
            Perfect for classroom discussions, speaking practice, or just sparking great
            conversations!
          </p>
        </div>

        <div className='max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch'>
          {/* Blurred preview */}
          <div className='relative rounded-3xl overflow-hidden border border-gray-200/50 shadow-2xl'>
            <div className='absolute inset-0 bg-white/95 backdrop-blur-xl' aria-hidden />
            <div className='relative p-8 select-none pointer-events-none' style={{ filter: 'blur(5px)' }}>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-2 h-2 bg-primary rounded-full' />
                <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                  Your Debate Topic
                </span>
              </div>
              <div className='bg-primary/5 rounded-2xl p-6 border border-primary/10 mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 leading-tight mb-4'>
                  Should social media platforms be held responsible for the content users post?
                </h2>
                <div className='h-1 bg-primary rounded-full' />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                {['accountability', 'moderation', 'free speech', 'liability', 'regulation', 'censorship'].map(
                  (k) => (
                    <div key={k} className='bg-gray-50 rounded-xl p-3 border border-gray-200'>
                      <span className='font-medium text-sm text-gray-700'>{k}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Lock overlay */}
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-6'>
              <div className='w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4'>
                <Lock className='w-7 h-7 text-white' />
              </div>
              <p className='text-lg font-bold text-gray-900'>Unlock the full generator</p>
              <p className='text-sm text-gray-600 max-w-xs mt-1'>
                Get instant access to every debate topic and vocabulary set.
              </p>
            </div>
          </div>

          {/* Pricing card */}
          <div className='bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-8 flex flex-col'>
            <div className='flex items-end gap-2 mb-1'>
              <span className='text-5xl font-bold text-gray-900'>$7</span>
              <span className='pb-1.5 text-gray-500 font-medium'>one-time</span>
            </div>
            <p className='text-sm font-semibold text-primary mb-6'>
              Lifetime access · teachers &amp; students
            </p>

            <ul className='space-y-3 mb-8'>
              {PERKS.map(({ icon: Icon, label }) => (
                <li key={label} className='flex items-start gap-3'>
                  <span className='flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5'>
                    <Check className='w-3.5 h-3.5 text-emerald-600' />
                  </span>
                  <span className='text-sm text-gray-700 leading-relaxed'>{label}</span>
                </li>
              ))}
            </ul>

            <div className='mt-auto space-y-3'>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className='btn-primary w-full gap-2 disabled:opacity-60'
              >
                {loading ? (
                  'Redirecting…'
                ) : loggedIn ? (
                  <>
                    Get lifetime access <ArrowRight className='w-4 h-4' />
                  </>
                ) : (
                  <>
                    Log in to unlock <ArrowRight className='w-4 h-4' />
                  </>
                )}
              </button>

              {!loggedIn && (
                <p className='text-center text-sm text-gray-600'>
                  New here?{' '}
                  <a href={`/auth/signup?next=${encodeURIComponent(NEXT)}`} className='font-semibold text-primary hover:underline'>
                    Create a free account
                  </a>
                </p>
              )}

              {error && <p className='text-center text-sm text-red-600'>{error}</p>}

              <p className='flex items-center justify-center gap-1.5 text-xs text-gray-500'>
                <Lock className='w-3.5 h-3.5' /> Secure checkout via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
