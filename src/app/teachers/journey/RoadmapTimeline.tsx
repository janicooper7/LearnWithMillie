'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Quote } from 'lucide-react'
import { stages, type JourneyProduct, type JourneyStage } from './journeyData'

const GOLD = '#C2AA6A'
const INK = '#1F3A34'
const BORDER = '#EDE4D8'

/* --------------------------------------------------------------------- */
/* Product attachment — the "here's what helps" card inside a stage       */
/* --------------------------------------------------------------------- */

function ProductCard({ p }: { p: JourneyProduct }) {
  const dark = p.tone === 'course'

  return (
    <Link
      href={p.href}
      className='group flex flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center'
      style={{
        backgroundColor: dark ? INK : '#FFFFFF',
        border: dark ? `1px solid ${INK}` : `1px solid ${BORDER}`,
        boxShadow: '0 2px 14px -10px rgba(31,58,52,0.3)',
      }}
    >
      <div
        className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl'
        style={{
          backgroundColor: dark ? 'rgba(194,170,106,0.16)' : 'rgba(31,58,52,0.06)',
          border: dark ? '1px solid rgba(194,170,106,0.35)' : `1px solid ${BORDER}`,
        }}
      >
        <p.icon className='h-5 w-5' style={{ color: dark ? GOLD : INK }} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          <span
            className='text-[11px] font-semibold uppercase tracking-[0.18em]'
            style={{
              color: dark ? GOLD : 'rgba(31,58,52,0.5)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {p.eyebrow}
          </span>
          <span
            className='rounded-full px-2.5 py-0.5 text-[11px] font-bold'
            style={{
              backgroundColor: dark ? 'rgba(194,170,106,0.18)' : 'rgba(194,170,106,0.22)',
              color: dark ? GOLD : INK,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {p.price}
          </span>
        </div>

        <p
          className='mt-1.5 text-base font-semibold leading-snug'
          style={{
            color: dark ? '#F4EDE4' : INK,
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {p.name}
        </p>
        <p
          className='mt-1.5 text-sm leading-relaxed'
          style={{
            color: dark ? 'rgba(244,237,228,0.7)' : 'rgba(31,58,52,0.65)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {p.blurb}
        </p>

        <div className='mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1'>
          {p.meta.map((m, i) => (
            <span key={m} className='inline-flex items-center gap-2.5'>
              {i > 0 && (
                <span
                  aria-hidden
                  className='text-[10px]'
                  style={{
                    color: dark ? 'rgba(244,237,228,0.3)' : 'rgba(31,58,52,0.25)',
                  }}
                >
                  •
                </span>
              )}
              <span
                className='text-xs font-medium'
                style={{
                  color: dark ? 'rgba(244,237,228,0.55)' : 'rgba(31,58,52,0.5)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {m}
              </span>
            </span>
          ))}
        </div>
      </div>

      <span
        className='inline-flex flex-shrink-0 items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5 sm:self-center'
        style={{
          backgroundColor: dark ? GOLD : INK,
          color: dark ? INK : '#F4EDE4',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {p.cta}
        <ArrowRight className='h-3.5 w-3.5' />
      </span>
    </Link>
  )
}

/* --------------------------------------------------------------------- */
/* One stage row: timeframe column, animated rail, content card          */
/* --------------------------------------------------------------------- */

function Stage({
  stage,
  index,
  isLast,
  onActive,
}: {
  stage: JourneyStage
  index: number
  isLast: boolean
  onActive: (i: number) => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Drives the marker's "you are here" state and the right-hand dot rail.
  const active = useInView(rowRef, { margin: '-45% 0px -45% 0px' })
  const seen = useInView(rowRef, { once: true, margin: '-15% 0px -15% 0px' })

  useEffect(() => {
    if (active) onActive(index)
  }, [active, index, onActive])

  const show = reduce || seen

  return (
    <div
      ref={rowRef}
      id={stage.id}
      data-stage={index}
      className='grid scroll-mt-32 grid-cols-[44px_minmax(0,1fr)] gap-x-5 md:grid-cols-[124px_56px_minmax(0,1fr)] md:gap-x-7'
    >
      {/* Timeframe rail — desktop only; on mobile it rides inside the card. */}
      <div className='hidden pt-1 text-right md:block'>
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -10 }}
          animate={show ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <p
            className='text-sm font-semibold'
            style={{
              color: active ? INK : 'rgba(31,58,52,0.55)',
              fontFamily: 'var(--font-inter), sans-serif',
              transition: 'color 0.4s ease',
            }}
          >
            {stage.timeframe}
          </p>
          <p
            className='mt-1 text-xs leading-relaxed'
            style={{
              color: 'rgba(31,58,52,0.4)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {stage.effort}
          </p>
        </motion.div>
      </div>

      {/* The path itself */}
      <div className='relative flex justify-center'>
        {/* Base track */}
        {!isLast && (
          <div
            aria-hidden
            className='absolute bottom-0 left-1/2 top-12 w-[2px] -translate-x-1/2'
            style={{ backgroundColor: 'rgba(31,58,52,0.1)' }}
          />
        )}
        {/* Gold fill — draws itself downward as the stage scrolls in */}
        {!isLast && (
          <motion.div
            aria-hidden
            className='absolute bottom-0 left-1/2 top-12 w-[2px] origin-top -translate-x-1/2'
            style={{
              background: `linear-gradient(to bottom, ${GOLD}, rgba(194,170,106,0.35))`,
            }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-20% 0px -25% 0px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        )}

        {/* Marker */}
        <motion.div
          className='relative z-10 flex h-11 w-11 items-center justify-center rounded-full'
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={show ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          style={{
            backgroundColor: active ? INK : '#FFFFFF',
            border: `2px solid ${active ? GOLD : 'rgba(31,58,52,0.15)'}`,
            boxShadow: active
              ? '0 0 0 6px rgba(194,170,106,0.16)'
              : '0 2px 8px -4px rgba(31,58,52,0.25)',
            transition:
              'background-color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
          }}
        >
          <stage.icon
            className='h-[18px] w-[18px]'
            style={{
              color: active ? GOLD : 'rgba(31,58,52,0.55)',
              transition: 'color 0.45s ease',
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className='pb-16 md:pb-24'
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className='mb-1 flex flex-wrap items-center gap-x-4 gap-y-2'>
          <span
            className='text-3xl font-bold leading-none'
            style={{
              color: active ? GOLD : 'rgba(31,58,52,0.2)',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              transition: 'color 0.45s ease',
            }}
          >
            {stage.number}
          </span>
          <span
            className='text-xs font-semibold uppercase tracking-[0.22em]'
            style={{
              color: 'rgba(31,58,52,0.55)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {stage.phase}
          </span>
          {/* Mobile timeframe chip */}
          <span
            className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold md:hidden'
            style={{
              backgroundColor: 'rgba(194,170,106,0.16)',
              color: INK,
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            <Clock className='h-3 w-3' />
            {stage.timeframe}
          </span>
        </div>

        <h3
          className='heading-md mt-3'
          style={{ color: INK, maxWidth: '22ch' }}
        >
          {stage.title}
        </h3>

        {/* Where you are */}
        <div
          className='mt-6 rounded-2xl p-5 md:p-6'
          style={{
            backgroundColor: 'rgba(31,58,52,0.035)',
            borderLeft: `3px solid ${GOLD}`,
          }}
        >
          <div className='mb-2 flex items-center gap-2'>
            <Quote className='h-3.5 w-3.5' style={{ color: GOLD }} />
            <span
              className='text-[11px] font-semibold uppercase tracking-[0.2em]'
              style={{
                color: 'rgba(31,58,52,0.5)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Where you are
            </span>
          </div>
          <p
            className='text-base leading-relaxed'
            style={{
              color: 'rgba(31,58,52,0.75)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {stage.where}
          </p>
        </div>

        {/* What you do — one icon per move */}
        <p
          className='mb-4 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em]'
          style={{
            color: 'rgba(31,58,52,0.5)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          What you do here
        </p>
        <div className='grid gap-3 sm:grid-cols-2'>
          {stage.does.map((d, i) => (
            <motion.div
              key={d.text}
              className='flex items-start gap-3 rounded-xl bg-white p-4'
              style={{ border: `1px solid ${BORDER}` }}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }}
            >
              <span
                className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg'
                style={{ backgroundColor: 'rgba(194,170,106,0.16)' }}
              >
                <d.icon className='h-4 w-4' style={{ color: INK }} />
              </span>
              <span
                className='text-sm leading-relaxed'
                style={{
                  color: 'rgba(31,58,52,0.75)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {d.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* What gets you through it */}
        <p
          className='mb-4 mt-9 text-[11px] font-semibold uppercase tracking-[0.2em]'
          style={{
            color: 'rgba(31,58,52,0.5)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          What gets you through it
        </p>
        <div className='space-y-3'>
          {stage.products.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------------- */

export default function RoadmapTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  // The dot rail is fixed, so it would otherwise hang around over the hero and
  // the bundle band — it only earns its place while the stages are on screen.
  const railVisible = useInView(listRef, { margin: '-20% 0px -20% 0px' })

  // Stable identity so the child's in-view effect doesn't loop on re-render.
  const handleActive = useCallback((i: number) => {
    setActiveIndex((prev) => (prev === i ? prev : i))
  }, [])

  return (
    <section
      id='roadmap'
      className='section-padding scroll-mt-24'
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>
        <div className='relative' ref={listRef}>
          {/* Progress rail — a click-through map of the page, wide screens only */}
          <nav
            aria-label='Roadmap stages'
            className='fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block'
            style={{
              opacity: railVisible ? 1 : 0,
              pointerEvents: railVisible ? 'auto' : 'none',
              transition: 'opacity 0.35s ease',
            }}
          >
            <ul className='flex flex-col items-end gap-4'>
              {stages.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className='group flex items-center justify-end gap-3'
                    aria-current={activeIndex === i ? 'true' : undefined}
                  >
                    <span
                      className='whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                      style={{
                        backgroundColor: INK,
                        color: '#F4EDE4',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {s.number} · {s.phase}
                    </span>
                    <span
                      className='block rounded-full'
                      style={{
                        width: activeIndex === i ? 11 : 8,
                        height: activeIndex === i ? 11 : 8,
                        backgroundColor: activeIndex === i ? GOLD : 'rgba(31,58,52,0.22)',
                        boxShadow:
                          activeIndex === i ? '0 0 0 4px rgba(194,170,106,0.22)' : 'none',
                        transition: 'all 0.35s ease',
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {stages.map((stage, i) => (
            <Stage
              key={stage.id}
              stage={stage}
              index={i}
              isLast={i === stages.length - 1}
              onActive={handleActive}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
