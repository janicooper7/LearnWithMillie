'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MailCheck } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: '1.5px solid #EDE4D8', fontSize: '14px', color: '#1F3A34',
  outline: 'none', backgroundColor: 'white', fontFamily: 'var(--font-inter), sans-serif',
  transition: 'border-color 0.2s',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // The API deliberately answers the same way whether or not the account
    // exists, so there is no error branch to handle here.
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    setLoading(false)
    setSent(true)
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-6 py-16' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='w-full max-w-[420px]'>
        <div className='mb-8'>
          <Link href='/auth/login' className='text-[11px] uppercase tracking-[0.18em] font-medium' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
            ← Back to sign in
          </Link>
        </div>

        <div className='bg-white rounded-2xl p-8 md:p-10' style={{ border: '1px solid #EDE4D8', boxShadow: '0 1px 3px rgba(31,58,52,0.04), 0 8px 32px rgba(31,58,52,0.05)' }}>
          {sent ? (
            <div>
              <div className='flex items-center justify-center w-12 h-12 rounded-full mb-6' style={{ backgroundColor: 'rgba(194,170,106,0.15)' }}>
                <MailCheck className='w-5 h-5' style={{ color: '#C2AA6A' }} />
              </div>
              <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
                Check your inbox
              </h1>
              <p className='mt-4 text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                If an account exists for <strong style={{ color: '#1F3A34' }}>{email}</strong>, we&apos;ve sent a link to reset your password. It expires in an hour.
              </p>
              <p className='mt-3 text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Nothing after a few minutes? Check your spam folder, or{' '}
                <button onClick={() => setSent(false)} className='font-semibold underline' style={{ color: '#1F3A34' }}>
                  try another email address
                </button>.
              </p>
            </div>
          ) : (
            <>
              <div className='mb-8'>
                <p className='text-[10px] uppercase tracking-[0.22em] font-semibold mb-2.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Forgot password
                </p>
                <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
                  Reset your password
                </h1>
                <p className='mt-3 text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Enter the email you signed up with and we&apos;ll send you a link to set a new one.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label className='block text-[10px] font-semibold uppercase tracking-[0.18em] mb-2' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Email
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='your@email.com'
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1F3A34' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#EDE4D8' }}
                  />
                </div>

                <div style={{ paddingTop: '4px' }}>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 disabled:opacity-50'
                    style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em' }}
                    onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                    {!loading && <ArrowRight className='w-4 h-4' />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
