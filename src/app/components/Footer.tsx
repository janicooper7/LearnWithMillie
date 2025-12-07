'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    e.preventDefault()
    if (isHomePage) {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        const headerOffset = 80
        const padding = 50
        const elementPosition = element.offsetTop
        const offsetPosition = elementPosition - headerOffset - padding
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    } else {
      router.push(`/${hash}`)
    }
  }

  return (
    <footer className='bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
      <div className='container py-20'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Brand */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-center space-x-3'>
              <div className='relative w-12 h-12 flex items-center justify-center'>
                <div className='absolute inset-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg rotate-45'></div>
                <span className='relative z-10 text-xl font-bold text-white'>
                  i
                </span>
              </div>
              <span className='text-3xl font-bold'>Fluentify</span>
            </div>
            <p className='text-gray-300 text-lg leading-relaxed max-w-md'>
              Connecting worlds through words. Professional English tutoring
              tailored to your needs with personalized attention and flexible
              scheduling.
            </p>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-gray-300 font-medium'>
                Available for new students
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h4 className='text-xl font-bold text-white'>Quick Links</h4>
            <ul className='space-y-4'>
              {[
                { name: 'About', hash: '#about' },
                { name: 'Services', hash: '#lesson-options' },
                { name: 'Testimonials', hash: '#testimonials' },
                { name: 'Pricing', hash: '#pricing' },
                { name: 'Contact', hash: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={isHomePage ? link.hash : `/${link.hash}`}
                    onClick={(e) => handleLinkClick(e, link.hash)}
                    className='text-gray-300 hover:text-primary transition-colors duration-200 font-medium'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className='space-y-6'>
            <h4 className='text-xl font-bold text-white'>Services</h4>
            <ul className='space-y-4'>
              {[
                'Business English',
                'Conversational English',
                'Interview Preparation',
              ].map((service) => (
                <li key={service}>
                  <a
                    href={isHomePage ? '#lesson-options' : '/#lesson-options'}
                    onClick={(e) => handleLinkClick(e, '#lesson-options')}
                    className='text-gray-300 hover:text-primary transition-colors duration-200 font-medium'
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className='mt-16 pt-8 border-t border-gray-700'>
          <div className='text-center'>
            <p className='text-gray-400 mb-2'>
              © {new Date().getFullYear()} Fluentify. All rights reserved.
            </p>
            <p className='text-gray-500 text-sm'>
              Website maintained by:{' '}
              <a
                href='https://aiwebhouse.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-primary transition-colors duration-200 underline'
              >
                aiwebhouse.com
              </a>
            </p>
          </div>

          {/* Trust indicators */}
          <div className='mt-8 pt-6 border-t border-gray-700'>
            <div className='flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>TEFL Certified</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span>London Based</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                <span>DBS Checked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
