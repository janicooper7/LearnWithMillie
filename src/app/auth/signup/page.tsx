'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

const termsSections = [
  {
    id: 'overview', title: 'Overview',
    content: `These Terms and Conditions govern your use of LearnWithMillie and the English tutoring services provided by Millie Cooper. By booking a lesson or creating an account, you agree to be bound by these terms. Please read them carefully before making any purchase.`,
  },
  {
    id: 'bookings', title: 'Lesson Bookings',
    items: [
      'All lessons are 50 minutes in duration and conducted online via Google Meet.',
      'Lessons must be booked through your student dashboard using available lesson credits.',
      'A booking confirmation email will be sent to you immediately after scheduling.',
      'You are responsible for ensuring your technical setup (camera, microphone, and internet connection) is working prior to each session.',
      'Millie reserves the right to reschedule a lesson in exceptional circumstances, with as much notice as possible.',
    ],
  },
  {
    id: 'cancellation', title: 'Cancellation Policy',
    items: [
      'You may cancel or reschedule a lesson up to 24 hours before the scheduled start time to receive a credit refund.',
      'Cancellations made within 24 hours of the lesson start time are non-refundable and the lesson credit will not be returned.',
      'To cancel a lesson, use the link provided in your booking confirmation email or contact Millie directly.',
      'No-shows (failing to attend without prior notice) are treated as late cancellations and are non-refundable.',
      'If Millie is unable to attend a scheduled lesson, you will receive a full credit refund regardless of notice period.',
    ],
  },
  {
    id: 'refunds', title: 'Refund Policy',
    items: [
      'Subscription payments are non-refundable once the billing period has commenced.',
      'Unused lesson credits do not carry over to the following billing period unless otherwise agreed in writing.',
      'If you cancel your subscription, you retain access to your remaining credits until the end of the current billing period.',
      'Refunds will only be considered in exceptional circumstances at Millie\'s sole discretion.',
      'Any approved refunds will be processed to the original payment method within 5–10 business days.',
    ],
  },
  {
    id: 'trial', title: 'Trial Lessons', highlight: true,
    items: [
      'Trial lessons are available to new students only and may only be purchased once per account.',
      'Trial lessons are strictly non-refundable under any circumstances once payment has been completed.',
      'Trial lessons are non-amendable — the date and time cannot be changed once the booking is confirmed.',
      'If you do not attend your trial lesson, the credit is forfeited and no refund or replacement will be issued.',
      'The trial lesson is intended as an introductory session and does not guarantee continuation of lessons.',
      'Trial lesson credits cannot be transferred to another account.',
    ],
  },
  {
    id: 'subscriptions', title: 'Subscriptions',
    items: [
      'Subscriptions are billed monthly on a recurring basis via Stripe.',
      'Your lesson credit allowance is refreshed at the start of each billing cycle.',
      'You may cancel your subscription at any time through your student dashboard. Cancellation takes effect at the end of the current billing period.',
      'Downgrading or upgrading your plan mid-cycle is not currently supported. Please cancel and re-subscribe to change plans.',
      'LearnWithMillie reserves the right to adjust pricing with 30 days\' written notice.',
    ],
  },
  {
    id: 'conduct', title: 'Student Conduct',
    items: [
      'Students are expected to be respectful and professional during all sessions.',
      'Millie reserves the right to terminate a session and cancel a student\'s account if conduct is deemed inappropriate or abusive.',
      'Lessons are for personal use only and may not be recorded, shared, or redistributed without prior written consent.',
    ],
  },
  {
    id: 'liability', title: 'Limitation of Liability',
    content: `LearnWithMillie provides tutoring services on a best-efforts basis. While every effort is made to deliver high-quality lessons, no guarantees are made regarding specific learning outcomes or exam results. To the fullest extent permitted by law, Millie Cooper shall not be liable for any indirect, incidental, or consequential damages arising from the use of this service.`,
  },
  {
    id: 'changes', title: 'Changes to These Terms',
    content: `We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our services following any changes constitutes acceptance of the revised terms.`,
  },
  {
    id: 'contact', title: 'Contact', contact: true,
  },
]

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(31,58,52,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className='relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white overflow-hidden'
        style={{ border: '1px solid #EDE4D8', boxShadow: '0 24px 80px rgba(31,58,52,0.18)' }}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-7 py-5 flex-shrink-0' style={{ borderBottom: '1px solid #EDE4D8' }}>
          <div>
            <p className='text-[10px] uppercase tracking-[0.22em] font-semibold mb-0.5' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>Legal</p>
            <h2 className='text-xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>Terms & Conditions</h2>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200'
            style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: '#1F3A34' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(31,58,52,0.12)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(31,58,52,0.06)' }}
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Scrollable content */}
        <div className='overflow-y-auto flex-1 px-7 py-6' style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          <p className='text-xs mb-6' style={{ color: 'rgba(31,58,52,0.4)' }}>Effective date: 11 April 2026</p>
          <div className='space-y-8'>
            {termsSections.map((section, i) => (
              <div key={section.id}>
                <div className='flex items-center gap-2.5 mb-3'>
                  <span className='text-xs font-semibold' style={{ color: '#C2AA6A' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className='text-base font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{section.title}</h3>
                  {'highlight' in section && section.highlight && (
                    <span className='text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full font-semibold' style={{ backgroundColor: 'rgba(194,170,106,0.15)', color: '#C2AA6A' }}>Important</span>
                  )}
                </div>

                {'highlight' in section && section.highlight && (
                  <div className='flex items-start gap-3 mb-3 p-3 rounded-xl' style={{ backgroundColor: 'rgba(194,170,106,0.08)', border: '1px solid rgba(194,170,106,0.25)' }}>
                    <div className='w-0.5 self-stretch rounded-full flex-shrink-0' style={{ backgroundColor: '#C2AA6A' }} />
                    <p className='text-xs font-semibold leading-relaxed' style={{ color: '#8a6f2e' }}>
                      Please read this section carefully. Trial lesson payments are final and non-refundable, and bookings cannot be changed once confirmed.
                    </p>
                  </div>
                )}

                {'contact' in section && section.contact ? (
                  <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)' }}>
                    If you have any questions about these Terms and Conditions, please contact Millie directly via the{' '}
                    <a href='/contact' target='_blank' style={{ color: '#1F3A34', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>contact form</a>.
                  </p>
                ) : 'content' in section && section.content ? (
                  <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)' }}>{section.content}</p>
                ) : null}

                {'items' in section && section.items && (
                  <ul className='space-y-2.5'>
                    {section.items.map((item) => (
                      <li key={item} className='flex items-start gap-3'>
                        <div className='w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5' style={{ backgroundColor: '#C2AA6A' }} />
                        <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)' }}>{item}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {i < termsSections.length - 1 && (
                  <div className='mt-6 h-px' style={{ backgroundColor: '#EDE4D8' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='px-7 py-4 flex-shrink-0' style={{ borderTop: '1px solid #EDE4D8', backgroundColor: '#FAFAF8' }}>
          <button
            onClick={onClose}
            className='w-full py-2.5 text-sm font-medium rounded-xl transition-all duration-200'
            style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 18 18'>
    <path fill='#4285F4' d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z' />
    <path fill='#34A853' d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z' />
    <path fill='#FBBC05' d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z' />
    <path fill='#EA4335' d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z' />
  </svg>
)

export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/dashboard')
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }, [status, session, router])

  const handleGoogle = () => signIn('google', { callbackUrl: '/dashboard' })

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#F4EDE4' }}>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {/* Left panel */}
      <div
        className='hidden lg:flex lg:w-[46%] flex-col justify-between p-14 relative overflow-hidden'
        style={{ backgroundColor: '#1F3A34' }}
      >
        {/* Layered decorative background */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full' style={{ border: '1px solid rgba(194,170,106,0.12)' }} />
          <div className='absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full' style={{ border: '1px solid rgba(194,170,106,0.1)' }} />
          <div className='absolute top-1/2 -translate-y-1/2 right-[-5rem] w-72 h-72 rounded-full' style={{ border: '1px solid rgba(194,170,106,0.07)' }} />
          <svg className='absolute inset-0 w-full h-full opacity-[0.04]' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='diag2' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse' patternTransform='rotate(35)'>
                <line x1='0' y1='0' x2='0' y2='40' stroke='#C2AA6A' strokeWidth='1' />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#diag2)' />
          </svg>
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

        {/* Content */}
        <div className='relative z-10 max-w-sm'>
          <div className='flex items-center gap-3 mb-10'>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
            <span className='text-[10px] uppercase tracking-[0.25em]' style={{ color: 'rgba(194,170,106,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>Get Started</span>
          </div>
          <h2 style={{
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.7rem',
            lineHeight: 1.5,
            fontWeight: 400,
          }}>
            Start your journey to confident, fluent English.
          </h2>
          <p className='mt-5 text-sm leading-relaxed' style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Join students who have transformed their English with personalised one-to-one lessons.
          </p>

          <ul className='mt-9 space-y-4'>
            {[
              'Personalised lesson plans',
              'Flexible scheduling',
              'Progress tracking',
              'Learning materials included',
            ].map((item) => (
              <li key={item} className='flex items-center gap-4'>
                <div className='w-5 h-px flex-shrink-0' style={{ backgroundColor: 'rgba(194,170,106,0.5)' }} />
                <span className='text-sm' style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
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
                Get started
              </p>
              <h1 style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
                Create your account
              </h1>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-6'
              style={{ border: '1.5px solid #EDE4D8', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', backgroundColor: '#FAFAF8' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#C2AA6A'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#EDE4D8'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FAFAF8'
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className='flex items-center gap-4 mb-6'>
              <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
              <span className='text-[11px]' style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}>or with email</span>
              <div className='flex-1 h-px' style={{ backgroundColor: '#EDE4D8' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {[
                { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Your full name' },
                { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'your@email.com' },
                { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'At least 8 characters' },
              ].map(({ label, type, value, setter, placeholder }) => (
                <div key={label}>
                  <label className='block text-[10px] font-semibold uppercase tracking-[0.18em] mb-2' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    required
                    minLength={type === 'password' ? 8 : undefined}
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
              ))}

              {/* Terms checkbox */}
              <div className='flex items-start gap-3 pt-1'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className='mt-0.5 flex-shrink-0 w-4 h-4 rounded cursor-pointer'
                  style={{ accentColor: '#1F3A34' }}
                />
                <label htmlFor='terms' className='text-xs leading-relaxed cursor-pointer' style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  I agree to the{' '}
                  <button
                    type='button'
                    onClick={() => setShowTerms(true)}
                    className='font-semibold underline underline-offset-2'
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>

              {error && (
                <p className='text-sm py-2.5 px-4 rounded-lg' style={{ color: '#c0392b', backgroundColor: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.12)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {error}
                </p>
              )}

              <div style={{ paddingTop: '8px' }}>
                <button
                  type='submit'
                  disabled={loading || !agreedToTerms}
                  className='w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 disabled:opacity-50'
                  style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em' }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#162e28' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1F3A34' }}
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                  {!loading && <ArrowRight className='w-4 h-4' />}
                </button>
              </div>
            </form>
          </div>

          <p className='text-center text-sm mt-6' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Already have an account?{' '}
            <Link href='/auth/login' className='font-semibold' style={{ color: '#1F3A34' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
