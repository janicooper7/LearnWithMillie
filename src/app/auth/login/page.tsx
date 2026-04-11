'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    router.push(session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard')
  }

  const handleGoogle = () => signIn('google', { callbackUrl: '/dashboard' })

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#F4EDE4' }}>

      {/* Left panel */}
      <div
        className='hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden'
        style={{ backgroundColor: '#1F3A34' }}
      >
        {/* Decorative circles */}
        <div className='absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10' style={{ border: '1px solid #C2AA6A' }} />
        <div className='absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full opacity-10' style={{ border: '1px solid #C2AA6A' }} />
        <div className='absolute top-1/2 -translate-y-1/2 -right-16 w-64 h-64 rounded-full opacity-5' style={{ border: '1px solid #C2AA6A' }} />

        {/* Top: back to home */}
        <Link href='/' className='relative z-10 text-xs uppercase tracking-[0.15em] font-medium' style={{ color: 'rgba(194,170,106,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
          ← Back to site
        </Link>

        {/* Middle: quote */}
        <div className='relative z-10'>
          <div className='w-10 h-px mb-8' style={{ backgroundColor: '#C2AA6A' }} />
          <blockquote
            style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.65rem', lineHeight: 1.45, fontWeight: 400 }}
          >
            "Every lesson is a step closer to the version of yourself you want to become."
          </blockquote>
          <p className='mt-6 text-sm' style={{ color: 'rgba(194,170,106,0.8)', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.05em' }}>
            — Millie Cooper, English Tutor
          </p>
        </div>

        {/* Bottom: trust indicators */}
        <div className='relative z-10 flex items-center gap-6'>
          {['50+ Students', 'Since 2019', '5★ Rated'].map((item) => (
            <div key={item}>
              <p className='text-xs' style={{ color: 'rgba(194,170,106,0.7)', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex flex-col justify-center items-center px-6 py-12'>


        <div className='w-full max-w-[400px]'>

          {/* Heading */}
          <div className='mb-8'>
            <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-2' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Welcome back
            </p>
            <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
              Sign in to your account
            </h1>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-6'
            style={{ border: '1.5px solid #EDE4D8', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', backgroundColor: 'white' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C2AA6A' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#EDE4D8' }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className='flex items-center gap-4 mb-6'>
            <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
            <span className='text-xs' style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}>or continue with email</span>
            <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-[11px] font-semibold uppercase tracking-[0.15em] mb-2' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
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
              <label className='block text-[11px] font-semibold uppercase tracking-[0.15em] mb-2' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Password
              </label>
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
          </form>

          <p className='text-center text-sm mt-7' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Don&apos;t have an account?{' '}
            <Link href='/auth/signup' className='font-semibold' style={{ color: '#1F3A34' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
