'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'

// Only allow same-origin, relative paths so `?next=` can't be an open redirect.
function safeNext(next: string | null): string | null {
  if (!next) return null
  if (!next.startsWith('/') || next.startsWith('//')) return null
  return next
}

const GoogleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 18 18'>
    <path fill='#4285F4' d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z' />
    <path fill='#34A853' d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z' />
    <path fill='#FBBC05' d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z' />
    <path fill='#EA4335' d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z' />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = safeNext(searchParams.get('next'))
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', { email, password, redirect: false })

    if (res?.error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    const session = await fetch('/api/auth/session').then((r) => r.json())
    router.push(nextPath ?? (session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard'))
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(nextPath ?? (session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard'))
    }
  }, [status, session, router, nextPath])

  const handleGoogle = () => {
    setGoogleLoading(true)
    signIn('google', { callbackUrl: nextPath ?? '/dashboard' })
  }

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#F4EDE4' }}>

      {/* Left panel */}
      <div
        className='hidden lg:flex lg:w-[46%] flex-col justify-between p-14 relative overflow-hidden'
        style={{ backgroundColor: '#1F3A34' }}
      >
        {/* Layered decorative background */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Large circle top-left */}
          <div className='absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full' style={{ border: '1px solid rgba(194,170,106,0.12)' }} />
          {/* Large circle bottom-right */}
          <div className='absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full' style={{ border: '1px solid rgba(194,170,106,0.1)' }} />
          {/* Medium circle middle-right */}
          <div className='absolute top-1/2 -translate-y-1/2 right-[-5rem] w-72 h-72 rounded-full' style={{ border: '1px solid rgba(194,170,106,0.07)' }} />
          {/* Diagonal ruled lines (editorial feel) */}
          <svg className='absolute inset-0 w-full h-full opacity-[0.04]' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='diag' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse' patternTransform='rotate(35)'>
                <line x1='0' y1='0' x2='0' y2='40' stroke='#C2AA6A' strokeWidth='1' />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#diag)' />
          </svg>
          {/* Gold dot accent */}
          <div className='absolute top-1/3 right-12 w-1.5 h-1.5 rounded-full' style={{ backgroundColor: '#C2AA6A', opacity: 0.5 }} />
          <div className='absolute bottom-1/3 left-20 w-1 h-1 rounded-full' style={{ backgroundColor: '#C2AA6A', opacity: 0.35 }} />
        </div>

        {/* Back to site */}
        <Link
          href='/'
          className='relative z-10 text-[11px] uppercase tracking-[0.18em] font-medium flex items-center gap-2 w-fit transition-opacity duration-200 hover:opacity-100'
          style={{ color: 'rgba(194,170,106,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          <span style={{ fontSize: '0.6rem' }}>←</span>
          Back to site
        </Link>

        {/* Quote */}
        <div className='relative z-10 max-w-sm'>
          <div className='flex items-center gap-3 mb-10'>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
            <span className='text-[10px] uppercase tracking-[0.25em]' style={{ color: 'rgba(194,170,106,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>Student Portal</span>
          </div>
          <blockquote
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.7rem',
              lineHeight: 1.5,
              fontWeight: 400,
              fontStyle: 'italic',
            }}
          >
            "Every lesson is a step closer to the version of yourself you want to become."
          </blockquote>
          <div className='mt-7 flex items-center gap-3'>
            <div className='w-6 h-px' style={{ backgroundColor: 'rgba(194,170,106,0.5)' }} />
            <p className='text-[13px]' style={{ color: 'rgba(194,170,106,0.75)', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.04em' }}>
              Millie Cooper, English Tutor
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className='relative z-10'>
          <div className='h-px w-full mb-7' style={{ backgroundColor: 'rgba(194,170,106,0.12)' }} />
          <div className='flex items-center gap-8'>
            {[['50+', 'Students'], ['2019', 'Est.'], ['5★', 'Rated']].map(([val, label]) => (
              <div key={label}>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.1rem', fontWeight: 600 }}>{val}</p>
                <p className='text-[10px] uppercase tracking-[0.12em] mt-0.5' style={{ color: 'rgba(194,170,106,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex flex-col justify-center items-center px-6 py-16' style={{ backgroundColor: '#F4EDE4' }}>

        {/* Mobile: back link */}
        <div className='lg:hidden w-full max-w-[420px] mb-8'>
          <Link href='/' className='text-[11px] uppercase tracking-[0.18em] font-medium' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
            ← Back to site
          </Link>
        </div>

        <div className='w-full max-w-[420px]'>

          {/* Form card */}
          <div className='bg-white rounded-2xl p-8 md:p-10' style={{ border: '1px solid #EDE4D8', boxShadow: '0 1px 3px rgba(31,58,52,0.04), 0 8px 32px rgba(31,58,52,0.05)' }}>

            {/* Heading */}
            <div className='mb-8'>
              <p className='text-[10px] uppercase tracking-[0.22em] font-semibold mb-2.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                Welcome back
              </p>
              <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
                Sign in to your account
              </h1>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-6 disabled:cursor-not-allowed'
              style={{ border: '1.5px solid #EDE4D8', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', backgroundColor: '#FAFAF8' }}
              onMouseEnter={(e) => {
                if (googleLoading) return
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#C2AA6A'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#EDE4D8'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FAFAF8'
              }}
            >
              {googleLoading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Connecting to Google…
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className='flex items-center gap-4 mb-6'>
              <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
              <span className='text-[11px]' style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}>or with email</span>
              <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
            </div>

            {/* Form */}
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
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #EDE4D8', fontSize: '14px', color: '#1F3A34',
                    outline: 'none', backgroundColor: 'white', fontFamily: 'var(--font-inter), sans-serif',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#1F3A34' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#EDE4D8' }}
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-[10px] font-semibold uppercase tracking-[0.18em]' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Password
                  </label>
                  <Link href='/auth/forgot-password' className='text-[11px] font-medium' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #EDE4D8', fontSize: '14px', color: '#1F3A34',
                    outline: 'none', backgroundColor: 'white', fontFamily: 'var(--font-inter), sans-serif',
                    transition: 'border-color 0.2s',
                  }}
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
                  {loading ? 'Signing in…' : 'Sign In'}
                  {!loading && <ArrowRight className='w-4 h-4' />}
                </button>
              </div>
            </form>
          </div>

          <p className='text-center text-sm mt-6' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Don&apos;t have an account?{' '}
            <Link href={nextPath ? `/auth/signup?next=${encodeURIComponent(nextPath)}` : '/auth/signup'} className='font-semibold' style={{ color: '#1F3A34' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
