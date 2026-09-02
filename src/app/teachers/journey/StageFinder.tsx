'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, MapPin, Quote, Sparkles } from 'lucide-react'
import { finderOptions, stages, type Recommendation } from './journeyData'

const GOLD = '#C2AA6A'
const INK = '#1F3A34'
const CREAM = '#F4EDE4'
const BORDER = '#EDE4D8'

/* --------------------------------------------------------------------- */
/* One recommendation — the badge carries the ranking, so a reader can    */
/* tell "buy this now" from "and this eventually" at a glance.            */
/* --------------------------------------------------------------------- */

function PickCard({ pick, rank }: { pick: Recommendation; rank: number }) {
  const p = pick.product
  // The first pick is the actual next step, so it gets the solid treatment.
  const primary = rank === 0

  return (
    <Link
      href={p.href}
      className='group flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1'
      style={{
        backgroundColor: primary ? INK : '#FFFFFF',
        border: primary ? `1px solid ${INK}` : `1px solid ${BORDER}`,
        boxShadow: primary
          ? '0 22px 44px -26px rgba(31,58,52,0.6)'
          : '0 4px 18px -12px rgba(31,58,52,0.28)',
      }}
    >
      {/* Badge */}
      <span
        className='mb-6 inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]'
        style={{
          backgroundColor: primary ? GOLD : 'rgba(194,170,106,0.2)',
          color: INK,
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {primary && <Sparkles className='h-3 w-3' />}
        {pick.badge}
      </span>

      {/* Icon + price */}
      <div className='mb-5 flex items-center justify-between'>
        <span
          className='flex h-14 w-14 items-center justify-center rounded-2xl'
          style={{
            backgroundColor: primary
              ? 'rgba(194,170,106,0.16)'
              : 'rgba(31,58,52,0.05)',
            border: primary ? '1px solid rgba(194,170,106,0.3)' : `1px solid ${BORDER}`,
          }}
        >
          <p.icon className='h-6 w-6' style={{ color: primary ? GOLD : INK }} />
        </span>
        <span
          className='text-2xl font-bold'
          style={{
            color: primary ? GOLD : INK,
            fontFamily: 'var(--font-playfair), Georgia, serif',
          }}
        >
          {p.price}
        </span>
      </div>

      <p
        className='text-[11px] font-semibold uppercase tracking-[0.18em]'
        style={{
          color: primary ? 'rgba(194,170,106,0.85)' : 'rgba(31,58,52,0.5)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {p.eyebrow}
      </p>
      <h4
        className='mt-2 text-xl leading-snug'
        style={{
          color: primary ? CREAM : INK,
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontWeight: 700,
        }}
      >
        {p.name}
      </h4>

      <p
        className='mt-4 text-[15px] leading-relaxed'
        style={{
          color: primary ? 'rgba(244,237,228,0.75)' : 'rgba(31,58,52,0.7)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {pick.why}
      </p>

      <div className='mb-7 mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1'>
        {p.meta.map((m, i) => (
          <span
            key={m}
            className='text-xs font-medium'
            style={{
              color: primary ? 'rgba(244,237,228,0.55)' : 'rgba(31,58,52,0.5)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {m}
            {i < p.meta.length - 1 && (
              <span
                aria-hidden
                className='ml-2.5 text-[10px]'
                style={{
                  color: primary ? 'rgba(244,237,228,0.3)' : 'rgba(31,58,52,0.25)',
                }}
              >
                •
              </span>
            )}
          </span>
        ))}
      </div>

      <span
        className='mt-auto inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-transform group-hover:translate-x-0.5'
        style={{
          backgroundColor: primary ? GOLD : INK,
          color: primary ? INK : CREAM,
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {p.cta}
        <ArrowRight className='h-4 w-4' />
      </span>
    </Link>
  )
}

/* --------------------------------------------------------------------- */

export default function StageFinder() {
  const [picked, setPicked] = useState<number | null>(null)
  const reduce = useReducedMotion()

  const option = picked === null ? null : finderOptions[picked]
  const stage = option ? stages[option.stageIndex] : null

  return (
    <section
      id='where-are-you'
      className='section-padding scroll-mt-24'
      style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${BORDER}` }}
    >
      <div className='container'>
        <div className='max-w-3xl'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='h-px w-8' style={{ backgroundColor: GOLD }} />
            <span
              className='text-xs font-medium uppercase tracking-[0.25em]'
              style={{
                color: 'rgba(31,58,52,0.7)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Start where you are
            </span>
          </div>
          <h2 className='heading-lg' style={{ color: INK }}>
            Where are you right now?
          </h2>
          <p
            className='mt-5 max-w-xl text-lg leading-relaxed'
            style={{
              color: 'rgba(31,58,52,0.65)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Pick the line that sounds most like this week. You’ll get the stage
            you’re standing in, what it actually asks of you, and exactly what to
            take with you into it.
          </p>
        </div>

        {/* Options — the five stages, as five things you'd actually say */}
        <div className='mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
          {finderOptions.map((o, i) => {
            const selected = picked === i
            return (
              <button
                key={o.label}
                type='button'
                onClick={() => setPicked(selected ? null : i)}
                aria-pressed={selected}
                className='group relative flex flex-col items-start rounded-3xl p-7 text-left transition-all duration-300 [order:var(--ord)] hover:-translate-y-1 sm:[order:0]'
                style={
                  {
                    // Mobile stacks one card per row, so the result panel can
                    // slot in directly beneath the card that was tapped rather
                    // than below all five. From `sm` up the orders reset to 0
                    // and DOM order takes over again.
                    '--ord': i * 2,
                    backgroundColor: selected ? INK : '#FFFFFF',
                    border: `1.5px solid ${selected ? INK : BORDER}`,
                    boxShadow: selected
                      ? '0 22px 44px -26px rgba(31,58,52,0.6)'
                      : '0 4px 18px -12px rgba(31,58,52,0.28)',
                  } as CSSProperties
                }
              >
                {/* Selected tick */}
                <span
                  className='absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full transition-opacity duration-200'
                  style={{
                    backgroundColor: GOLD,
                    opacity: selected ? 1 : 0,
                  }}
                >
                  <Check className='h-3.5 w-3.5' style={{ color: INK }} />
                </span>

                <span
                  className='flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300'
                  style={{
                    backgroundColor: selected
                      ? 'rgba(194,170,106,0.16)'
                      : 'rgba(31,58,52,0.05)',
                    border: selected
                      ? '1px solid rgba(194,170,106,0.3)'
                      : `1px solid ${BORDER}`,
                  }}
                >
                  <o.icon
                    className='h-7 w-7 transition-colors duration-300'
                    style={{ color: selected ? GOLD : INK }}
                  />
                </span>

                <span
                  className='mt-6 block text-[11px] font-semibold uppercase tracking-[0.18em]'
                  style={{
                    color: selected ? 'rgba(194,170,106,0.85)' : 'rgba(31,58,52,0.42)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  Stage {stages[o.stageIndex].number}
                </span>

                <span
                  className='mt-2 block text-xl leading-tight'
                  style={{
                    color: selected ? CREAM : INK,
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontWeight: 700,
                  }}
                >
                  {o.label}
                </span>

                <span
                  className='mt-3 block text-[15px] leading-relaxed'
                  style={{
                    color: selected
                      ? 'rgba(244,237,228,0.7)'
                      : 'rgba(31,58,52,0.6)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {o.detail}
                </span>
              </button>
            )
          })}

          {/* Result */}
          <AnimatePresence mode='wait'>
            {option && stage && (
              <motion.div
                key={option.label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className='col-span-full overflow-hidden rounded-[28px] [order:var(--ord)] sm:[order:0]'
                style={
                  {
                    '--ord': picked === null ? 0 : picked * 2 + 1,
                    backgroundColor: CREAM,
                    border: `1px solid ${BORDER}`,
                  } as CSSProperties
                }
              >
                <div className='p-8 md:p-12'>
                  {/* Where this puts you */}
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-4 w-4' style={{ color: GOLD }} />
                    <span
                      className='text-[11px] font-semibold uppercase tracking-[0.2em]'
                      style={{
                        color: 'rgba(31,58,52,0.55)',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      Your starting point
                    </span>
                  </div>

                  <div className='mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2'>
                    <span
                      className='text-5xl font-bold leading-none'
                      style={{
                        color: GOLD,
                        fontFamily: 'var(--font-playfair), Georgia, serif',
                      }}
                    >
                      {stage.number}
                    </span>
                    <h3 className='heading-md' style={{ color: INK }}>
                      {stage.title}
                    </h3>
                  </div>

                  <p
                    className='mt-5 max-w-3xl text-lg leading-relaxed'
                    style={{
                      color: 'rgba(31,58,52,0.72)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {option.verdict}
                  </p>

                  {/* The honest read on where this leaves you standing */}
                  <div
                    className='mt-8 rounded-2xl bg-white p-6 md:p-7'
                    style={{
                      border: `1px solid ${BORDER}`,
                      borderLeft: `3px solid ${GOLD}`,
                    }}
                  >
                    <div className='mb-2.5 flex items-center gap-2'>
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

                  {/* What the stage actually asks of you */}
                  <p
                    className='mb-4 mt-10 text-[11px] font-semibold uppercase tracking-[0.2em]'
                    style={{
                      color: 'rgba(31,58,52,0.5)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    What you do at stage {stage.number}
                  </p>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {stage.does.map((d, i) => (
                      <motion.div
                        key={d.text}
                        className='flex items-start gap-3 rounded-xl bg-white p-4'
                        style={{ border: `1px solid ${BORDER}` }}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
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

                  {/* The picks */}
                  <div className='mb-6 mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2'>
                    <h4 className='heading-sm' style={{ color: INK }}>
                      What we’d put in your hands
                    </h4>
                    <p
                      className='text-sm'
                      style={{
                        color: 'rgba(31,58,52,0.55)',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      In the order they’ll help. Start with the first.
                    </p>
                  </div>

                  <div className='grid gap-5 lg:grid-cols-3'>
                    {option.picks.map((pick, i) => (
                      <PickCard key={pick.product.name} pick={pick} rank={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
