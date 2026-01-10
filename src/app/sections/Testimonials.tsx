'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Blanche Pearson',
    role: 'Marketing Manager',
    content:
      "Millie's teaching approach is exceptional. She helped me improve my business English significantly, which has been invaluable in my career.",
    rating: 5,
  },
  {
    name: 'Jonas Brauers',
    role: 'Software Developer',
    content:
      'The personalized attention and focus on technical vocabulary has made a huge difference in my ability to communicate with international colleagues.',
    rating: 5,
  },
  {
    name: 'Kristina Zasiadko',
    role: 'HR Professional',
    content:
      "Thanks to Millie's interview preparation sessions, I successfully landed my dream job at an international company.",
    rating: 5,
  },
  {
    name: 'Maria Santos',
    role: 'Project Manager',
    content:
      'I was nervous about speaking English in meetings, but Millie created a safe and supportive environment. My confidence has grown tremendously, and I now actively participate in all team discussions.',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    role: 'Data Analyst',
    content:
      "Millie's conversational English lessons are fantastic. She uses real-world scenarios that I encounter at work, making every lesson practical and immediately applicable.",
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    role: 'Sales Executive',
    content:
      'The business English course exceeded my expectations. Millie helped me master presentation skills and negotiation language that directly contributed to closing major deals.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Product Designer',
    content:
      "As a non-native speaker, I struggled with expressing complex ideas. Millie's patient teaching style and tailored approach helped me articulate my thoughts clearly and professionally.",
    rating: 5,
  },
  {
    name: 'Elena Petrov',
    role: 'Financial Analyst',
    content:
      "Millie's lessons are always well-prepared and engaging. She adapts to my learning pace and focuses on areas where I need the most improvement. Highly recommend!",
    rating: 5,
  },
]

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

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length <= itemsPerView) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, itemsPerView])

  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % testimonials.length
      visible.push({ ...testimonials[index], originalIndex: index })
    }
    return visible
  }

  const visibleTestimonials = getVisibleTestimonials()
  const maxSlideIndex = Math.max(0, testimonials.length - itemsPerView)

  return (
    <section className='section-padding bg-white' id='testimonials'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='heading-lg mb-6'>Student Testimonials</h2>
          <p className='text-gray-600 text-lg'>
            Hear what my students have to say about their learning experience
            and achievements.
          </p>
        </div>

        <div className='relative'>
          {/* Carousel Container */}
          <div className='relative overflow-hidden'>
            <motion.div
              className='flex'
              animate={{
                x: isMobile
                  ? `-${currentIndex * 100}%`
                  : `-${currentIndex * (100 / itemsPerView)}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className={`flex-shrink-0 ${
                    isMobile ? 'w-full' : 'w-1/3'
                  } px-4`}
                >
                  <div className='bg-gray-50 rounded-2xl p-8 transition-all duration-300 h-full border border-gray-100 flex flex-col'>
                    <div className='flex mb-4'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className='h-5 w-5 text-yellow-400' />
                      ))}
                    </div>
                    <p className='text-gray-700 mb-6 text-lg leading-relaxed flex-grow'>
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className='pt-4 border-t border-gray-200 mt-auto'>
                      <p className='font-bold text-gray-900 text-lg'>
                        {testimonial.name}
                      </p>
                      <p className='text-gray-500 text-sm mt-1'>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={goToPrevious}
                className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group'
                aria-label='Previous testimonial'
              >
                <ChevronLeftIcon className='w-6 h-6 text-gray-700 group-hover:text-primary transition-colors' />
              </button>
              <button
                onClick={goToNext}
                className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group'
                aria-label='Next testimonial'
              >
                <ChevronRightIcon className='w-6 h-6 text-gray-700 group-hover:text-primary transition-colors' />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          <div className='flex justify-center gap-2 mt-12'>
            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
