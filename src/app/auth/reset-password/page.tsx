'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: '1.5px solid #EDE4D8', fontSize: '14px', color: '#1F3A34',
  outline: 'none', backgroundColor: 'white', fontFamily: 'var(--font-inter), sans-serif',
  transition: 'border-color 0.2s',
}

function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Those passwords don\u2019t match.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/auth/login'), 2500)
  }

  if (!token) {
    return (
      <div>
        <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
          This link isn&apos;t valid
        </h1>
        <p className='mt-4 text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
          It may have been copied incompletely.{' '}
          <Link href='/auth/forgot-password' className='font-semibold underline' style={{ color: '#1F3A34' }}>
            Request a new reset link
          </Link>.
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div>
        <div className='flex items-center justify-center w-12 h-12 rounded-full mb-6' style={{ backgroundColor: 'rgba(194,170,106,0.15)' }}>
          <CheckCircle2 className='w-5 h-5' style={{ color: '#C2AA6A' }} />
        </div>
        <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
          Password updated
        </h1>
        <p className='mt-4 text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
          Taking you to the sign-in page…
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='mb-8'>
        <p className='text-[10px] uppercase tracking-[0.22em] font-semibold mb-2.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
          Almost there
        </p>
        <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
          Choose a new password
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label className='block text-[10px] font-semibold uppercase tracking-[0.18em] mb-2' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
            New password
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='At least 8 characters'
            required
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#1F3A34' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#EDE4D8' }}
          />
        </div>

        <div>
          <label className='block text-[10px] font-semibold uppercase tracking-[0.18em] mb-2' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Confirm password
          </label>
          <input
            type='password'
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder='••••••••'
            required
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#1F3A34' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#EDE4D8' }}
          />
        </div>

        {error && (
          <p className='text-sm py-2.5 px-4 rounded-lg' style={{ color: '#c0392b', backgroundColor: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.12)', fontFamily: 'var(--font-inter), sans-serif' }}>
            {error}
          </p>
        )}

        <div style={{ paddingTop: '4px' }}>
          <button
            type='submit'
            disabled={loading}
            className='w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 disabled:opacity-50'
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em' }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
          >
            {loading ? 'Saving…' : 'Set new password'}
            {!loading && <ArrowRight className='w-4 h-4' />}
          </button>
        </div>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-6 py-16' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='w-full max-w-[420px]'>
        <div className='mb-8'>
          <Link href='/auth/login' className='text-[11px] uppercase tracking-[0.18em] font-medium' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
            ← Back to sign in
          </Link>
        </div>
        <div className='bg-white rounded-2xl p-8 md:p-10' style={{ border: '1px solid #EDE4D8', boxShadow: '0 1px 3px rgba(31,58,52,0.04), 0 8px 32px rgba(31,58,52,0.05)' }}>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
