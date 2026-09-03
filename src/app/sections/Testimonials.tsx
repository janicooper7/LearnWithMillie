'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { studentTestimonials as testimonials } from '@/lib/studentTestimonials'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const itemsPerView = isMobile ? 1 : 3

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - itemsPerView : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev >= testimonials.length - itemsPerView ? 0 : prev + 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (testimonials.length <= itemsPerView) return
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, itemsPerView])

  const maxSlideIndex = Math.max(0, testimonials.length - itemsPerView)

  return (
    <section className='section-padding bg-white' id='testimonials'>
      <div className='container'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }}></div>
            <span
              className='text-xs uppercase tracking-[0.25em] font-medium'
              style={{ color: '#1F3A34', opacity: 0.6 }}
            >
              Student Stories
            </span>
            <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }}></div>
          </div>
          <h2 className='heading-lg mb-4' style={{ color: '#1F3A34' }}>
            What My Students Say
          </h2>
          <p className='text-base leading-relaxed' style={{ color: '#1F3A34', opacity: 0.65 }}>
            Hear from students who have transformed their English skills and
            confidence through personalized lessons.
          </p>
        </div>

        <div className='relative'>
          {/* Carousel */}
          <div className='relative overflow-hidden'>
            {/* A CSS transform transition, not an animation library — this
                slide was the only thing Framer Motion was doing here. */}
            <div
              className='flex'
              style={{
                transform: `translateX(-${
                  isMobile ? currentIndex * 100 : currentIndex * (100 / itemsPerView)
                }%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-1/3'} px-3`}
                >
                  <div
                    className='rounded-xl p-7 h-full flex flex-col border'
                    style={{
                      backgroundColor: '#F4EDE4',
                      borderColor: '#EDE4D8',
                    }}
                  >
                    {/* Stars */}
                    <div className='flex gap-0.5 mb-5'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className='h-4 w-4' style={{ color: '#C2AA6A' }} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p
                      className='text-base leading-relaxed flex-grow mb-6'
                      style={{ color: '#1F3A34', opacity: 0.75 }}
                    >
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div
                      className='pt-5 border-t flex items-center gap-3'
                      style={{ borderColor: '#EDE4D8' }}
                    >
                      <div
                        className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'
                        style={{ backgroundColor: '#1F3A34' }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p
                          className='font-semibold text-sm'
                          style={{ color: '#1F3A34' }}
                        >
                          {testimonial.name}
                        </p>
                        <p className='text-xs mt-0.5' style={{ color: '#1F3A34', opacity: 0.5 }}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={goToPrevious}
                className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-10 z-10 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border group'
                style={{ borderColor: '#EDE4D8' }}
                aria-label='Previous testimonial'
              >
                <ChevronLeftIcon className='w-5 h-5' style={{ color: '#1F3A34' }} />
              </button>
              <button
                onClick={goToNext}
                className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-10 z-10 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-300 border group'
                style={{ borderColor: '#EDE4D8' }}
                aria-label='Next testimonial'
              >
                <ChevronRightIcon className='w-5 h-5' style={{ color: '#1F3A34' }} />
              </button>
            </>
          )}

          {/* Dots */}
          <div className='flex justify-center gap-2 mt-10'>
            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className='h-1.5 rounded-full transition-all duration-300'
                style={{
                  width: currentIndex === index ? '2rem' : '0.5rem',
                  backgroundColor: currentIndex === index ? '#1F3A34' : '#C2AA6A',
                  opacity: currentIndex === index ? 1 : 0.4,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
