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
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Set elements to final state immediately on mobile
      if (textRef.current) {
        gsap.set(textRef.current, { y: 0, opacity: 1 })
      }
      if (scrollIndicatorRef.current) {
        gsap.set(scrollIndicatorRef.current, { y: 0, opacity: 1 })
      }
      return
    }

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
      className='relative min-h-screen w-full flex items-center justify-center -mt-[80px] overflow-hidden'
      style={{ minHeight: '100vh' }}
    >
      {/* Background image with modern gradient overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/HeaderImage.png'
          alt='Woman teaching online from her home office'
          fill
          priority
          className='object-cover object-center scale-105 animate-pulse-slow'
          sizes='100%'
          quality={90}
        />
        <div className='absolute inset-0 bg-white/90' />
      </div>

      {/* Floating geometric shapes for modern feel */}
      <div className='absolute inset-0 z-5 overflow-hidden'>
        <div
          className='absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-2xl rotate-12 animate-float'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className='container relative z-10 flex items-center justify-center px-4'>
        <div ref={textRef} className='text-center space-y-8 max-w-3xl'>
          <div className='space-y-4'>
            <h1 className='heading-lg text-gray-900 leading-tight'>
              Professional English Tutoring
              <br />
              <span className='text-gradient-primary'>
                Tailored to Your Goals
              </span>
            </h1>
            <p className='text-lg md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed'>
              Transform your communication skills with personalized lessons in
              Business English, Conversational Fluency, and Interview
              Preparation
            </p>
          </div>

          <div className='pt-4'>
            <a
              href='#contact'
              className='btn-primary shadow-glow-lg hover:shadow-glow-lg text-lg px-10 py-5 rounded-2xl inline-block'
            >
              Start Learning Today
            </a>
          </div>
        </div>
      </div>

      {/* Modern scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 group cursor-pointer'
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }
      >
        <div className='flex flex-col items-center gap-3'>
          <span className='text-sm text-gray-500 font-medium group-hover:text-primary transition-colors'>
            Scroll to explore
          </span>
          <div className='w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center group-hover:border-primary transition-colors'>
            <div className='w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce group-hover:bg-primary'></div>
          </div>
        </div>
      </div>
    </section>
  )
}
