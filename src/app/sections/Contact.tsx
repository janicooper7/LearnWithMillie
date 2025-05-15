'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
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

  return (
    <section ref={sectionRef} className='py-20 bg-white' id='contact'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='heading-lg mb-6'>Start Your Journey Now!</h2>
          <p className='text-gray-600 text-lg'>
            Ready to improve your English? Fill out the form below and I&apos;ll
            get back to you as soon as possible.
          </p>
        </div>

        <div ref={formRef} className='max-w-2xl mx-auto'>
          <form className='space-y-6'>
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
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-custom-pink focus:border-transparent'
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
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-custom-pink focus:border-transparent'
                  required
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
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-custom-pink focus:border-transparent'
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
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-custom-pink focus:border-transparent'
                required
              >
                <option value=''>Select a plan</option>
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
                rows={4}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-custom-pink focus:border-transparent'
              ></textarea>
            </div>

            <div>
              <button
                type='submit'
                className='w-full bg-custom-pink text-white py-4 px-8 rounded-full font-semibold hover:bg-opacity-90 transition-colors'
              >
                Submit Your Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
