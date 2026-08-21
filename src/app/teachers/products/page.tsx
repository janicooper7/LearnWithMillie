import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PROMO, discountedPrice, isPromoActive } from '@/lib/promo'

export const metadata: Metadata = {
  title: 'All Teacher Products — Courses, Mentorship & Free Tools',
  description:
    'Browse everything for English teachers in one place — the BOOKED courses, one-on-one mentorship packages with Millie Cooper, the Platform Finder, and the Debate Generator.',
  openGraph: {
    title: 'All Teacher Products | LearnWithMillie',
    description:
      'Courses, mentorship packages, and classroom tools for English teachers — all in one place.',
    url: '/teachers/products',
  },
  alternates: {
    canonical: '/teachers/products',
  },
}

type Product = {
  eyebrow: string
  title: string
  description: string
  points: string[]
  href: string
  cta: string
  price?: string
  /** Pre-sale price, struck through beside `price`. Courses only. */
  listPrice?: string
  badge?: string
  featured?: boolean
}

// Course prices carry the site-wide sale — /api/checkout applies the code to
// the Stripe session, so what's shown here is what's actually charged.
const courses: Product[] = [
  {
    eyebrow: 'Course · Trilogy',
    title: 'BOOKED Trilogy',
    description:
      'All 3 courses — launch, fill, and keep your tutoring business thriving. The complete system, built across four years and 4,000+ lessons.',
    points: ['3 courses', '35 modules', 'Lifetime access'],
    href: '/teachers/courses',
    cta: 'See what’s inside',
    price: discountedPrice(149),
    listPrice: '$149',
    badge: 'Best value',
    featured: true,
  },
  {
    eyebrow: 'Course 1',
    title: 'GET READY',
    description:
      'How to set up your online English tutoring business — TEFL choice, platform applications, tech, rates, profile, and your intro video.',
    points: ['Beginner-friendly', 'Setup system', 'Watch anytime'],
    href: '/teachers/courses/get-ready',
    cta: 'See what’s inside',
    price: discountedPrice(49),
    listPrice: '$49',
  },
  {
    eyebrow: 'Course 2',
    title: 'GET BOOKED',
    description:
      'How to get students teaching English online — the 10 Holograms framework, the LMNOP method, and a 5-phase trial-lesson framework.',
    points: ['Marketing', 'Trial lessons', 'Watch anytime'],
    href: '/teachers/courses/get-booked',
    cta: 'See what’s inside',
    price: discountedPrice(79),
    listPrice: '$79',
  },
  {
    eyebrow: 'Course 3',
    title: 'STAY BOOKED',
    description:
      'How to build a calendar that stays full — the 50-minute lesson structure, retention systems, AI workflows, and the SCALE diagnostic.',
    points: ['Lesson craft', 'Retention', 'Watch anytime'],
    href: '/teachers/courses/stay-booked',
    cta: 'See what’s inside',
    price: discountedPrice(59),
    listPrice: '$59',
  },
]

const mentorship: Product[] = [
  {
    eyebrow: 'Mentorship',
    title: 'Single Session',
    description:
      'One 50-minute one-on-one session with Millie — try it and see how it feels, with personalised feedback and resource recommendations.',
    points: ['1 × 50-min session', 'Personalised feedback', 'Resource recs'],
    href: '/teachers/mentorship#mentorship-pricing',
    cta: 'Apply now',
    price: '$50',
  },
  {
    eyebrow: 'Mentorship',
    title: 'Double Session',
    description:
      'Two 50-minute one-on-one sessions — build on your first session with focused follow-up on lesson design and your teaching voice.',
    points: ['2 × 50-min sessions', 'Personalised feedback', 'Resource recs'],
    href: '/teachers/mentorship#mentorship-pricing',
    cta: 'Apply now',
    price: '$95',
    badge: 'Most popular',
    featured: true,
  },
  {
    eyebrow: 'Mentorship',
    title: 'Triple Session',
    description:
      'Three 50-minute one-on-one sessions — the best value for focused development across your lessons, brand, and student retention.',
    points: ['3 × 50-min sessions', 'Personalised feedback', 'Resource recs'],
    href: '/teachers/mentorship#mentorship-pricing',
    cta: 'Apply now',
    price: '$140',
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
    price: '$5',
    featured: true,
  },
  {
    eyebrow: 'Teaching tool',
    title: 'Debate Generator',
    description:
      'Generate thought-provoking ESL debate topics and key vocabulary in seconds — instant speaking practice for any lesson.',
    points: ['Endless topics', 'Key vocabulary', 'Lifetime access'],
    href: '/teachers/debategenerator',
    cta: 'Try it now',
    price: '$7',
    featured: true,
  },
]

function ProductCard({ p }: { p: Product }) {
  const isDark = p.featured

  return (
    <Link
      key={p.title}
      href={p.href}
      className='group relative flex flex-col overflow-hidden rounded-3xl p-8 lg:p-9'
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
              color: isDark ? '#1F3A34' : '#1F3A34',
              backgroundColor: isDark
                ? '#C2AA6A'
                : 'rgba(194,170,106,0.2)',
              border: isDark
                ? '1px solid #C2AA6A'
                : '1px solid rgba(194,170,106,0.35)',
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
          fontSize: 'clamp(1.4rem, 2vw, 1.75rem)',
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

      {/* Footer — price + CTA */}
      <div className='relative z-10 mt-auto flex items-center justify-between gap-4'>
        <span
          className='inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-base font-semibold'
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
        {p.price && (
          <span className='flex items-baseline gap-2'>
            {p.listPrice && (
              <span
                className='text-base line-through'
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  color: isDark ? 'rgba(244,237,228,0.5)' : '#C0392B',
                }}
              >
                {p.listPrice}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                lineHeight: 1,
                color: isDark ? '#F4EDE4' : '#1F3A34',
              }}
            >
              {p.price}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}

function GroupHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className='mb-8'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
        <span
          className='text-xs uppercase tracking-[0.25em] font-medium'
          style={{
            color: 'rgba(31,58,52,0.7)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {label}
        </span>
      </div>
      <h2
        className='heading-lg'
        style={{
          color: '#1F3A34',
          fontFamily: 'var(--font-playfair), Georgia, serif',
        }}
      >
        {title}
      </h2>
    </div>
  )
}

export default function TeacherProductsPage() {
  return (
    <section className='section-padding' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>
        {/* Page header */}
        <div className='mb-16'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
            <span
              className='text-xs uppercase tracking-[0.25em] font-medium'
              style={{
                color: 'rgba(31,58,52,0.7)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              For Teachers
            </span>
          </div>
          <h1
            className='heading-xl mb-5 w-full'
            style={{
              color: '#1F3A34',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
          >
            Everything for teachers, in one place
          </h1>
          <p
            className='text-base leading-relaxed max-w-2xl'
            style={{
              color: 'rgba(31,58,52,0.65)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Self-paced courses, one-on-one mentorship with Millie, and handy
            classroom tools — pick what fits where you are in your teaching
            journey.
          </p>
        </div>

        {/* Courses */}
        <GroupHeading label='Self-paced' title='Courses' />
        {isPromoActive() && (
          <p
            className='-mt-4 mb-8 text-sm font-semibold'
            style={{ color: '#C0392B', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {PROMO.percentOff}% off every course — discount applied automatically at checkout
          </p>
        )}
        <div className='grid md:grid-cols-2 gap-5'>
          {courses.map((p) => (
            <ProductCard key={p.title} p={p} />
          ))}
        </div>

        {/* Mentorship */}
        <div className='mt-20'>
          <GroupHeading label='Coaching' title='Mentorship packages' />
          <div className='grid md:grid-cols-3 gap-5'>
            {mentorship.map((p) => (
              <ProductCard key={p.title} p={p} />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className='mt-20'>
          <GroupHeading label='Teaching tools' title='Tools to make teaching easier' />
          <div className='grid md:grid-cols-2 gap-5'>
            {tools.map((p) => (
              <ProductCard key={p.title} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
