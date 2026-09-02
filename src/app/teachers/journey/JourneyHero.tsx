'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'

const GOLD = '#C2AA6A'
const INK = '#1F3A34'
const CREAM = '#F4EDE4'

export default function JourneyHero() {
  const reduce = useReducedMotion()

  // With reduced motion the whole hero renders in place — no offsets to animate.
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section
      id='journey-hero'
      className='relative overflow-hidden'
      style={{ backgroundColor: INK }}
    >
      {/* Contour lines — a faint topographic map, so the page reads as a route
          before a single word is read. */}
      <div aria-hidden className='pointer-events-none absolute inset-0 opacity-[0.16]'>
        <svg
          className='h-full w-full'
          viewBox='0 0 1200 620'
          preserveAspectRatio='xMidYMid slice'
          fill='none'
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.path
              key={i}
              d={`M-40 ${140 + i * 74} C 210 ${60 + i * 74}, 330 ${250 + i * 66}, 600 ${
                190 + i * 70
              } S 1010 ${90 + i * 70}, 1240 ${170 + i * 72}`}
              stroke={GOLD}
              strokeWidth='1.1'
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.2, delay: 0.15 * i, ease: 'easeInOut' }}
            />
          ))}
        </svg>
      </div>

      <div className='container relative z-10 py-20 md:py-28 lg:py-32'>
        <motion.div {...rise(0)} className='mb-7 flex items-center gap-3'>
          <div className='h-px w-8' style={{ backgroundColor: GOLD }} />
          <span
            className='text-xs font-medium uppercase tracking-[0.28em]'
            style={{ color: GOLD, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            For Teachers · The Roadmap
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className='heading-xl max-w-4xl'
          style={{ color: CREAM }}
        >
          The roadmap for
          <br />
          online teachers
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className='mt-7 max-w-2xl text-lg leading-relaxed'
          style={{
            color: 'rgba(244,237,228,0.72)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          Five stages, in the order they actually happen — from “I think I want to
          teach online” to a calendar that fills itself. At every stage, the exact
          problem you’ll hit, what to do about it, and the one thing built to help.
        </motion.p>

        <motion.div {...rise(0.24)} className='mt-10 flex flex-wrap items-center gap-4'>
          <Link
            href='#where-are-you'
            className='inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5'
            style={{
              backgroundColor: GOLD,
              color: INK,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            <MapPin className='h-4 w-4' />
            Find where you are
            <ArrowRight className='h-4 w-4' />
          </Link>
          <Link
            href='/teachers/products'
            className='inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold transition-colors'
            style={{
              border: '1px solid rgba(194,170,106,0.45)',
              color: CREAM,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Browse courses &amp; tools
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
