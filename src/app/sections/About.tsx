'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const approach = [
  {
    number: '01',
    title: 'Personalised Lessons',
    body: 'Every lesson is built around your goals, your level, and your learning style — not a generic template.',
  },
  {
    number: '02',
    title: 'Supportive Environment',
    body: 'A relaxed, judgment-free space where you feel confident making mistakes and asking questions freely.',
  },
  {
    number: '03',
    title: 'Real-World Topics',
    body: 'We practice through relevant scenarios — interviews, presentations, everyday conversation — things you actually use.',
  },
  {
    number: '04',
    title: 'Support Between Sessions',
    body: 'Detailed lesson notes, vocabulary lists, and open communication between sessions keep your progress moving.',
  },
]

const credentials = [
  { label: 'TEFL Certified', sub: 'Qualified Teacher' },
  { label: 'UCL Master\'s', sub: 'Public Policy' },
  { label: "King's College", sub: 'International Politics' },
  { label: '4+ Years', sub: 'Online Teaching' },
]

const aboutSections = [
  {
    title: 'My Qualifications & Background',
    content: (
      <div className='space-y-4'>
        <p className='leading-relaxed'>
          I hold a Master's in Public Policy from UCL (University College London) and a Bachelor's in
          International Politics from King's College London. These academic foundations, combined with
          my professional experience in local government, management, and accounting, give me a unique
          perspective on business communication and professional development.
        </p>
        <p className='leading-relaxed'>
          I am a TEFL certified teacher with four years of experience teaching English online. I
          specialise in Business English, interview preparation, and helping learners improve fluency,
          pronunciation, and confidence in both professional and everyday conversations.
        </p>
        <p className='leading-relaxed'>
          My real-world experience in various professional settings means I can help you navigate the
          specific language challenges you face in your career, from business terminology to mastering
          professional small talk.
        </p>
      </div>
    ),
  },
  {
    title: 'My Teaching Philosophy',
    content: (
      <div className='space-y-4'>
        <p className='leading-relaxed'>
          Learning English should be enjoyable, engaging, and easygoing. I believe that when you're
          having fun and feeling comfortable, you learn more effectively. That's why I create a positive
          and supportive space where you can build confidence without fear of judgment.
        </p>
        <p className='leading-relaxed'>
          My teaching style is warm, encouraging, and tailored to your needs. I provide all materials
          for fun and engaging lessons — no textbooks or extra resources required.
        </p>
        <p className='leading-relaxed'>
          Outside of teaching, I enjoy reading, travelling, and writing books. These passions keep me
          curious and help me bring fresh perspectives and interesting topics into our lessons.
        </p>
        <p className='leading-relaxed font-medium'>
          Book your first lesson today — I look forward to helping you achieve your goals!
        </p>
      </div>
    ),
  },
]

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // The YouTube embed is only mounted once someone presses play — see the
  // video block below for why.
  const [videoPlaying, setVideoPlaying] = useState(false)
  const answerRefs = useRef<Array<HTMLElement | null>>([])
  const sectionRef = useRef(null)

  useEffect(() => {
    answerRefs.current = answerRefs.current.slice(0, aboutSections.length)
    answerRefs.current.forEach((el) => {
      if (el) gsap.set(el, { height: 0, opacity: 0, display: 'none' })
    })

    const isMobile = window.innerWidth < 768
    if (isMobile) return

    gsap.registerPlugin(ScrollTrigger)
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  const handleToggle = (idx: number) => {
    const isMobile = window.innerWidth < 768

    if (openIndex === idx) {
      const el = answerRefs.current[idx]
      if (el) {
        if (isMobile) {
          gsap.set(el, { display: 'none', height: 0, opacity: 0 })
        } else {
          gsap.to(el, {
            height: 0, opacity: 0, duration: 0.3, ease: 'power1.inOut',
            onComplete: () => { gsap.set(el, { display: 'none' }) },
          })
        }
      }
      setOpenIndex(null)
    } else {
      if (openIndex !== null) {
        const prev = answerRefs.current[openIndex]
        if (prev) {
          if (isMobile) {
            gsap.set(prev, { display: 'none', height: 0, opacity: 0 })
          } else {
            gsap.to(prev, {
              height: 0, opacity: 0, duration: 0.3, ease: 'power1.inOut',
              onComplete: () => { gsap.set(prev, { display: 'none' }) },
            })
          }
        }
      }
      const el = answerRefs.current[idx]
      if (el) {
        setOpenIndex(idx)
        gsap.set(el, { display: 'block', height: 'auto' })
        const h = el.scrollHeight
        if (isMobile) {
          gsap.set(el, { height: h, opacity: 1 })
        } else {
          gsap.fromTo(el, { height: 0, opacity: 0 }, { height: h, opacity: 1, duration: 0.3, ease: 'power1.inOut' })
        }
      }
    }
  }

  return (
    <section ref={sectionRef} id='about' style={{ backgroundColor: '#F4EDE4' }}>

      {/* ── Hero split ── */}
      <div className='container section-padding'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>

          {/* Left — photo */}
          <div className='relative hidden lg:block'>
            <div className='relative mx-auto' style={{ maxWidth: '420px' }}>
              {/* Gold vertical accent */}
              <div
                className='absolute rounded-full'
                style={{ left: '-20px', top: '10%', bottom: '10%', width: '2px', backgroundColor: '#C2AA6A', opacity: 0.55 }}
              />
              {/* Offset green block */}
              <div
                className='absolute rounded-2xl'
                style={{ top: '22px', left: '22px', right: '-22px', bottom: '-22px', backgroundColor: '#1F3A34', zIndex: 1 }}
              />
              {/* Photo */}
              <div className='relative rounded-2xl overflow-hidden' style={{ aspectRatio: '3/4', zIndex: 2 }}>
                <Image
                  src='/images/aboutme.png'
                  alt='Millie — English Tutor'
                  fill
                  className='object-cover object-top'
                  sizes='420px'
                  quality={75}
                />
                <div
                  className='absolute inset-0 pointer-events-none'
                  style={{ background: 'linear-gradient(to top, rgba(31,58,52,0.2) 0%, transparent 50%)' }}
                />
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Meet Your Tutor
              </span>
            </div>

            <h1
              className='heading-lg mb-5'
              style={{ color: '#1F3A34' }}
            >
              Hi, I&apos;m Millie
            </h1>

            <p className='text-lg leading-relaxed mb-4' style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}>
              A certified TEFL teacher from London, passionate about helping students speak English with real confidence.
            </p>
            <p className='text-base leading-relaxed mb-8' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
              With four years of experience teaching online, I tailor every lesson to your individual goals in a calm,
              supportive, and engaging environment. My background in management, local government, and accounting makes
              me especially effective for Business English learners.
            </p>

            {/* Credential chips */}
            <div className='flex flex-wrap gap-2.5 mb-8'>
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className='px-4 py-2.5 rounded-xl'
                  style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
                >
                  <p className='text-xs font-semibold' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {c.label}
                  </p>
                  <p className='text-[11px]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>

            <a href='/auth/signup' className='btn-primary inline-flex items-center gap-2'>
              Book Your First Lesson
              <ArrowRight className='w-4 h-4' />
            </a>
          </div>
        </div>
      </div>

      {/* ── Video ── */}
      <div style={{ backgroundColor: '#1F3A34' }}>
        <div className='container py-16 md:py-20'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-8'>
              <p
                className='text-xs uppercase tracking-[0.25em] font-medium mb-3'
                style={{ color: 'rgba(194,170,106,0.9)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Watch & Learn
              </p>
              <h2
                className='text-2xl md:text-3xl font-bold text-white'
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                See How I Teach
              </h2>
            </div>
            <div
              className='relative w-full rounded-2xl overflow-hidden shadow-2xl'
              style={{ paddingBottom: '56.25%', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* The YouTube player is ~576KB over the wire and nearly 2MB of
                  JavaScript once parsed — more than the rest of the page put
                  together. `loading="lazy"` does not help: the embed sits only
                  ~90px below the fold, well inside Chrome's lazy-load distance
                  threshold, so it loaded anyway. So it does not exist until
                  someone asks for it. The poster is served from our own domain,
                  which means a visitor who never presses play makes no request
                  to Google at all. */}
              {videoPlaying ? (
                <iframe
                  className='absolute top-0 left-0 w-full h-full'
                  src='https://www.youtube.com/embed/GevjT36pwJI?si=CasLXflYe670jtEJ&autoplay=1'
                  title='Millie teaching English'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                />
              ) : (
                <button
                  type='button'
                  onClick={() => setVideoPlaying(true)}
                  aria-label='Play video: Millie teaching English'
                  className='group absolute top-0 left-0 w-full h-full cursor-pointer'
                >
                  <Image
                    src='/images/about-video-poster.jpg'
                    alt=''
                    fill
                    sizes='(max-width: 768px) 100vw, 768px'
                    quality={75}
                    className='object-cover'
                  />
                  <span
                    className='absolute inset-0 transition-colors duration-200 group-hover:bg-black/10'
                    style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
                  />
                  <span className='absolute inset-0 flex items-center justify-center'>
                    <span
                      className='flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110'
                      style={{
                        width: '72px',
                        height: '72px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                      }}
                    >
                      <svg
                        width='26'
                        height='30'
                        viewBox='0 0 26 30'
                        aria-hidden='true'
                        style={{ marginLeft: '4px' }}
                      >
                        <path d='M0 0 L26 15 L0 30 Z' fill='#1F3A34' />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Teaching Approach ── */}
      <div className='container section-padding'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-8' style={{ backgroundColor: '#C2AA6A' }} />
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                How I Teach
              </span>
            </div>
            <h2 className='heading-lg' style={{ color: '#1F3A34' }}>
              My Approach
            </h2>
          </div>
          <p
            className='text-base leading-relaxed max-w-xs md:text-right'
            style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Every lesson is different — because every student is.
          </p>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          {approach.map((item) => (
            <div
              key={item.number}
              className='bg-white rounded-2xl p-7'
              style={{ border: '1px solid #EDE4D8' }}
            >
              <div className='flex items-start gap-4'>
                <span
                  className='text-[11px] font-bold flex-shrink-0 mt-0.5'
                  style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.08em' }}
                >
                  {item.number}
                </span>
                <div>
                  <h3
                    className='text-base font-semibold mb-2'
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className='text-sm leading-relaxed'
                    style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Learn More accordion ── */}
        <div className='mt-16'>
          <h2 className='heading-md mb-8' style={{ color: '#1F3A34' }}>
            Learn More About Me
          </h2>
          <div className='space-y-3'>
            {aboutSections.map((section, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className='rounded-xl border overflow-hidden transition-all duration-300'
                  style={{
                    borderColor: isOpen ? 'rgba(31,58,52,0.2)' : '#EDE4D8',
                    backgroundColor: isOpen ? 'rgba(31,58,52,0.03)' : 'white',
                  }}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className='flex w-full items-center justify-between text-left px-6 py-5 transition-colors duration-200'
                  >
                    <span className='text-base font-semibold leading-relaxed' style={{ color: '#1F3A34' }}>
                      {section.title}
                    </span>
                    <span
                      className='flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 ml-4 transition-all duration-200'
                      style={{ backgroundColor: isOpen ? '#1F3A34' : 'rgba(31,58,52,0.08)' }}
                    >
                      {isOpen
                        ? <MinusIcon className='h-3.5 w-3.5 text-white' aria-hidden='true' />
                        : <PlusIcon className='h-3.5 w-3.5' style={{ color: '#1F3A34' }} aria-hidden='true' />
                      }
                    </span>
                  </button>
                  <div ref={(el) => { answerRefs.current[index] = el }} className='overflow-hidden'>
                    <div
                      className='px-6 pb-6 text-sm leading-7'
                      style={{ color: 'rgba(31,58,52,0.72)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA block ── */}
        <div
          className='mt-16 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden'
          style={{ backgroundColor: '#1F3A34' }}
        >
          <div className='absolute top-0 left-0 right-0 h-0.5' style={{ backgroundColor: '#C2AA6A', opacity: 0.6 }} />
          <div className='relative z-10 text-center'>
            <h3
              className='text-2xl md:text-3xl font-bold mb-4'
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Ready to Start Your English Journey?
            </h3>
            <p
              className='text-base md:text-lg mb-8 max-w-xl mx-auto'
              style={{ opacity: 0.75, fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Whether you're improving business communication, preparing for an interview, or
              refining your everyday English — I'd love to help.
            </p>
            <a
              href='/auth/signup'
              className='inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium bg-white rounded-lg transition-all duration-200 hover:bg-[#F4EDE4]'
              style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Book Your First Lesson
              <ArrowRight className='w-4 h-4' />
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
