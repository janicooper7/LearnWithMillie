import { Instagram } from 'lucide-react'
import { INSTAGRAM_URL, TIKTOK_URL } from '@/lib/social'
import ClimateBadge from './ClimateBadge'

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z' />
  </svg>
)

const studentLinks = [
  { name: 'Meet Millie', href: '/about' },
  { name: 'How it works', href: '/students#how-it-works' },
  { name: 'Services', href: '/students#lesson-options' },
  { name: 'Pricing', href: '/students#pricing' },
  { name: 'Testimonials', href: '/students#testimonials' },
  { name: 'FAQ', href: '/students#faq' },
]

const teacherLinks = [
  { name: 'Meet Millie', href: '/teachers' },
  { name: 'Mentorship', href: '/teachers/mentorship' },
  { name: 'Courses', href: '/teachers/courses' },
  { name: 'Testimonials', href: '/teachers#mentorship-testimonials' },
  { name: 'Platform Finder', href: '/teachers/platform-finder' },
  { name: 'Debate Generator', href: '/teachers/debategenerator' },
  { name: 'Teacher Materials', href: '/teacher-materials' },
]

const generalLinks = [
  { name: 'Contact', href: '/contact' },
  { name: 'Terms & Conditions', href: '/terms' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { name: string; href: string }[]
}) {
  return (
    <div className='space-y-6'>
      <h4
        className='text-base font-semibold uppercase tracking-widest'
        style={{
          color: 'rgba(31,58,52,0.65)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {title}
      </h4>
      <ul className='space-y-3'>
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className='text-sm transition-colors duration-200 hover:text-[#1F3A34]'
              style={{ color: 'rgba(31,58,52,0.7)' }}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#F4EDE4',
        borderTop: '1px solid rgba(31,58,52,0.1)',
      }}
    >
      <div className='container py-16 md:py-20'>
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-12'>
          {/* Brand */}
          <div className='lg:col-span-2 space-y-6'>
            <span
              className='text-2xl font-bold tracking-tight'
              style={{
                color: '#1F3A34',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}
            >
              LearnWithMillie
            </span>
            <p
              className='text-base leading-relaxed max-w-md'
              style={{ color: 'rgba(31,58,52,0.6)' }}
            >
              Connecting worlds through words. Personalised English lessons for
              students, and mentorship, courses and tools for the teachers who
              guide them.
            </p>

            <div className='space-y-3'>
              <p className='text-lg font-semibold uppercase tracking-widest'>
                Follow along
              </p>
              <div className='flex items-center gap-3'>
                <a
                  href={INSTAGRAM_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-px'
                  style={{
                    background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
                    color: '#fff',
                    boxShadow: '0 2px 12px rgba(238,42,123,0.3)',
                  }}
                >
                  <Instagram size={16} />
                  Instagram
                </a>
                <a
                  href={TIKTOK_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-px'
                  style={{
                    background: '#010101',
                    color: '#fff',
                    boxShadow: '0 2px 12px rgba(1,1,1,0.25)',
                  }}
                >
                  <TikTokIcon size={16} />
                  TikTok
                </a>
              </div>
            </div>

            {/* Climate initiative */}
            <ClimateBadge variant='inline' />
          </div>

          {/* For Students */}
          <FooterColumn title='For Students' links={studentLinks} />

          {/* For Teachers */}
          <FooterColumn title='For Teachers' links={teacherLinks} />

          {/* More */}
          <FooterColumn title='More' links={generalLinks} />
        </div>

        {/* Divider */}
        <div
          className='mt-16 pt-8'
          style={{ borderTop: '1px solid rgba(31,58,52,0.1)' }}
        >
          <div className='text-center space-y-3'>
            <p className='text-sm' style={{ color: 'rgba(31,58,52,0.65)' }}>
              © {new Date().getFullYear()} LearnWithMillie. All rights reserved.
            </p>
            <a
              href='/terms'
              className='text-xs transition-colors duration-200 hover:text-[#1F3A34]'
              style={{ color: 'rgba(31,58,52,0.5)' }}
            >
              Terms & Conditions
            </a>
            <p className='text-xs' style={{ color: 'rgba(31,58,52,0.7)' }}>
              Website maintained by:{' '}
              <a
                href='https://aiwebhouse.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-200 underline hover:text-[#1F3A34]'
                style={{ color: 'rgba(31,58,52,0.65)' }}
              >
                aiwebhouse.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
