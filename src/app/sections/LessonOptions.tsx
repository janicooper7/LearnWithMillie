'use client'

import {
  CheckCircle,
  X,
  Briefcase,
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'

const lessonOptions = [
  {
    title: 'Business & Leadership',
    icon: <Briefcase className='w-8 h-8 text-pink-500' />,
    description:
      "Master industry-specific vocabulary, negotiation tactics, and presentation skills. We'll analyze real-world case studies and develop your leadership communication.",
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-pink-100',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    altText: 'Business professionals collaborating in a modern office.',
  },
  {
    title: 'Conversational Fluency',
    icon: <MessageSquare className='w-8 h-8 text-pink-500' />,
    description:
      'Gain confidence in everyday conversations, from casual chats to expressing nuanced opinions. We focus on natural pronunciation, idioms, and cultural context.',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-pink-100',
    imageUrl:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    altText: 'Two people having an engaging conversation in a cafe.',
  },
  {
    title: 'Interview Preparation',
    icon: <Users className='w-8 h-8 text-pink-500' />,
    description:
      "Nail your next job interview. We'll practice common questions, STAR method responses, and strategies to showcase your strengths effectively.",
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-pink-100',
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    altText: 'A group of people in a professional job interview setting.',
  },
]

const comparisonData = [
  'High commission fees',
  'Rigid policies',
  'Strict lesson requirements',
  'Curriculum restrictions',
]

const withMeOptions = [
  'No hidden commission fees',
  'Schedule flexibility',
  'Personalised teaching',
  'Flexible policies',
]

export default function LessonOptions() {
  return (
    <section className='py-20 bg-white' id='lesson-options'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight'>
            Lesson <span className='text-custom-pink'>Options</span>
          </h2>
          <p className='text-gray-600 text-lg max-w-4xl mx-auto'>
            Whether you're preparing for a job interview, working on business
            communication, or looking to perfect your English skills, I'm here
            to help you reach your goals!
          </p>
        </div>

        {/* Topic Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-20'>
          {lessonOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group bg-white rounded-2xl shadow-lg border ${
                option.borderColor || 'border-gray-100'
              } p-8 flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300`}
            >
              <div className='relative w-full mb-6'>
                <div className='overflow-hidden rounded-lg shadow-md w-full'>
                  <img
                    src={option.imageUrl}
                    alt={option.altText}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
                  />
                </div>
                <div className='absolute bottom-2 left-2 bg-white bg-opacity-80 p-2 rounded-full shadow-md'>
                  {option.icon}
                </div>
              </div>
              <h3
                className={`text-xl font-semibold ${
                  option.textColor || 'text-gray-800'
                } mb-3`}
              >
                {option.title}
              </h3>
              <p
                className={`${
                  option.textColor || 'text-gray-600'
                } text-sm leading-relaxed`}
              >
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section Sub-heading */}
        <div className='text-center mb-12'>
          <h3 className='text-2xl md:text-3xl font-semibold text-gray-800 mb-2 tracking-tight'>
            Why Choose Personalised Lessons?
          </h3>
          <p className='text-gray-500 text-md max-w-lg mx-auto'>
            See how direct lessons stack up against generic online platforms.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 justify-center max-w-4xl mx-auto items-stretch'>
          {/* Online Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            viewport={{ once: true }}
            className='flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300'
          >
            <div className='flex w-full mb-4'>
              <X className='h-8 w-8 text-rose-400 mr-2' />
              <span className='text-lg font-semibold text-gray-800 tracking-wide'>
                Online Platforms
              </span>
            </div>
            <ul className='mt-4 space-y-4 w-full'>
              {comparisonData.map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 * idx,
                    duration: 0.5,
                    type: 'spring',
                  }}
                  viewport={{ once: true }}
                  className='flex items-center gap-3 text-gray-600 text-base'
                >
                  <X className='h-5 w-5 text-rose-400' />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          {/* Lessons With Me */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
            viewport={{ once: true }}
            className='flex-1 bg-white rounded-2xl shadow-lg border border-pink-100 p-10 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300'
          >
            <div className='flex w-full mb-4'>
              <CheckCircle className='h-8 w-8 text-green-500 mr-2' />
              <span className='text-lg font-semibold text-gray-800 tracking-wide'>
                Lessons With Me
              </span>
            </div>
            <ul className='mt-4 space-y-4 w-full'>
              {withMeOptions.map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 * idx,
                    duration: 0.5,
                    type: 'spring',
                  }}
                  viewport={{ once: true }}
                  className='flex items-center gap-3 text-gray-700 text-base'
                >
                  <CheckCircle className='h-5 w-5 text-green-500' />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
