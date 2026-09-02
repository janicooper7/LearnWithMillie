'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Rocket, Megaphone, GraduationCap, ShieldCheck } from 'lucide-react'
import { bundle } from './journeyData'

const GOLD = '#C2AA6A'
const INK = '#1F3A34'
const CREAM = '#F4EDE4'

const trilogy = [
  { icon: Rocket, label: 'GET READY', stage: 'Stage 02', price: '$49' },
  { icon: Megaphone, label: 'GET BOOKED', stage: 'Stage 03', price: '$79' },
  { icon: GraduationCap, label: 'STAY BOOKED', stage: 'Stage 04', price: '$59' },
]

export default function JourneyBundle() {
  const reduce = useReducedMotion()

  const rise = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-15% 0px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }

  return (
    <section className='section-padding' style={{ backgroundColor: INK }}>
      <div className='container'>
        <motion.div {...rise} className='max-w-2xl'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='h-px w-8' style={{ backgroundColor: GOLD }} />
            <span
              className='text-xs font-medium uppercase tracking-[0.25em]'
              style={{ color: GOLD, fontFamily: 'var(--font-inter), sans-serif' }}
            >
              The whole road at once
            </span>
          </div>
          <h2 className='heading-lg' style={{ color: CREAM }}>
            Or take the trilogy
            <br />
            and skip the decisions
          </h2>
          <p
            className='mt-5 text-lg leading-relaxed'
            style={{
              color: 'rgba(244,237,228,0.7)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Stages 02 to 04 are three courses, and most teachers who buy the first
            come back for the other two within a month. BOOKED bundles them —
            handovers designed, order intact, {bundle.save} saved.
          </p>
        </motion.div>

        {/* The three courses, chained */}
        <div className='mt-14 flex flex-col items-stretch gap-4 md:flex-row md:items-center'>
          {trilogy.map((c, i) => (
            <div key={c.label} className='flex flex-1 items-center gap-4'>
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className='flex-1 rounded-2xl p-6'
                style={{
                  backgroundColor: 'rgba(244,237,228,0.05)',
                  border: '1px solid rgba(194,170,106,0.28)',
                }}
              >
                <div className='flex items-center justify-between'>
                  <span
                    className='flex h-10 w-10 items-center justify-center rounded-xl'
                    style={{ backgroundColor: 'rgba(194,170,106,0.16)' }}
                  >
                    <c.icon className='h-4 w-4' style={{ color: GOLD }} />
                  </span>
                  <span
                    className='text-sm font-semibold'
                    style={{
                      color: 'rgba(244,237,228,0.5)',
                      fontFamily: 'var(--font-inter), sans-serif',
                      textDecoration: 'line-through',
                    }}
                  >
                    {c.price}
                  </span>
                </div>
                <p
                  className='mt-4 text-lg font-bold tracking-[0.04em]'
                  style={{ color: CREAM, fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {c.label}
                </p>
                <p
                  className='mt-1 text-xs uppercase tracking-[0.16em]'
                  style={{
                    color: 'rgba(194,170,106,0.75)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {c.stage}
                </p>
              </motion.div>

              {i < trilogy.length - 1 && (
                <ArrowRight
                  className='hidden h-5 w-5 flex-shrink-0 md:block'
                  style={{ color: 'rgba(194,170,106,0.55)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bundle card */}
        <motion.div
          {...rise}
          className='mt-6 grid gap-8 rounded-3xl p-8 md:p-10 lg:grid-cols-[1fr_320px] lg:items-center'
          style={{ backgroundColor: CREAM }}
        >
          <div>
            <span
              className='inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]'
              style={{
                backgroundColor: 'rgba(194,170,106,0.25)',
                color: INK,
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              The BOOKED Trilogy
            </span>
            <h3 className='heading-sm mt-4' style={{ color: INK }}>
              Everything. All three. Built to work together.
            </h3>
            <div className='mt-6 space-y-2.5'>
              {bundle.points.map((p) => (
                <div key={p} className='flex items-start gap-3'>
                  <Check
                    className='mt-0.5 h-4 w-4 flex-shrink-0'
                    style={{ color: GOLD }}
                  />
                  <span
                    className='text-sm leading-relaxed'
                    style={{
                      color: 'rgba(31,58,52,0.75)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className='rounded-2xl bg-white p-7 text-center'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <p
              className='text-sm'
              style={{
                color: 'rgba(31,58,52,0.5)',
                fontFamily: 'var(--font-inter), sans-serif',
                textDecoration: 'line-through',
              }}
            >
              {bundle.separateTotal} bought separately
            </p>
            <p
              className='mt-1 text-5xl font-bold'
              style={{ color: INK, fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {bundle.price}
            </p>
            <p
              className='mt-2 text-sm font-semibold'
              style={{ color: GOLD, fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Save {bundle.save} · one payment
            </p>

            <Link
              href={bundle.href}
              className='mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5'
              style={{
                backgroundColor: INK,
                color: CREAM,
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Get the trilogy
              <ArrowRight className='h-4 w-4' />
            </Link>

            <div className='mt-4 flex items-center justify-center gap-2'>
              <ShieldCheck className='h-3.5 w-3.5' style={{ color: 'rgba(31,58,52,0.5)' }} />
              <span
                className='text-xs'
                style={{
                  color: 'rgba(31,58,52,0.55)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                7-day full refund
              </span>
            </div>
          </div>
        </motion.div>

        {/* Closing line */}
        <motion.p
          {...rise}
          className='mx-auto mt-14 max-w-xl text-center text-base leading-relaxed'
          style={{
            color: 'rgba(244,237,228,0.6)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          You don’t need the whole roadmap today. You need the next stage — and to
          know there’s a road after it.{' '}
          <Link
            href='/teachers/products'
            className='font-semibold underline underline-offset-4'
            style={{ color: GOLD }}
          >
            See everything on offer
          </Link>
          .
        </motion.p>
      </div>
    </section>
  )
}
