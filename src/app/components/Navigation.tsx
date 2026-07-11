'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const studentItems = [
  {
    name: 'Meet Millie',
    href: '/about',
    hash: '',
    description: 'Get to know your tutor',
  },
  {
    name: 'How it works',
    href: '/students',
    hash: '#how-it-works',
    description: 'Understand the lesson process',
  },
  {
    name: 'Services',
    href: '/students',
    hash: '#lesson-options',
    description: 'Explore lesson options',
  },
  {
    name: 'Pricing',
    href: '/students',
    hash: '#pricing',
    description: 'Simple, transparent plans',
  },
  {
    name: 'Testimonials',
    href: '/students',
    hash: '#testimonials',
    description: 'Hear from other students',
  },
  {
    name: 'FAQ',
    href: '/students',
    hash: '#faq',
    description: 'Common questions answered',
  },
]

const teacherItems = [
  {
    name: 'Meet Millie',
    href: '/teachers',
    hash: '',
    description: 'Get to know your mentor',
  },
  {
    name: 'All Products',
    href: '/teachers/products',
    hash: '',
    description: 'Courses, mentorship & tools',
  },
  {
    name: 'Testimonials',
    href: '/teachers',
    hash: '#mentorship-testimonials',
    description: 'Hear from other teachers',
  },
  {
    name: 'Mentorship',
    href: '/teachers/mentorship',
    hash: '',
    description: "What's included",
  },
  {
    name: 'Courses',
    href: '/teachers/courses',
    hash: '',
    description: 'Learn at your own pace',
  },
  {
    name: 'Platform Finder',
    href: '/teachers/platform-finder',
    hash: '',
    description: 'Find your ideal teaching platform',
  },
  {
    name: 'Debate Generator',
    href: '/teachers/debategenerator',
    hash: '',
    description: 'Free ESL debate topics & vocab',
  },
]

type NavItem = { name: string; href: string; hash: string; description: string }

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<
    'students' | 'teachers' | null
  >(null)
  const [openDropdown, setOpenDropdown] = useState<
    'students' | 'teachers' | null
  >(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // Scroll listener — runs after hydration so initial render matches server
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openMenu(which: 'students' | 'teachers') {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(which)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  function navigate(item: NavItem) {
    setMobileOpen(false)
    setOpenDropdown(null)
    if (item.hash) {
      if (pathname !== item.href) {
        router.push(item.href + item.hash)
      } else {
        const el = document.getElementById(item.hash.replace('#', ''))
        if (el) window.scrollTo({ top: el.offsetTop - 130, behavior: 'smooth' })
      }
    } else {
      router.push(item.href)
    }
  }

  const isTeacherSection =
    pathname === '/teachers' ||
    pathname.startsWith('/teachers') ||
    pathname === '/teacher-materials'
  const isStudentSection =
    pathname === '/students' ||
    pathname.startsWith('/students') ||
    pathname === '/about'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm border-b border-[#1F3A34]/8' : ''
      }`}
      style={{ backgroundColor: '#F4EDE4' }}
    >
      <div className='container'>
        <div className='flex items-center justify-between h-[72px]'>
          {/* Logo */}
          <Link
            href='/'
            className='text-2xl font-bold tracking-tight flex-shrink-0'
            style={{
              color: '#1F3A34',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
          >
            LearnWithMillie
          </Link>

          {/* Desktop nav */}
          <div className='hidden md:flex items-center gap-1'>
            {/* For Students */}
            <div
              className='relative'
              onMouseEnter={() => openMenu('students')}
              onMouseLeave={scheduleClose}
            >
              <button
                className='flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200'
                style={{
                  color:
                    openDropdown === 'students' || isStudentSection
                      ? '#1F3A34'
                      : 'rgba(31,58,52,0.55)',
                }}
              >
                For Students
                <ChevronDown
                  className='w-3.5 h-3.5 transition-transform duration-200'
                  style={{
                    transform:
                      openDropdown === 'students' ? 'rotate(180deg)' : 'none',
                    color: '#C2AA6A',
                  }}
                />
              </button>

              {/* Dropdown */}
              <div
                className='absolute top-full left-1/2 pt-2'
                style={{
                  transform: 'translateX(-50%)',
                  pointerEvents: openDropdown === 'students' ? 'auto' : 'none',
                  opacity: openDropdown === 'students' ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  width: '420px',
                }}
                onMouseEnter={() => openMenu('students')}
                onMouseLeave={scheduleClose}
              >
                <div
                  className='rounded-2xl shadow-xl overflow-hidden'
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #EDE4D8',
                  }}
                >
                  <div className='p-2 grid grid-cols-2 gap-1'>
                    {studentItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => navigate(item)}
                        className='text-left px-4 py-3 rounded-xl transition-colors duration-150 hover:bg-[#F4EDE4] group'
                      >
                        <p
                          className='text-sm font-semibold'
                          style={{
                            color: '#1F3A34',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          className='text-xs mt-0.5'
                          style={{
                            color: 'rgba(31,58,52,0.5)',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                        >
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* For Teachers */}
            <div
              className='relative'
              onMouseEnter={() => openMenu('teachers')}
              onMouseLeave={scheduleClose}
            >
              <button
                className='flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200'
                style={{
                  color:
                    openDropdown === 'teachers' || isTeacherSection
                      ? '#1F3A34'
                      : 'rgba(31,58,52,0.55)',
                }}
              >
                For Teachers
                <ChevronDown
                  className='w-3.5 h-3.5 transition-transform duration-200'
                  style={{
                    transform:
                      openDropdown === 'teachers' ? 'rotate(180deg)' : 'none',
                    color: '#C2AA6A',
                  }}
                />
              </button>

              {/* Dropdown */}
              <div
                className='absolute top-full left-1/2 pt-2'
                style={{
                  transform: 'translateX(-50%)',
                  pointerEvents: openDropdown === 'teachers' ? 'auto' : 'none',
                  opacity: openDropdown === 'teachers' ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  width: '340px',
                }}
                onMouseEnter={() => openMenu('teachers')}
                onMouseLeave={scheduleClose}
              >
                <div
                  className='rounded-2xl shadow-xl overflow-hidden'
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #EDE4D8',
                  }}
                >
                  <div className='p-2 grid grid-cols-2 gap-1'>
                    {teacherItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => navigate(item)}
                        className='text-left px-4 py-3 rounded-xl transition-colors duration-150 hover:bg-[#F4EDE4]'
                      >
                        <p
                          className='text-sm font-semibold'
                          style={{
                            color: '#1F3A34',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          className='text-xs mt-0.5'
                          style={{
                            color: 'rgba(31,58,52,0.5)',
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}
                        >
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className='mx-2 h-5 w-px'
              style={{ backgroundColor: 'rgba(31,58,52,0.15)' }}
            />

            {/* Auth */}
            {session ? (
              <div className='flex items-center gap-3'>
                <Link
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
                </Link>
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
                <Link
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
                </Link>
                <Link href='/auth/signup' className='btn-primary'>
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className='md:hidden inline-flex items-center justify-center rounded-lg p-2'
            style={{ color: '#1F3A34' }}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className='sr-only'>Toggle menu</span>
            {mobileOpen ? (
              <XMarkIcon className='h-5 w-5' />
            ) : (
              <Bars3Icon className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed left-4 right-4 top-[80px] transition-all duration-300 ease-in-out ${
          mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div
          className='rounded-2xl overflow-hidden shadow-xl'
          style={{
            backgroundColor: '#F4EDE4',
            border: '1px solid rgba(31,58,52,0.1)',
          }}
        >
          <div className='p-2'>
            {/* For Students accordion */}
            <button
              className='w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors'
              style={{
                color: '#1F3A34',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
              onClick={() =>
                setMobileExpanded((e) => (e === 'students' ? null : 'students'))
              }
            >
              For Students
              <ChevronDown
                className='w-4 h-4 transition-transform duration-200'
                style={{
                  color: '#C2AA6A',
                  transform:
                    mobileExpanded === 'students' ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>
            {mobileExpanded === 'students' && (
              <div className='pl-3 pb-1 space-y-0.5'>
                {studentItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item)}
                    className='w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-white/60'
                    style={{
                      color: 'rgba(31,58,52,0.75)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            {/* For Teachers accordion */}
            <button
              className='w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors'
              style={{
                color: '#1F3A34',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
              onClick={() =>
                setMobileExpanded((e) => (e === 'teachers' ? null : 'teachers'))
              }
            >
              For Teachers
              <ChevronDown
                className='w-4 h-4 transition-transform duration-200'
                style={{
                  color: '#C2AA6A',
                  transform:
                    mobileExpanded === 'teachers' ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>
            {mobileExpanded === 'teachers' && (
              <div className='pl-3 pb-1 space-y-0.5'>
                {teacherItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item)}
                    className='w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-white/60'
                    style={{
                      color: 'rgba(31,58,52,0.75)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile auth */}
          <div
            className='px-4 pb-4 pt-3'
            style={{ borderTop: '1px solid rgba(31,58,52,0.08)' }}
          >
            {session ? (
              <div className='space-y-2'>
                <Link
                  href={
                    session.user?.role === 'ADMIN' ? '/admin' : '/dashboard'
                  }
                  className='btn-primary w-full text-center block'
                  onClick={() => setMobileOpen(false)}
                >
                  {session.user?.role === 'ADMIN'
                    ? 'Admin Portal'
                    : 'My Account'}
                </Link>
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
                <Link
                  href='/auth/signup'
                  className='btn-primary w-full text-center block'
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
                <Link
                  href='/auth/login'
                  className='w-full text-center text-sm font-medium py-2 block'
                  style={{
                    color: 'rgba(31,58,52,0.55)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
