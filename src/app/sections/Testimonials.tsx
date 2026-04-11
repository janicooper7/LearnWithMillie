'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sophie',
    role: 'France',
    content:
      'Militsa is a wonderful and brilliant woman. It\'s always a pleasure to talk with her. Time flies, her lessons are well-prepared and tailored to my level. I can already feel that my level has improved. Every exchange is enriching. Our lessons start with a discussion, followed by vocabulary work. After each session, she sends me the words we covered together. I can only highly recommend her.',
    rating: 5,
  },
  {
    name: 'Verena',
    role: 'Germany',
    content:
      'Millie is a great teacher! The lessons are very well prepared, and each lesson covers a different topic. There is a lot of discussion, so the individual speaking time is very high. Millie is super friendly and empathetic! Absolute recommendation 😊',
    rating: 5,
  },
  {
    name: 'Johanna',
    role: 'Austria',
    content:
      'Millie is an extraordinary teacher who stands out for her professionalism, empathy, patience, and also humor. Due to her friendly, motivating, and incredibly competent manner, learning is fun and does not focus on deficits. Her lessons are designed in such a way that you not only practice conversation with targeted phrases but also discuss current topics. I look forward to every lesson and my further learning journeys with her!',
    rating: 5,
  },
  {
    name: 'Emanuela',
    role: 'Italy',
    content:
      'Militsa is an excellent tutor, highly knowledgeable and passionate about her work. She offers lessons on current topics, making discussions enjoyable due to her deep understanding of current affairs. With remarkable patience, she guides her students through complex subjects with ease. I wholeheartedly recommend her to anyone seeking an enriching English learning experience.',
    rating: 5,
  },
  {
    name: 'Patrycja',
    role: 'Poland',
    content:
      'Millie is a fantastic teacher. Always cheerful, she puts you at ease right away, seeks to understand all possible areas of improvement, and never makes the lesson boring. I\'m truly satisfied and happy with the journey I have undertaken with her. Highly recommend her as well!',
    rating: 5,
  },
  {
    name: 'Lubica',
    role: 'Slovakia',
    content:
      'I have found the ideal conversation teacher in Millie. She brings interesting topics to each lesson and makes every session enjoyable. It feels like a natural conversation with her, as she encourages me to speak as much as possible. Her practice of sending actual vocabulary with explanations after each session greatly enhances my learning experience. I highly recommend her!',
    rating: 5,
  },
  {
    name: 'Dmytro',
    role: 'Ukraine',
    content:
      'Millie is a true gem. She is not just a tutor but a wonderful human being who makes learning enjoyable. Her kindness, confidence, and communication skills will make a significant difference in your English language journey. I\'m grateful for her lesson and would highly recommend her to anyone seeking to improve their English skills. Thank you for being such an inspiring tutor!',
    rating: 5,
  },
  {
    name: '학배',
    role: 'South Korea',
    content:
      'Militsa is very hard-working, well-prepared, encouraged, well-organized and customer-oriented. I had the great time with her for my English improvement. Thank you so much !!!',
    rating: 5,
  },
  {
    name: 'Xintong',
    role: 'China',
    content:
      'Militsa is an amazing tutor. She has very clear accent and she\'s always very patient and nice. Also, she is good at choosing the course content, and the lessons are very interesting and useful. She really helps me to improve a lot. I would highly recommend to choose her as your English tutor, and I\'ll keep learning with her.',
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
            </motion.div>
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
