'use client'

import {
  CheckCircle,
  X,
  Briefcase,
  MessageCircle,
  Users,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react'
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

const comparisonData = [
  { text: 'High commission fees', icon: '💰' },
  { text: 'Rigid policies', icon: '🔒' },
  { text: 'Strict lesson requirements', icon: '📚' },
  { text: 'Curriculum restrictions', icon: '🚫' },
]

const withMeOptions = [
  { text: 'No hidden commission fees', icon: '✨' },
  { text: 'Schedule flexibility', icon: '⏰' },
  { text: 'Personalised teaching', icon: '🎯' },
  { text: 'Flexible policies', icon: '🔄' },
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
    <section
      className='section-padding bg-white'
      id='lesson-options'
    >
      <div className='container'>
        {/* Modern Hero Header */}
        <motion.div
          {...motionProps}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <span className='inline-block px-6 py-3 bg-primary/10 text-primary font-bold rounded-full text-sm mb-6'>
            💼 Lesson Programs
          </span>
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
                className={`relative ${option.bgGradient} rounded-3xl p-8 h-full border border-gray-100/50 hover:border-gray-200 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden`}
              >
                {/* Floating Icon */}
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 ${option.iconBg} rounded-2xl flex items-center justify-center text-white shadow-xl transform rotate-12 group-hover:rotate-6 transition-all duration-300`}
                >
                  {option.icon}
                </div>

                {/* Card Header */}
                <div className='relative z-10 mb-8'>
                  <div
                    className={`inline-block px-4 py-2 ${option.gradient} rounded-full mb-4`}
                  >
                    <span className='text-white font-semibold text-sm'>
                      ✨ Featured
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
                <div className='relative mb-8 overflow-hidden rounded-2xl group-hover:shadow-xl transition-all duration-300'>
                  <img
                    src={option.imageUrl}
                    alt={option.altText}
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
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
                <div className='relative z-10'>
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 ${option.gradient} text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transform transition-all duration-300`}
                  >
                    Start Learning
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className='absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 -translate-y-12'></div>
                <div className='absolute bottom-0 right-0 w-16 h-16 bg-primary/5 rounded-full translate-x-8 translate-y-8'></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className='text-center mb-16'>
          <span className='inline-block px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-full text-sm mb-6'>
            💎 Why Choose Personalized Lessons?
          </span>
          <h3 className='heading-md mb-6'>
            Platform Learning vs Direct Learning
          </h3>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            See how personalized tutoring transforms your English learning
            experience compared to generic online platforms.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className='grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* Generic Platforms */}
          <motion.div
            {...(isMobile
              ? {
                  initial: { opacity: 1, x: 0 },
                  whileInView: { opacity: 1, x: 0 },
                }
              : {
                  initial: { opacity: 0, x: -50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8, type: 'spring' },
                })}
            viewport={{ once: true }}
            className='card p-10 relative overflow-hidden'
          >
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                  <X className='w-6 h-6 text-red-600' />
                </div>
                <h4 className='text-xl font-bold text-gray-900'>
                  Platform Limitations
                </h4>
              </div>

              <ul className='space-y-4'>
                {comparisonData.map((item, idx) => (
                  <motion.li
                    key={item.text}
                    {...(isMobile
                      ? {
                          initial: { opacity: 1, x: 0 },
                          whileInView: { opacity: 1, x: 0 },
                        }
                      : {
                          initial: { opacity: 0, x: -30 },
                          whileInView: { opacity: 1, x: 0 },
                          transition: { delay: 0.1 * idx },
                        })}
                    viewport={{ once: true }}
                    className='flex items-start gap-4 p-4 bg-red-50 rounded-xl'
                  >
                    <span className='text-2xl'>{item.icon}</span>
                    <div>
                      <span className='text-red-700 font-medium'>
                        {item.text}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Personal Lessons */}
          <motion.div
            {...(isMobile
              ? {
                  initial: { opacity: 1, x: 0 },
                  whileInView: { opacity: 1, x: 0 },
                }
              : {
                  initial: { opacity: 0, x: 50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8, type: 'spring', delay: 0.2 },
                })}
            viewport={{ once: true }}
            className='card-featured p-10 relative overflow-hidden'
          >
            <div className='space-y-6'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white'>
                  <Star className='w-6 h-6' />
                </div>
                <h4 className='text-xl font-bold text-gray-900'>
                  Premium Experience
                </h4>
              </div>

              <ul className='space-y-4'>
                {withMeOptions.map((item, idx) => (
                  <motion.li
                    key={item.text}
                    {...(isMobile
                      ? {
                          initial: { opacity: 1, x: 0 },
                          whileInView: { opacity: 1, x: 0 },
                        }
                      : {
                          initial: { opacity: 0, x: 30 },
                          whileInView: { opacity: 1, x: 0 },
                          transition: { delay: 0.1 * idx + 0.2 },
                        })}
                    viewport={{ once: true }}
                    className='flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100'
                  >
                    <span className='text-2xl'>{item.icon}</span>
                    <div>
                      <span className='text-green-700 font-medium'>
                        {item.text}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Success Metrics */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-primary'>100%</div>
                  <div className='text-sm text-gray-600'>Success Rate</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-primary'>3+</div>
                  <div className='text-sm text-gray-600'>Years Experience</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
