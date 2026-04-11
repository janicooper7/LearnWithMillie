'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession, signOut } from 'next-auth/react'

const navigation = [
  { name: 'Meet your tutor', href: '/about', hash: '' },
  { name: 'Testimonials', href: '/', hash: '#testimonials' },
  { name: 'Services', href: '/', hash: '#lesson-options' },
  { name: 'FAQ', href: '/', hash: '#faq' },
  { name: 'Pricing', href: '/', hash: '#pricing' },
  { name: 'Teacher Materials', href: '/teacher-materials', hash: '' },
  { name: 'Contact me', href: '/contact', hash: '' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isNavigatingByClick, setIsNavigatingByClick] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'
  const { data: session } = useSession()

  const updateActiveSection = () => {
    if (!isHomePage) return
    if (isNavigatingByClick) return

    const sections = document.querySelectorAll('section[id]')
    const scrollPosition = window.scrollY + window.innerHeight * 0.2

    if (scrollPosition < window.innerHeight * 0.5) {
      setActiveSection('home')
      return
    }

    for (const section of sections) {
      const htmlSection = section as HTMLElement
      const sectionTop = htmlSection.offsetTop - window.innerHeight * 0.5
      const sectionHeight = htmlSection.offsetHeight

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        setActiveSection(htmlSection.id)
        return
      }
    }
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; hash: string },
  ) => {
    e.preventDefault()

    if (mobileMenuOpen) setMobileMenuOpen(false)

    if (item.href !== pathname) {
      router.push(item.hash ? item.href + item.hash : item.href)
      return
    }

    if (item.hash) {
      const targetId = item.hash.replace('#', '')
      setIsNavigatingByClick(true)

      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          const offsetPosition = element.offsetTop - 80 - 50
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          setActiveSection(targetId)
        }
        setTimeout(() => setIsNavigatingByClick(false), 1000)
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
    }
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      updateActiveSection()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    if (isHomePage && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const offsetPosition = element.offsetTop - 80 - 50
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          setActiveSection(hash)
        }
      }, 100)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const getIsActive = (item: (typeof navigation)[0]) => {
    if (item.href === '/teacher-materials' || item.href === '/about') {
      return pathname === item.href
    }
    if (isHomePage) {
      const targetSectionId =
        item.hash === '' ? 'home' : item.hash.replace('#', '')
      return activeSection === targetSectionId
    }
    return false
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'shadow-sm border-b border-[#1F3A34]/8' : ''
      }`}
      style={{ padding: '0', backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>
        <div className='flex items-center justify-between h-[72px]'>
          {/* Logo */}
          <a href='/' onClick={handleLogoClick} className='flex items-center'>
            <span
              className='text-2xl font-bold tracking-tight'
              style={{
                color: '#1F3A34',
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}
            >
              LearnWithMillie
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-1'>
            <nav className='flex items-center gap-1'>
              {navigation.map((item) => {
                const isActive = getIsActive(item)
                return (
                  <a
                    key={item.name}
                    href={item.href + item.hash}
                    onClick={(e) => handleNavClick(e, item)}
                    className='relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200'
                  >
                    {item.name}
                  </a>
                )
              })}
            </nav>

            {/* Divider */}
            <div
              className='mx-3 h-5 w-px'
              style={{ backgroundColor: 'rgba(31,58,52,0.15)' }}
            />

            {session ? (
              <div className='flex items-center gap-3'>
                <a
                  href={
                    session.user?.role === 'ADMIN' ? '/admin' : '/dashboard'
                  }
                  className='flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-lg transition-colors duration-200'
                  style={{
                    color: '#1F3A34',
                    backgroundColor: 'rgba(31,58,52,0.07)',
                  }}
                >
                  <div
                    className='w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0'
                    style={{ backgroundColor: '#1F3A34' }}
                  >
                    {session.user?.name?.[0]?.toUpperCase() ??
                      session.user?.email?.[0]?.toUpperCase()}
                  </div>
                  {session.user?.role === 'ADMIN' ? 'Admin' : 'My Account'}
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='text-[13px] font-medium transition-colors duration-200'
                  style={{ color: 'rgba(31,58,52,0.55)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      '#1F3A34'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      'rgba(31,58,52,0.55)'
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <a
                  href='/auth/login'
                  className='text-[13px] font-medium transition-colors duration-200'
                  style={{ color: 'rgba(31,58,52,0.55)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      '#1F3A34'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color =
                      'rgba(31,58,52,0.55)'
                  }}
                >
                  Log in
                </a>
                <a href='/auth/signup' className='btn-primary'>
                  Sign up
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type='button'
            className='md:hidden inline-flex items-center justify-center rounded-lg p-2 transition-colors duration-200'
            style={{ color: '#1F3A34' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className='sr-only'>Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className='h-5 w-5' aria-hidden='true' />
            ) : (
              <Bars3Icon className='h-5 w-5' aria-hidden='true' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed left-4 right-4 top-[80px] transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div
          className='rounded-2xl overflow-hidden shadow-xl'
          style={{
            backgroundColor: '#F4EDE4',
            border: '1px solid rgba(31,58,52,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className='p-2'>
            {navigation.map((item) => {
              const isActive = getIsActive(item)
              return (
                <a
                  key={item.name}
                  href={item.href + item.hash}
                  className='flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200'
                  style={{
                    color: isActive ? '#1F3A34' : 'rgba(31,58,52,0.65)',
                  }}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {isActive && (
                    <span
                      className='mr-2.5 text-[8px]'
                      style={{ color: '#C2AA6A' }}
                    >
                      ✦
                    </span>
                  )}
                  {item.name}
                </a>
              )
            })}
          </div>
          <div
            className='px-4 pb-4 pt-3'
            style={{ borderTop: '1px solid rgba(31,58,52,0.08)' }}
          >
            {session ? (
              <div className='space-y-2'>
                <a
                  href={
                    session.user?.role === 'ADMIN' ? '/admin' : '/dashboard'
                  }
                  className='btn-primary w-full text-center block'
                >
                  {session.user?.role === 'ADMIN'
                    ? 'Admin Portal'
                    : 'My Account'}
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='w-full text-center text-sm font-medium py-2'
                  style={{
                    color: 'rgba(31,58,52,0.55)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className='space-y-2'>
                <a
                  href='/auth/signup'
                  className='btn-primary w-full text-center block'
                >
                  Sign up
                </a>
                <a
                  href='/auth/login'
                  className='w-full text-center text-sm font-medium py-2 block'
                  style={{
                    color: 'rgba(31,58,52,0.55)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  Log in
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
