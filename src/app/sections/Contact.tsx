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
    lessonType: '',
    plan: '',
    message: '',
  })

  useEffect(() => {
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Set element to final state immediately on mobile
      if (formRef.current) {
        gsap.set(formRef.current, { y: 0, opacity: 1 })
      }
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      formRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
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
      console.log('Submitting form data:', { ...formData, email: '[REDACTED]' })

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to submit form')
      }

      // Track successful form submission
      trackEvent('form_submission', {
        event_category: 'Contact',
        event_label: 'Contact Form',
        lesson_type: formData.lessonType,
        plan: formData.plan,
      })

      console.log('Form submitted successfully:', data)
      router.push('/thank-you')
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Sorry, there was an error sending your message. Please try again.'
      )

      // Track form submission error
      trackEvent('form_error', {
        event_category: 'Contact',
        event_label: 'Contact Form Error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })

      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section ref={sectionRef} className='py-20 bg-white' id='contact'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='heading-lg mb-6'>Start Your Journey Now!</h2>
          <p className='text-gray-600 text-lg'>
            Ready to improve your English? Fill out the form below and I&apos;ll
            get back to you as soon as possible to find the best day and time.
          </p>
        </div>

        <div ref={formRef} className='max-w-2xl mx-auto'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='fullName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Full Name
                </label>
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent'
                  placeholder='Enter your full name'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent'
                  required
                  placeholder='Enter your email address'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='lessonType'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Lesson Type
              </label>
              <select
                id='lessonType'
                name='lessonType'
                value={formData.lessonType}
                onChange={handleInputChange}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 ocus:border-transparent'
                required
              >
                <option value=''>Select a lesson type</option>
                <option value='business'>Business English</option>
                <option value='conversational'>Conversational</option>
                <option value='interview'>Interview Preparation</option>
              </select>
            </div>

            <div>
              <label
                htmlFor='plan'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Choose Your Plan
              </label>
              <select
                id='plan'
                name='plan'
                value={formData.plan}
                onChange={handleInputChange}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 ocus:border-transparent'
                required
              >
                <option value=''>Select a plan</option>
                <option value='trial'>New Student - FREE Trial Lesson (15 mins)</option>
                <option value='standard'>
                  Standard - 4 lessons - £136/month
                </option>
                <option value='advanced'>
                  Advanced - 8 lessons - £256/month
                </option>
                <option value='pro'>Pro - 12 lessons - £360/month</option>
              </select>
            </div>

            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Additional Comments
              </label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent'
                placeholder='Enter your additional comments'
              ></textarea>
            </div>

            <div className='space-y-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn-primary shadow-glow-lg hover:shadow-glow-lg text-xl px-4 py-4 rounded-2xl w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isSubmitting ? 'Sending...' : 'Submit Your Enquiry'}
                {!isSubmitting && <ArrowRight className='w-5 h-5' />}
              </button>
              {submitStatus === 'error' && (
                <div className='text-red-600 text-center space-y-1'>
                  <p>{errorMessage}</p>
                  <p className='text-sm'>
                    If the problem persists, please try again later or contact
                    us directly.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
