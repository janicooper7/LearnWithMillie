import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Product = {
  eyebrow: string
  title: string
  description: string
  points: string[]
  href: string
  cta: string
  badge?: string
  featured?: boolean
}

const products: Product[] = [
  {
    eyebrow: 'Coaching',
    title: 'Mentorship',
    description:
      'Work one-on-one with Millie to refine your lessons, find your teaching voice, and build a presence that keeps students coming back — built around where you are right now.',
    points: [
      'Lesson design',
      'Student-centred teaching',
      'Building your brand',
    ],
    href: '/teachers/mentorship',
    cta: 'Browse mentorship',
    featured: true,
  },
  {
    eyebrow: 'Self-paced',
    title: 'Courses',
    description:
      'On-demand courses that take you from getting hired to running lessons students love — learn at your own pace, on your own schedule.',
    points: ['Watch anytime', 'Step-by-step', 'Lifetime access'],
    href: '/teachers/courses',
    cta: 'Browse courses',
    featured: true,
  },
]

const tools: Product[] = [
  {
    eyebrow: 'Teaching tool',
    title: 'Platform Finder',
    description:
      'Answer 7 quick questions and see which of 33 online teaching platforms actually hire teachers like you — ranked by pay and fit.',
    points: ['33 platforms', '2-minute quiz', 'Ranked by fit'],
    href: '/teachers/platform-finder',
    cta: 'Find your platform',
    featured: true,
  },
  {
    eyebrow: 'Teaching tool',
    title: 'Debate Generator',
    description:
      'Generate thought-provoking ESL debate topics and key vocabulary in seconds — instant speaking practice for any lesson.',
    points: ['Endless topics', 'Key vocabulary', 'Classroom-ready'],
    href: '/teachers/debategenerator',
    cta: 'Try it now',
    featured: true,
  },
]

function ProductCard({ p }: { p: Product }) {
  const isDark = p.featured

  return (
    <Link
      key={p.title}
      href={p.href}
      className='group relative flex flex-col overflow-hidden rounded-3xl p-8 lg:p-10'
      style={{
        backgroundColor: isDark ? '#1F3A34' : '#FFFFFF',
        border: isDark ? '1px solid #1F3A34' : '1px solid #EDE4D8',
        boxShadow: '0 2px 12px -8px rgba(31,58,52,0.18)',
      }}
    >
      {/* Top row — dash + label + badge */}
      <div className='relative z-10 flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
          <span
            className='text-xs uppercase tracking-[0.22em] font-semibold'
            style={{
              color: isDark ? '#C2AA6A' : 'rgba(31,58,52,0.5)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {p.eyebrow}
          </span>
        </div>
        {p.badge && (
          <span
            className='px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em]'
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              color: '#1F3A34',
              backgroundColor: 'rgba(194,170,106,0.2)',
              border: '1px solid rgba(194,170,106,0.35)',
            }}
          >
            {p.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className='relative z-10 mb-3'
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          color: isDark ? '#F4EDE4' : '#1F3A34',
        }}
      >
        {p.title}
      </h3>

      {/* Description */}
      <p
        className='relative z-10 text-base leading-relaxed mb-6 max-w-md'
        style={{
          color: isDark ? 'rgba(244,237,228,0.78)' : 'rgba(31,58,52,0.7)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {p.description}
      </p>

      {/* Feature list */}
      <div className='relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 mb-8'>
        {p.points.map((point, i) => (
          <span key={point} className='inline-flex items-center gap-x-3'>
            {i > 0 && (
              <span
                aria-hidden
                style={{
                  color: isDark
                    ? 'rgba(244,237,228,0.35)'
                    : 'rgba(31,58,52,0.3)',
                }}
              >
                •
              </span>
            )}
            <span
              className='text-sm font-medium'
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                color: isDark ? 'rgba(244,237,228,0.7)' : 'rgba(31,58,52,0.6)',
              }}
            >
              {point}
            </span>
          </span>
        ))}
      </div>

      {/* CTA */}
      <span
        className='relative z-10 mt-auto inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold self-start'
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          letterSpacing: '0.02em',
          color: isDark ? '#1F3A34' : '#F4EDE4',
          backgroundColor: isDark ? '#C2AA6A' : '#1F3A34',
        }}
      >
        {p.cta}
        <ArrowRight className='w-4 h-4' />
      </span>
    </Link>
  )
}

export default function TeacherProducts() {
  return (
    <section
      id='teacher-products'
      className='section-padding'
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div
                className='h-px w-8'
                style={{ backgroundColor: '#C2AA6A' }}
              />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{
                  color: 'rgba(31,58,52,0.7)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                Mentorship &amp; Courses
              </span>
            </div>
            <h2
              className='heading-lg'
              style={{
                color: '#1F3A34',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}
            >
              Everything you need to grow
            </h2>
          </div>
          <p
            className='text-sm leading-relaxed max-w-xs md:text-right'
            style={{
              color: 'rgba(31,58,52,0.6)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Mentorship, courses, and free classroom tools — pick what fits where
            you are in your teaching journey.
          </p>
        </div>

        {/* Product grid */}
        <div className='grid md:grid-cols-2 gap-5'>
          {products.map((p) => (
            <ProductCard key={p.title} p={p} />
          ))}
        </div>

        {/* Useful tools */}
        <div className='mt-20 mb-10'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
            <span
              className='text-xs uppercase tracking-[0.25em] font-medium'
              style={{
                color: 'rgba(31,58,52,0.7)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Useful tools
            </span>
          </div>
          <h2
            className='heading-lg'
            style={{
              color: '#1F3A34',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
          >
            Tools to make teaching easier
          </h2>
        </div>

        <div className='grid md:grid-cols-2 gap-5'>
          {tools.map((p) => (
            <ProductCard key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
