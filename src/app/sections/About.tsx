'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function About() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Set elements to final state immediately on mobile
      if (textRef.current) {
        gsap.set(textRef.current, { x: 0, opacity: 1 })
      }
      if (imageRef.current) {
        gsap.set(imageRef.current, { x: 0, opacity: 1 })
      }
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
      },
    })

    tl.fromTo(
      textRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 }
    ).fromTo(
      imageRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 },
      '-=0.5'
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className='section-padding bg-gradient-to-br from-gray-50 to-white'
      id='about'
    >
      <div className='container'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          <div ref={textRef} className='space-y-8'>
            <div className='space-y-4'>
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold rounded-full text-sm mb-4'>
                Meet Your Guide
              </span>
              <h2 className='heading-lg text-gray-900'>Meet Your Tutor</h2>
              <h3 className='text-3xl md:text-4xl font-bold text-gradient-primary'>
                Millie Cooper
              </h3>
            </div>

            <div className='space-y-6'>
              <p className='text-xl text-gray-700 leading-relaxed'>
                Hello! I'm Millie, a certified TEFL teacher from London,
                passionate about helping students build confidence in their
                English skills.
              </p>
              <p className='text-lg text-gray-600 leading-relaxed'>
                With three years of experience teaching English online, I've
                worked with students from all over the world, tailoring lessons
                to their individual needs and goals. My teaching style is calm,
                supportive, and engaging—I want my lessons to be a safe space
                where you feel comfortable asking questions and making progress
                at your own pace.
              </p>
            </div>

            <div className='space-y-6'>
              <h4 className='text-2xl font-bold text-gray-900'>
                Qualifications
              </h4>
              <div className='grid gap-4'>
                {[
                  "Master's degree in Public Policy from UCL",
                  "Bachelor's degree in International Politics from King's College London",
                  'Certified TEFL Teacher',
                  '3+ years of online teaching experience',
                ].map((qualification, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-gray-100'
                  >
                    <div className='w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mt-3 flex-shrink-0'></div>
                    <span className='text-gray-700 font-medium'>
                      {qualification}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={imageRef} className='relative'>
            {/* Modern image container with floating elements */}
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl rotate-6'></div>
              <div className='absolute -inset-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl rotate-3'></div>

              <div className='relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group'>
                <Image
                  src='/images/aboutme.png'
                  alt='A photo of Millie, your English tutor, smiling warmly'
                  layout='fill'
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                  priority
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>

              {/* Floating badges */}
              <div className='absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 mr-8'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                  <span className='text-sm font-semibold text-gray-800'>
                    Available
                  </span>
                </div>
              </div>

              <div className='absolute -bottom-6 -left-6 bg-gradient-primary text-white rounded-2xl p-4 shadow-xl ml-8 mb-8'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>★</span>
                  </div>
                  <div>
                    <div className='text-sm font-bold'>5.0 Rating</div>
                    <div className='text-xs opacity-90'>TEFL Certified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
