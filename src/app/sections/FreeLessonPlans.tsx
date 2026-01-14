'use client'

import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function FreeLessonPlans() {
  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a')
    link.href = '/Free%20ESL%20Lesson%20Plans.pdf'
    link.download = 'Free ESL Lesson Plans.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className='py-20 bg-gradient-to-b from-gray-50 to-white'>
      <div className='container'>
        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden'
          >
            {/* Decorative gradient background */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'></div>

            <div className='relative z-10'>
              {/* Icon and Badge */}
              <div className='flex items-center justify-center mb-6'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-primary/20 rounded-2xl blur-xl'></div>
                  <div className='relative bg-primary p-6 rounded-2xl shadow-lg'>
                    <DocumentTextIcon className='w-12 h-12 text-white' />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4'>
                FREE ESL{' '}
                <span className='text-gradient-primary'>Lesson Plans</span>
              </h2>

              {/* Description */}
              <p className='text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8 leading-relaxed'>
                Save hours of planning time with ready-to-use lessons! Inside,
                you'll find a list of reliable, high-quality ESL lesson planning
                websites that you can use in one-to-one or group lessons, online
                or in person. All resources included here have been personally
                tested in real lessons!
              </p>

              {/* Features Grid */}
              <div className='grid md:grid-cols-3 gap-4 mb-10'>
                <div className='bg-gray-50 rounded-xl p-4 text-center border border-gray-100'>
                  <p className='text-sm font-semibold text-gray-900'>
                    Ready-Made PDFs
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    No sign-up required
                  </p>
                </div>
                <div className='bg-gray-50 rounded-xl p-4 text-center border border-gray-100'>
                  <p className='text-sm font-semibold text-gray-900'>
                    Tested Resources
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    Personally verified
                  </p>
                </div>
                <div className='bg-gray-50 rounded-xl p-4 text-center border border-gray-100'>
                  <p className='text-sm font-semibold text-gray-900'>
                    All Levels & Skills
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    A1 to C1 included
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <div className='flex justify-center'>
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'
                >
                  <ArrowDownTrayIcon className='w-5 h-5' />
                  Download Free PDF
                </motion.button>
              </div>

              {/* Additional Info */}
              <p className='text-sm text-gray-500 text-center mt-6'>
                Instant download • No email required • Free forever
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
