'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import gsap from 'gsap'

const navigation = [
  { name: 'Services', href: '/', hash: '#lesson-options' },
  { name: 'Testimonials', href: '/', hash: '#testimonials' },
  { name: 'FAQ', href: '/', hash: '#faq' },
  { name: 'Pricing', href: '/', hash: '#pricing' },
  { name: 'Meet your tutor', href: '/about', hash: '' },
  { name: 'Debate Generator', href: '/debate-generator', hash: '' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isNavigatingByClick, setIsNavigatingByClick] = useState(false)
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  const updateActiveSection = () => {
    // Only update active section on home page
    if (!isHomePage) return

    // Skip scroll detection if we're currently navigating by click
    if (isNavigatingByClick) return

    // Get all section elements
    const sections = document.querySelectorAll('section[id]')
    const scrollPosition = window.scrollY + window.innerHeight * 0.2

    // Check if we're at the top for home section
    if (scrollPosition < window.innerHeight * 0.5) {
      setActiveSection('home')
      return
    }

    // Find the current section
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
    item: { href: string; hash: string }
  ) => {
    e.preventDefault()

    // Close mobile menu
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }

    // If navigating to a different page (e.g., /debate-generator)
    if (item.href !== pathname) {
      if (item.hash) {
        // Navigate to page with hash (e.g., /#about)
        router.push(item.href + item.hash)
      } else {
        // Navigate to page without hash
        router.push(item.href)
      }
      return
    }

    // If we're already on the target page, handle hash navigation
    if (item.hash) {
      const targetId = item.hash.replace('#', '')
      setIsNavigatingByClick(true)

      // Small delay to ensure page is ready
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          const headerOffset = 80
          const padding = 50
          const elementPosition = element.offsetTop
          const offsetPosition = elementPosition - headerOffset - padding

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })

          setActiveSection(targetId)
        }

        setTimeout(() => {
          setIsNavigatingByClick(false)
        }, 1000)
      }, 100)
    } else {
      // Navigate to top of page
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
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      updateActiveSection()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    // Handle hash navigation on page load
    if (isHomePage && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const headerOffset = 80
          const padding = 50
          const elementPosition = element.offsetTop
          const offsetPosition = elementPosition - headerOffset - padding
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
          setActiveSection(hash)
        }
      }, 100)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  // Animate underline when active section changes
  useEffect(() => {
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      underlineRefs.current.forEach((ref, index) => {
        if (!ref) return
        const item = navigation[index]
        let itemIsActive
        if (item.href === '/debate-generator' || item.href === '/about') {
          itemIsActive = pathname === item.href
        } else if (isHomePage) {
          const targetSectionId =
            item.hash === '' ? 'home' : item.hash.replace('#', '')
          itemIsActive = activeSection === targetSectionId
        } else {
          itemIsActive = false
        }
        // Set immediately without animation on mobile
        gsap.set(ref, {
          scaleX: itemIsActive ? 1 : 0,
          transformOrigin: itemIsActive ? 'left center' : 'right center',
        })
      })
      return
    }

    underlineRefs.current.forEach((ref, index) => {
      if (!ref) return

      const item = navigation[index]
      let itemIsActive
      if (item.href === '/debate-generator' || item.href === '/about') {
        itemIsActive = pathname === item.href
      } else if (isHomePage) {
        const targetSectionId =
          item.hash === '' ? 'home' : item.hash.replace('#', '')
        itemIsActive = activeSection === targetSectionId
      } else {
        itemIsActive = false
      }

      gsap.to(ref, {
        scaleX: itemIsActive ? 1 : 0,
        duration: 0.4,
        ease: 'power2.inOut',
        transformOrigin: itemIsActive ? 'left center' : 'right center',
      })
    })
  }, [activeSection, pathname, isHomePage])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100/50'
          : 'bg-white/80 backdrop-blur-sm shadow-lg'
      } py-4`}
    >
      <div className='container'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <a
            href='/'
            className='group flex items-center space-x-3'
            onClick={handleLogoClick}
          >
            <div className='relative w-11 h-11 flex items-center justify-center'>
              <div className='absolute inset-0 w-11 h-11 bg-primary rounded-xl shadow-lg group-hover:shadow-xl rotate-45 transition-all duration-500 group-hover:rotate-[135deg] group-hover:scale-110' />
              <span className='relative z-10 text-xl font-bold text-white'>
                i
              </span>
            </div>
            <span
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-gray-900'
              }`}
            >
              Fluentify
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <nav className='flex items-center space-x-1'>
              {navigation.map((item, index) => {
                let isActive
                if (
                  item.href === '/debate-generator' ||
                  item.href === '/about'
                ) {
                  isActive = pathname === item.href
                } else if (isHomePage) {
                  const targetSectionId =
                    item.hash === '' ? 'home' : item.hash.replace('#', '')
                  isActive = activeSection === targetSectionId
                } else {
                  isActive = false
                }
                return (
                  <a
                    key={item.name}
                    href={item.href + item.hash}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`group relative px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    {/* Active underline - controlled by GSAP */}
                    <span
                      ref={(el) => {
                        underlineRefs.current[index] = el
                      }}
                      className='absolute left-1/2 right-1/2 -bottom-1 h-0.5 bg-primary origin-center rounded-full'
                      style={{
                        transform: 'scaleX(0) translateX(-50%)',
                        opacity: 0.9,
                      }}
                    />
                    {/* Hover underline - shows on hover when not active */}
                    {!isActive && (
                      <span className='absolute left-1/2 right-1/2 -bottom-1 h-0.5 bg-primary origin-center rounded-full scale-x-0 translate-x-[-50%] group-hover:scale-x-100 transition-transform duration-300' />
                    )}
                  </a>
                )
              })}
            </nav>
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              onClick={(e) => {
                e.preventDefault()
                if (isHomePage) {
                  handleNavClick(e, { href: '/', hash: '#contact' })
                } else {
                  router.push('/#contact')
                }
              }}
              className='btn-primary shadow-glow-lg hover:shadow-glow-lg'
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type='button'
            className={`md:hidden inline-flex items-center justify-center rounded-full p-2 transition-colors duration-300 ${
              mobileMenuOpen ? 'bg-gray-100' : ''
            } ${scrolled ? 'text-gray-600' : 'text-gray-900'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className='sr-only'>Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            ) : (
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed left-4 right-4 top-[5rem] transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className='rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/10 overflow-hidden'>
            <div className='space-y-1 p-3'>
              {navigation.map((item) => {
                let isActive
                if (
                  item.href === '/debate-generator' ||
                  item.href === '/about'
                ) {
                  isActive = pathname === item.href
                } else if (isHomePage) {
                  const targetSectionId =
                    item.hash === '' ? 'home' : item.hash.replace('#', '')
                  isActive = activeSection === targetSectionId
                } else {
                  isActive = false
                }
                return (
                  <a
                    key={item.name}
                    href={item.href + item.hash}
                    className={`block px-4 py-3 text-base font-medium rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item.name}
                  </a>
                )
              })}
              <div className='p-3'>
                <a
                  href={isHomePage ? '#contact' : '/#contact'}
                  className='btn-primary w-full text-center shadow-glow-lg hover:shadow-glow-lg'
                  onClick={(e) => {
                    e.preventDefault()
                    if (isHomePage) {
                      handleNavClick(e, { href: '/', hash: '#contact' })
                    } else {
                      router.push('/#contact')
                    }
                  }}
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
