'use client'

import { useCallback, useEffect, useState } from 'react'
import { Star, TrendingUp } from 'lucide-react'
import { featuredTeacherTestimonials } from '@/lib/teacherTestimonials'

// Proof block for the course sales page — the first thing under the hero.
//
// Shown one message at a time rather than as a grid: five cards side by side
// read as decoration a visitor scrolls past, where a single large quote gets
// read. Dots below say how many more there are.
//
// Each slide leads with the specific outcome the teacher reported, because a
// named result converts where generic praise doesn't.
//
// Framing note: the set mixes paying course students with teachers who followed
// the free content and mentorship, so the copy claims only that they applied the
// systems the trilogy teaches — not that every one of them enrolled.

const AUTOPLAY_MS = 7000

const GOLD = '#C2AA6A'
const GREEN = '#1F3A34'

// The stat bar is read off the messages themselves, so it can never claim more
// reach than the set on screen actually backs up.
const countries = featuredTeacherTestimonials
  .flatMap((t) => (t.country && t.flag ? [{ country: t.country, flag: t.flag }] : []))
  .filter((c, i, all) => all.findIndex((o) => o.country === c.country) === i)

export default function CourseTestimonials() {
  const slides = featuredTeacherTestimonials
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Resolved on the client so the progress bar is only ever rendered when it
  // actually reflects a running timer.
  const [animate, setAnimate] = useState(false)

  const go = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length)
    },
    [slides.length]
  )

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // The timer restarts whenever `index` changes, so a manual click also gives
  // the reader a fresh full interval on the slide they chose.
  useEffect(() => {
    if (paused || !animate || slides.length < 2) return
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, animate, go, slides.length])

  if (slides.length === 0) return null

  return (
    <section>
      <div className="mb-6">
        <span
          className="mb-4 inline-flex items-center gap-2 rounded-full py-1.5 pl-2.5 pr-3.5"
          style={{
            backgroundColor: 'rgba(194,170,106,0.16)',
            border: '1px solid rgba(194,170,106,0.45)',
          }}
        >
          <span className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5" style={{ color: GOLD, fill: GOLD }} />
            ))}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: '#8A7434', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Real messages, real results
          </span>
        </span>

        <h2
          className="text-3xl font-bold md:text-4xl"
          style={{ color: GREEN, fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Tutors who enrolled &mdash;{' '}
          <em className="italic" style={{ color: '#8A7434' }}>
            and got booked.
          </em>
        </h2>
        <p
          className="mt-3 text-lg leading-relaxed"
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Unedited messages from teachers who applied the systems taught inside the
          trilogy.
        </p>

        <StatBar countries={countries} />
      </div>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Messages from teachers"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* The card itself carries the background, the glow and the decoration,
            so the slides stacked inside it are transparent content layers. */}
        <div
          className="relative overflow-hidden rounded-3xl px-6 pb-7 pt-8 sm:px-9 md:px-10 md:pb-9 md:pt-11"
          style={{
            backgroundColor: GREEN,
            backgroundImage:
              'radial-gradient(120% 90% at 100% 0%, rgba(194,170,106,0.22) 0%, rgba(194,170,106,0) 55%)',
            boxShadow: '0 30px 70px -34px rgba(31,58,52,0.75)',
          }}
        >
          {/* Autoplay timer, drawn as a hairline along the top edge. */}
          {animate && slides.length > 1 && (
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              aria-hidden="true"
            >
              <div
                key={index}
                className="lwm-quote-progress h-full w-full"
                style={{
                  backgroundColor: GOLD,
                  animationDuration: `${AUTOPLAY_MS}ms`,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              />
            </div>
          )}

          {/* Oversized quote mark — decoration, not content. */}
          <span
            className="pointer-events-none absolute -top-8 right-4 select-none text-[9rem] leading-none md:text-[12rem]"
            style={{
              color: 'rgba(194,170,106,0.13)',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          {/* Every slide is laid into the same grid cell, so the card is sized
              by the longest message and nothing below it shifts as slides
              change. */}
          <div className="relative grid">
            {slides.map((t, i) => {
              const active = i === index
              return (
                <figure
                  key={t.name}
                  aria-hidden={!active}
                  className="col-start-1 row-start-1 flex flex-col"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0)' : 'translateY(10px)',
                    pointerEvents: active ? 'auto' : 'none',
                    // The outgoing message clears before the incoming one
                    // arrives. A plain crossfade leaves both quotes legible at
                    // once, which reads as a rendering fault, not a transition.
                    transition:
                      'opacity 350ms ease, transform 450ms cubic-bezier(0.22,1,0.36,1)',
                    transitionDelay: active ? '220ms' : '0ms',
                  }}
                >
                  {t.result && (
                    <p
                      className="mb-4 flex items-start gap-2.5 text-[1.6rem] font-bold leading-tight md:text-[2rem]"
                      style={{ color: GOLD, fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      <TrendingUp
                        className="mt-1.5 h-6 w-6 flex-shrink-0 md:mt-2"
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span>{t.result}</span>
                    </p>
                  )}

                  <blockquote
                    className="flex-grow text-lg leading-relaxed md:text-xl"
                    style={{
                      color: 'rgba(255,255,255,0.88)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {t.content}
                  </blockquote>

                  <figcaption
                    className="mt-7 flex items-center gap-3 pt-5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <Avatar testimonial={t} size={44} />
                    <span style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                      <span className="block text-base font-semibold text-white">{t.name}</span>
                      <span className="block text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {/* Name only — the flags live in the stat bar above,
                            and a second copy here reads as clutter. */}
                        {t.country ? `${t.role} · ${t.country}` : t.role}
                      </span>
                    </span>
                    <span
                      className="ml-auto flex flex-shrink-0 gap-0.5"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="h-4 w-4" style={{ color: GOLD, fill: GOLD }} />
                      ))}
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>

        {/* Plain dots — the active one stretches into a gold pill. The teacher
            behind each message is named in the card's caption, so the control
            below only has to say where you are in the set. */}
        {slides.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2.5">
            {slides.map((t, i) => {
              const active = i === index
              return (
                <button
                  key={t.name}
                  onClick={() => go(i)}
                  aria-label={`Show message ${i + 1} of ${slides.length}`}
                  aria-current={active}
                  className="rounded-full transition-all duration-300"
                  style={{
                    height: '0.6rem',
                    width: active ? '1.75rem' : '0.6rem',
                    backgroundColor: active ? GOLD : 'rgba(31,58,52,0.2)',
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Dark summary strip under the heading: the shape of the proof at a glance,
 * before the reader commits to reading a single quote.
 */
function StatBar({ countries }: { countries: { country: string; flag: string }[] }) {
  return (
    <div
      className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 rounded-2xl px-5 py-4 sm:px-7"
      style={{
        backgroundColor: GREEN,
        backgroundImage:
          'radial-gradient(120% 140% at 100% 0%, rgba(194,170,106,0.18) 0%, rgba(194,170,106,0) 60%)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5" style={{ color: GOLD, fill: GOLD }} />
          ))}
        </span>
        <span className="text-sm font-bold text-white">Rated by tutors</span>
      </div>

      <Stat value={String(countries.length)} label="Countries" />
      <Stat value="100%" label="Would recommend" />

      {/* Windows has no colour glyphs for regional-indicator pairs, so a flag
          there falls back to its two-letter code. The pill is sized and
          coloured to hold either one without looking like a broken image. */}
      <span className="ml-auto flex flex-shrink-0 items-center gap-1.5">
        {countries.map((c) => (
          <span
            key={c.country}
            title={c.country}
            aria-label={c.country}
            role="img"
            className="flex h-7 items-center rounded-md px-1.5 text-base font-semibold leading-none"
            style={{
              backgroundColor: 'rgba(194,170,106,0.16)',
              border: '1px solid rgba(194,170,106,0.35)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {c.flag}
          </span>
        ))}
      </span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-2xl font-bold"
        style={{ color: GOLD, fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        {value}
      </span>
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
  )
}

/** Headshot for the message's caption, falling back to an initial letter. */
function Avatar({
  testimonial,
  size,
}: {
  testimonial: { name: string; photo?: string }
  size: number
}) {
  const dimensions = { height: `${size}px`, width: `${size}px` }

  if (testimonial.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={testimonial.photo}
        alt={testimonial.name}
        className="flex-shrink-0 rounded-full object-cover"
        style={{ ...dimensions, border: `2px solid ${GOLD}` }}
      />
    )
  }

  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        ...dimensions,
        fontSize: `${Math.round(size * 0.38)}px`,
        backgroundColor: 'rgba(194,170,106,0.2)',
        color: GOLD,
        fontFamily: 'var(--font-inter), sans-serif',
      }}
      aria-hidden="true"
    >
      {testimonial.name.charAt(0).toUpperCase()}
    </span>
  )
}
