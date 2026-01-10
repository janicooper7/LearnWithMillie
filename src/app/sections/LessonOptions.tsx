'use client'

import { Briefcase, MessageCircle, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const lessonOptions = [
  {
    id: 'business',
    title: 'Business & Leadership',
    icon: <Briefcase className='w-12 h-12' />,
    description:
      "Master industry-specific vocabulary, negotiation tactics, and presentation skills. We'll analyze real-world case studies and develop your leadership communication.",
    gradient: 'bg-primary',
    bgGradient: 'bg-gray-50',
    iconBg: 'bg-primary',
    features: [
      'Industry vocabulary',
      'Negotiation skills',
      'Presentation mastery',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    altText: 'Business professionals collaborating in a modern office.',
  },
  {
    id: 'conversation',
    title: 'Conversational Fluency',
    icon: <MessageCircle className='w-12 h-12' />,
    description:
      'Gain confidence in everyday conversations, from casual chats to expressing nuanced opinions. We focus on natural pronunciation, idioms, and cultural context.',
    gradient: 'bg-primary',
    bgGradient: 'bg-gray-50',
    iconBg: 'bg-primary',
    features: ['Natural pronunciation', 'Cultural context', 'Idiom mastery'],
    imageUrl:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    altText: 'Two people having an engaging conversation in a cafe.',
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    icon: <Users className='w-12 h-12' />,
    description:
      "Nail your next job interview. We'll practice common questions, STAR method responses, and strategies to showcase your strengths effectively.",
    gradient: 'bg-primary',
    bgGradient: 'bg-gray-50',
    iconBg: 'bg-primary',
    features: ['STAR method', 'Common questions', 'Confidence building'],
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    altText: 'A group of people in a professional job interview setting.',
  },
]

export default function LessonOptions() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const motionProps = isMobile
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
      }

  const cardMotionProps = isMobile
    ? {
        initial: { opacity: 1, y: 0, scale: 1 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
      }
    : {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.7, type: 'spring', delay: 0 },
      }

  return (
    <section className='section-padding bg-white' id='lesson-options'>
      <div className='container'>
        {/* Modern Hero Header */}
        <motion.div
          {...motionProps}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <h2 className='heading-lg mb-8'>
            Choose Your{' '}
            <span className='text-gradient-primary'>Learning Path</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
            Whether you're preparing for a job interview, working on business
            communication, or looking to perfect your English skills, I'm here
            to help you reach your goals with personalized, engaging lessons.
          </p>
        </motion.div>

        {/* Modern Lesson Cards */}
        <div className='grid lg:grid-cols-3 gap-8 mb-24'>
          {lessonOptions.map((option, index) => (
            <motion.div
              key={option.id}
              {...(isMobile
                ? {
                    initial: { opacity: 1, y: 0, scale: 1 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                  }
                : {
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                    transition: {
                      duration: 0.7,
                      type: 'spring',
                      delay: index * 0.2,
                    },
                  })}
              viewport={{ once: true }}
              className='group relative'
            >
              {/* Card Container */}
              <div
                className={`relative ${option.bgGradient} rounded-3xl p-8 h-full border border-gray-100/50 overflow-hidden flex flex-col`}
              >
                {/* Floating Icon */}
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 ${option.iconBg} rounded-2xl flex items-center justify-center text-white shadow-xl transform rotate-12`}
                >
                  {option.icon}
                </div>

                {/* Card Header */}
                <div className='relative z-10 mb-8'>
                  <div
                    className={`inline-block px-4 py-2 ${option.gradient} rounded-full mb-4`}
                  >
                    <span className='text-white font-semibold text-sm'>
                      Featured
                    </span>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    {option.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {option.description}
                  </p>
                </div>

                {/* Image Section */}
                <div className='relative mb-8 overflow-hidden rounded-2xl'>
                  <img
                    src={option.imageUrl}
                    alt={option.altText}
                    className='w-full h-48 object-cover'
                  />
                </div>

                {/* Features List */}
                <div className='relative z-10 mb-8'>
                  <h4 className='font-semibold text-gray-900 mb-4'>
                    What You'll Learn:
                  </h4>
                  <ul className='space-y-3'>
                    {option.features.map((feature, idx) => (
                      <motion.li
                        key={feature}
                        {...(isMobile
                          ? {
                              initial: { opacity: 1, x: 0 },
                              whileInView: { opacity: 1, x: 0 },
                            }
                          : {
                              initial: { opacity: 0, x: -20 },
                              whileInView: { opacity: 1, x: 0 },
                              transition: {
                                delay: 0.1 * idx + index * 0.1,
                              },
                            })}
                        viewport={{ once: true }}
                        className='flex items-center gap-3'
                      >
                        <div
                          className={`w-2 h-2 ${option.iconBg} rounded-full`}
                        ></div>
                        <span className='text-gray-700 font-medium'>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className='relative z-10 mt-auto'>
                  <a
                    href='#contact'
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 ${option.gradient} text-white font-bold rounded-2xl shadow-glow-lg hover:shadow-glow-lg hover:scale-105 transform transition-all duration-300`}
                  >
                    Start Learning
                    <ArrowRight className='w-5 h-5' />
                  </a>
                </div>

                {/* Decorative Elements */}
                <div className='absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 -translate-y-12'></div>
                <div className='absolute bottom-0 right-0 w-16 h-16 bg-primary/5 rounded-full translate-x-8 translate-y-8'></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
