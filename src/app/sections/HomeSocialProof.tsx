'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Star,
} from 'lucide-react'
import { teacherTestimonials } from '@/lib/teacherTestimonials'
import { studentTestimonials } from '@/lib/studentTestimonials'

type Audience = 'teachers' | 'students'

type Quote = {
  name: string
  role: string
  content: string
  rating: number
  /** Teacher quotes only — the concrete outcome the message states. */
  result?: string
}

// Mirrors the split panels below: teachers lead, students follow.
const tabs: {
  key: Audience
  label: string
  icon: typeof Sparkles
  heading: string
}[] = [
  {
    key: 'teachers',
    label: 'From teachers',
    icon: Sparkles,
    heading: 'Teachers who followed the frameworks and filled their calendars.',
  },
  {
    key: 'students',
    label: 'From students',
    icon: GraduationCap,
    heading: 'Learners speaking with more confidence, lesson by lesson.',
  },
]

const quotes: Record<Audience, Quote[]> = {
  teachers: teacherTestimonials,
  students: studentTestimonials,
}

export default function HomeSocialProof() {
  const [audience, setAudience] = useState<Audience>('teachers')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const active = tabs.find((t) => t.key === audience)!
  const list = quotes[audience]
  const itemsPerView = isMobile ? 1 : 3
  const maxSlideIndex = Math.max(0, list.length - itemsPerView)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Switching audience starts the new set from the beginning.
  useEffect(() => {
    setCurrentIndex(0)
  }, [audience])

  // A narrower viewport shows fewer cards, so the last index can go stale.
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxSlideIndex))
  }, [maxSlideIndex])

  useEffect(() => {
    if (list.length <= itemsPerView) return
    const interval = setInterval(
      () => setCurrentIndex((i) => (i >= maxSlideIndex ? 0 : i + 1)),
      6000,
    )
    return () => clearInterval(interval)
  }, [list.length, itemsPerView, maxSlideIndex])

  const goToPrevious = () =>
    setCurrentIndex((i) => (i === 0 ? maxSlideIndex : i - 1))
  const goToNext = () => setCurrentIndex((i) => (i >= maxSlideIndex ? 0 : i + 1))

  return (
    <div className='container pb-14 md:pb-20'>
      {/* Header */}
      <div className='max-w-3xl'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }} />
          <span
            className='text-xs uppercase tracking-[0.25em] font-medium'
            style={{
              color: 'rgba(31,58,52,0.6)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Real results
          </span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
            fontWeight: 700,
            color: '#1F3A34',
            lineHeight: 1.2,
          }}
        >
          {active.heading}
        </h2>
      </div>

      {/* Audience filter */}
      <div className='flex mt-6 mb-8'>
        <div
          role='tablist'
          aria-label='Filter testimonials by audience'
          className='inline-flex p-1 rounded-full'
          style={{
            backgroundColor: 'rgba(31,58,52,0.06)',
            border: '1px solid rgba(31,58,52,0.1)',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.key === audience
            return (
              <button
                key={tab.key}
                role='tab'
                aria-selected={isActive}
                onClick={() => setAudience(tab.key)}
                className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[15px] font-semibold transition-colors duration-200'
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  backgroundColor: isActive ? '#1F3A34' : 'transparent',
                  color: isActive ? '#F4EDE4' : 'rgba(31,58,52,0.6)',
                }}
              >
                <Icon
                  className='w-4 h-4'
                  style={{
                    color: isActive ? '#C2AA6A' : 'rgba(31,58,52,0.45)',
                  }}
                />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Carousel */}
      <div className='relative'>
        <div className='overflow-hidden'>
          <motion.div
            className='flex items-stretch'
            animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {list.map((t) => (
              <div
                key={`${audience}-${t.name}`}
                className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-1/3'} px-2`}
              >
                <figure
                  className='h-full flex flex-col rounded-2xl p-6 lg:p-7'
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDE4D8',
                    boxShadow: '0 2px 10px -6px rgba(31,58,52,0.15)',
                  }}
                >
                  {/* Stars */}
                  <div className='flex gap-0.5 mb-4'>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className='w-4 h-4'
                        style={{ color: '#C2AA6A' }}
                        fill='#C2AA6A'
                        strokeWidth={0}
                      />
                    ))}
                  </div>

                  {/* Outcome — only when the quote itself states one */}
                  {t.result && (
                    <span
                      className='self-start mb-3 px-3 py-1 rounded-full text-xs font-semibold'
                      style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        color: '#1F3A34',
                        backgroundColor: 'rgba(194,170,106,0.18)',
                      }}
                    >
                      {t.result}
                    </span>
                  )}

                  <blockquote
                    className='text-[15px] leading-relaxed flex-grow line-clamp-5'
                    style={{
                      color: 'rgba(31,58,52,0.75)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    &ldquo;{t.content}&rdquo;
                  </blockquote>

                  <figcaption
                    className='mt-5 pt-4 flex items-center gap-3'
                    style={{ borderTop: '1px solid #EDE4D8' }}
                  >
                    <div
                      className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0'
                      style={{ backgroundColor: '#1F3A34' }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p
                        className='text-sm font-semibold'
                        style={{
                          color: '#1F3A34',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        className='text-xs mt-0.5'
                        style={{
                          color: 'rgba(31,58,52,0.5)',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        {t.role}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Arrows */}
        {list.length > itemsPerView && (
          <>
            <button
              onClick={goToPrevious}
              className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 z-10 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-shadow duration-300'
              style={{ border: '1px solid #EDE4D8' }}
              aria-label='Previous testimonials'
            >
              <ChevronLeft className='w-5 h-5' style={{ color: '#1F3A34' }} />
            </button>
            <button
              onClick={goToNext}
              className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 z-10 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-shadow duration-300'
              style={{ border: '1px solid #EDE4D8' }}
              aria-label='Next testimonials'
            >
              <ChevronRight className='w-5 h-5' style={{ color: '#1F3A34' }} />
            </button>
          </>
        )}

        {/* Dots */}
        {maxSlideIndex > 0 && (
          <div className='flex justify-center gap-2 mt-7'>
            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className='h-1.5 rounded-full transition-all duration-300'
                style={{
                  width: currentIndex === index ? '2rem' : '0.5rem',
                  backgroundColor:
                    currentIndex === index ? '#1F3A34' : '#C2AA6A',
                  opacity: currentIndex === index ? 1 : 0.4,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
