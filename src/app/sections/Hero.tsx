'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Hero() {
  const heroRef = useRef(null)
  const textRef = useRef(null)
  const scrollIndicatorRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
    })

    tl.fromTo(
      textRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    ).fromTo(
      scrollIndicatorRef.current,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className='relative h-[100vh] w-full flex items-center justify-center -mt-[72px]'
    >
      {/* Background image with overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/Headerimage.png'
          alt='Woman teaching online from her home office'
          fill
          priority
          className='object-cover object-center'
          sizes='100vw'
          quality={90}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white' />
      </div>

      <div className='container mx-auto px-4 relative z-10 flex items-center justify-center'>
        <div ref={textRef} className='text-center space-y-6 max-w-4xl'>
          <h1 className='heading-xl bg-gradient-to-r from-custom-pink to-rose-300 bg-clip-text text-transparent pb-2'>
            Connecting <i>worlds</i> <br></br> through <i>words</i>
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto'>
            iFluentify Your English, You Empower Your Career
          </p>
          <div className='pt-8'>
            <a
              href='#contact'
              className='inline-block bg-custom-pink text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors'
            >
              Start your journey now
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }
      >
        <svg
          className='w-6 h-6 text-custom-pink animate-bounce cursor-pointer'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
        </svg>
      </div>
    </section>
  )
}
