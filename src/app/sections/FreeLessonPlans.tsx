'use client'

import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function FreeLessonPlans() {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Free%20ESL%20Lesson%20Plans.pdf'
    link.download = 'Free ESL Lesson Plans.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className='py-20 bg-white'>
      <div className='container'>
        <div className='max-w-3xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative rounded-xl overflow-hidden border'
            style={{ borderColor: '#EDE4D8', backgroundColor: '#F4EDE4' }}
          >
            {/* Top accent line */}
            <div className='h-0.5 w-full' style={{ backgroundColor: '#C2AA6A' }}></div>

            <div className='p-8 md:p-12'>
              {/* Icon */}
              <div className='flex items-center justify-center mb-8'>
                <div
                  className='p-5 rounded-xl'
                  style={{ backgroundColor: '#1F3A34' }}
                >
                  <DocumentTextIcon className='w-10 h-10 text-white' />
                </div>
              </div>

              {/* Heading */}
              <h2
                className='text-3xl md:text-4xl font-bold text-center mb-4'
                style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                FREE ESL Lesson Plans
              </h2>

              {/* Description */}
              <p
                className='text-base md:text-lg text-center max-w-xl mx-auto mb-10 leading-relaxed'
                style={{ color: '#1F3A34', opacity: 0.7 }}
              >
                Save hours of planning time with ready-to-use lessons! Inside,
                you'll find reliable, high-quality ESL lesson planning websites
                for one-to-one or group lessons, online or in person — all
                personally tested in real lessons.
              </p>

              {/* Feature chips */}
              <div className='flex flex-wrap justify-center gap-3 mb-10'>
                {['Ready-Made PDFs', 'Personally Tested', 'All Levels A1–C1', 'No Sign-Up'].map((tag) => (
                  <span
                    key={tag}
                    className='px-4 py-2 rounded-full text-sm font-medium border'
                    style={{
                      color: '#1F3A34',
                      borderColor: 'rgba(31,58,52,0.2)',
                      backgroundColor: 'white',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Download Button */}
              <div className='flex justify-center'>
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-105'
                  style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  <ArrowDownTrayIcon className='w-5 h-5' />
                  Download Free PDF
                </motion.button>
              </div>

              <p
                className='text-xs text-center mt-5'
                style={{ color: '#1F3A34', opacity: 0.45 }}
              >
                Instant download · No email required · Free forever
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
