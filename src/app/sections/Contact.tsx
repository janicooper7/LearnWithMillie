'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

const trackEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

const inputClass =
  'w-full px-4 py-3 rounded-lg border bg-white text-sm transition-all duration-200 outline-none focus:ring-2'
const inputStyle = {
  borderColor: '#EDE4D8',
  color: '#1F3A34',
}

export default function Contact() {
  const router = useRouter()
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  })

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      if (formRef.current) gsap.set(formRef.current, { y: 0, opacity: 1 })
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      formRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top bottom-=100',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to submit form')
      }

      trackEvent('form_submission', {
        event_category: 'Contact',
        event_label: 'Contact Form',
      })

      router.push('/thank-you?from=contact')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Sorry, there was an error sending your message. Please try again.'
      )

      trackEvent('form_error', {
        event_category: 'Contact',
        event_label: 'Contact Form Error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })

      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section ref={sectionRef} className='section-padding' id='contact' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>

        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='heading-lg mb-3' style={{ color: '#1F3A34' }}>
            Get in touch
          </h2>
          <p className='text-base' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Have a question or ready to start? I&apos;d love to hear from you.
          </p>
        </div>

        {/* Two-column layout */}
        <div ref={formRef} className='max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-5'>

          {/* Left — info panel */}
          <div
            className='bg-white rounded-2xl p-8 flex flex-col gap-8'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <div>
              <h3
                className='text-lg font-bold mb-6'
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Contact Information
              </h3>

              <div className='space-y-6'>
                <div>
                  <p
                    className='text-[11px] uppercase tracking-[0.18em] font-semibold mb-1.5'
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Response Time
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    I typically respond within 24 hours
                  </p>
                </div>

                <div>
                  <p
                    className='text-[11px] uppercase tracking-[0.18em] font-semibold mb-1.5'
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Lesson Hours
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Monday – Saturday<br />
                    9:00 AM – 8:00 PM GMT
                  </p>
                </div>

                <div>
                  <p
                    className='text-[11px] uppercase tracking-[0.18em] font-semibold mb-1.5'
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Free Trial
                  </p>
                  <p className='text-sm leading-relaxed' style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    New students get a free 15-minute trial — no commitment required
                  </p>
                </div>
              </div>
            </div>

            {/* Gold accent line at bottom */}
            <div className='mt-auto pt-6' style={{ borderTop: '1px solid #EDE4D8' }}>
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: '#C2AA6A' }} />
                <span className='text-xs' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  TEFL Certified · London Based
                </span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div
            className='bg-white rounded-2xl p-8 md:p-10'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label
                  htmlFor='fullName'
                  className='block text-[11px] font-semibold uppercase tracking-[0.18em] mb-2'
                  style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Your Name
                </label>
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder='Your full name'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-[11px] font-semibold uppercase tracking-[0.18em] mb-2'
                  style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  style={inputStyle}
                  required
                  placeholder='your@email.com'
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-[11px] font-semibold uppercase tracking-[0.18em] mb-2'
                  style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClass}
                  style={inputStyle}
                  placeholder='Anything you would like me to know...'
                />
              </div>

              <div className='pt-1'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <ArrowRight className='w-4 h-4' />}
                </button>

                {submitStatus === 'error' && (
                  <div
                    className='mt-3 text-sm text-center p-3 rounded-lg border'
                    style={{ color: '#c0392b', backgroundColor: 'rgba(192,57,43,0.06)', borderColor: 'rgba(192,57,43,0.15)' }}
                  >
                    <p>{errorMessage}</p>
                    <p className='text-xs opacity-70 mt-1'>If the problem persists, please try again later.</p>
                  </div>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
