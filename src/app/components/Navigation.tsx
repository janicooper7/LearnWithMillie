'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import gsap from 'gsap'

const navigation = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#lesson-options' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Debate Generator', href: '#debate-generator' },
  { name: 'FAQ', href: '#faq' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isNavigatingByClick, setIsNavigatingByClick] = useState(false)
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pathname = usePathname()

  const updateActiveSection = () => {
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
    href: string
  ) => {
    // If the href does not start with '#', it's an external link or a link to another page.
    // Allow the default browser behavior.
    if (!href.startsWith('#')) {
      // If mobile menu is open, close it.
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
      return // Allow default navigation
    }

    e.preventDefault()
    const targetId = href.replace('#', '')

    // Set the navigating flag
    setIsNavigatingByClick(true)

    if (targetId === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        const headerOffset = 72 // Height of the fixed header
        const padding = 50 // Additional padding from top
        const elementPosition = element.offsetTop
        const offsetPosition = elementPosition - headerOffset - padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })

        // Update active section immediately
        setActiveSection(targetId)
      }
    }

    // Reset the navigating flag after animation completes
    setTimeout(() => {
      setIsNavigatingByClick(false)
    }, 1000)

    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      updateActiveSection()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate underline when active section changes
  useEffect(() => {
    underlineRefs.current.forEach((ref, index) => {
      if (!ref) return

      const item = navigation[index]
      let itemIsActive
      if (item.href.startsWith('#')) {
        const targetSectionId =
          item.href === '#' ? 'home' : item.href.replace('#', '')
        itemIsActive = activeSection === targetSectionId
      } else {
        itemIsActive = pathname === item.href
      }

      gsap.to(ref, {
        scaleX: itemIsActive ? 1 : 0,
        duration: 0.4,
        ease: 'power2.inOut',
        transformOrigin: itemIsActive ? 'left center' : 'right center',
      })
    })
  }, [activeSection, pathname])

  return (
    <header className='fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white shadow-lg py-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <a
            href='#'
            className='group flex items-center space-x-2'
            onClick={(e) => handleNavClick(e, '#')}
          >
            <div className='relative'>
              <div className='w-10 h-10 bg-custom-pink rounded-lg rotate-45 transform transition-all duration-300 group-hover:rotate-[135deg] group-hover:scale-110' />
              <span className='absolute inset-0 flex items-center justify-center text-xl font-bold text-white rotate-[0deg] group-hover:rotate-[-360deg] transition-all duration-700'>
                i
              </span>
            </div>
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-gray-800' : 'text-gray-900'
              }`}
            >
              Fluentify
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-6'>
            <nav className='flex'>
              {navigation.map((item, index) => {
                let isActive
                if (item.href.startsWith('#')) {
                  const targetSectionId =
                    item.href === '#' ? 'home' : item.href.replace('#', '')
                  isActive = activeSection === targetSectionId
                } else {
                  isActive = pathname === item.href
                }
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-4 py-1.5 text-md font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    <span
                      ref={(el) => {
                        underlineRefs.current[index] = el
                      }}
                      className='absolute left-4 right-4 -bottom-1 h-0.5 bg-custom-pink origin-left'
                      style={{
                        transform: 'scaleX(0)',
                        opacity: 0.9,
                      }}
                    />
                  </a>
                )
              })}
            </nav>
            <a
              href='#contact'
              onClick={(e) => handleNavClick(e, '#contact')}
              className='px-5 py-2 text-lg font-medium text-white bg-custom-pink rounded-full shadow-sm hover:shadow-md hover:bg-opacity-90 hover:scale-105 transform transition-all duration-300'
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
          className={`md:hidden fixed left-0 right-0 top-[4rem] px-4 pt-2 pb-3 transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className='rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden'>
            <div className='space-y-1 p-2'>
              {navigation.map((item) => {
                let isActive
                if (item.href.startsWith('#')) {
                  const targetSectionId =
                    item.href === '#' ? 'home' : item.href.replace('#', '')
                  isActive = activeSection === targetSectionId
                } else {
                  isActive = pathname === item.href
                }
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2.5 text-base font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-custom-pink text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.name}
                  </a>
                )
              })}
              <div className='p-2'>
                <a
                  href='#contact'
                  className='block w-full px-6 py-2.5 text-base font-medium text-center text-white bg-custom-pink rounded-xl shadow-sm hover:bg-opacity-90 transition-all duration-300'
                  onClick={(e) => handleNavClick(e, '#contact')}
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
