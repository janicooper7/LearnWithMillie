'use client'

import { useState } from 'react'
import { Briefcase, MessageCircle, Users, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

const lessonOptions = [
  {
    id: 'business',
    number: '01',
    category: 'Professional',
    title: 'Business & Leadership',
    icon: <Briefcase className='w-4 h-4' />,
    description:
      'Master industry-specific vocabulary, negotiation tactics, and presentation skills tailored to your field.',
    features: ['Industry vocabulary', 'Negotiation skills', 'Presentation mastery'],
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80',
  },
  {
    id: 'conversation',
    number: '02',
    category: 'Everyday',
    title: 'Conversational Fluency',
    icon: <MessageCircle className='w-4 h-4' />,
    description:
      'Gain confidence in everyday conversations — from casual chats to expressing nuanced opinions naturally.',
    features: ['Natural pronunciation', 'Cultural context', 'Idiom mastery'],
    imageUrl:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 'interview',
    number: '03',
    category: 'Career',
    title: 'Interview Preparation',
    icon: <Users className='w-4 h-4' />,
    description:
      "Nail your next job interview with STAR method practice, common question drills, and confidence strategies.",
    features: ['STAR method', 'Common questions', 'Confidence building'],
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
  },
]

export default function LessonOptions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { data: session } = useSession()
  const ctaHref = session ? '/dashboard' : '/auth/signup'

  return (
    <section
      className='section-padding'
      id='lesson-options'
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                What I Offer
              </span>
            </div>
            <h2
              className='heading-lg'
              style={{ color: '#1F3A34' }}
            >
              Choose Your<br />Learning Path
            </h2>
          </div>
          <p
            className='text-base leading-relaxed max-w-xs md:text-right'
            style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Every lesson is built around your goals, your pace, and your life.
          </p>
        </div>

        {/* Cards */}
        <div className='grid md:grid-cols-3 gap-4 md:gap-5'>
          {lessonOptions.map((option, index) => {
            const isHovered = hoveredIndex === index

            return (
              <div
                key={option.id}
                className='relative rounded-2xl overflow-hidden'
                style={{ aspectRatio: '3/4' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                <img
                  src={option.imageUrl}
                  alt={option.title}
                  className='absolute inset-0 w-full h-full object-cover'
                  style={{
                    transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                  }}
                />

                {/* Gradient overlay — always present, deepens on hover */}
                <div
                  className='absolute inset-0'
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(31,58,52,0.97) 0%, rgba(31,58,52,0.75) 50%, rgba(31,58,52,0.2) 100%)'
                      : 'linear-gradient(to top, rgba(31,58,52,0.9) 0%, rgba(31,58,52,0.45) 55%, rgba(0,0,0,0.15) 100%)',
                    transition: 'background 0.5s ease',
                  }}
                />

                {/* Content */}
                <div className='absolute inset-0 flex flex-col justify-between p-6 md:p-7'>

                  {/* Top row: number + icon */}
                  <div className='flex items-center justify-between'>
                    <span
                      className='font-bold'
                      style={{
                        color: 'rgba(255,255,255,0.25)',
                        fontFamily: 'var(--font-playfair), Georgia, serif',
                        fontSize: '13px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {option.number}
                    </span>
                    <div
                      className='w-8 h-8 rounded-full flex items-center justify-center text-white'
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        transition: 'background-color 0.3s ease',
                        ...(isHovered ? { backgroundColor: 'rgba(194,170,106,0.3)' } : {}),
                      }}
                    >
                      {option.icon}
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div>
                    {/* Category label */}
                    <div className='flex items-center gap-2 mb-3'>
                      <div
                        className='h-3 w-0.5 rounded-full'
                        style={{ backgroundColor: '#C2AA6A' }}
                      />
                      <span
                        className='text-xs uppercase tracking-[0.2em]'
                        style={{ color: 'rgba(194,170,106,0.9)', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {option.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className='text-xl md:text-2xl font-bold text-white mb-1'
                      style={{
                        fontFamily: 'var(--font-playfair), Georgia, serif',
                        lineHeight: 1.15,
                      }}
                    >
                      {option.title}
                    </h3>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {isHovered && (
                        <motion.div
                          key='content'
                          initial={{ opacity: 0, y: 14, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 8, height: 0 }}
                          transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p
                            className='text-sm leading-relaxed mt-3 mb-4'
                            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
                          >
                            {option.description}
                          </p>

                          {/* Feature chips */}
                          <div className='flex flex-wrap gap-2 mb-5'>
                            {option.features.map((f) => (
                              <span
                                key={f}
                                className='text-xs font-medium px-3 py-1 rounded-full'
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  color: 'rgba(255,255,255,0.85)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  fontFamily: 'var(--font-inter), sans-serif',
                                }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <a
                            href={ctaHref}
                            className='inline-flex items-center gap-2 text-sm font-medium group/cta'
                            style={{ color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                          >
                            <span
                              className='pb-px'
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.4)' }}
                            >
                              {session ? 'Go to Dashboard' : 'Sign Up to Start'}
                            </span>
                            <ArrowRight
                              className='w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-1'
                            />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Thin gold line — shows when not hovered as a visual hint */}
                    {!isHovered && (
                      <div
                        className='mt-4 h-px w-8'
                        style={{ backgroundColor: 'rgba(194,170,106,0.5)' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
