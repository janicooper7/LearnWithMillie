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
    <section ref={sectionRef} className='py-20 bg-white' id='about'>
      <div className='container'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div ref={textRef} className='space-y-6'>
            <h2 className='heading-lg'>Meet Your Tutor</h2>
            <h3 className='text-2xl font-semibold text-primary'>
              Millie Cooper
            </h3>
            <p className='text-gray-600'>
              Hello! I'm Millie, a certified TEFL teacher from London,
              passionate about helping students build confidence in their
              English skills.
            </p>
            <p className='text-gray-600'>
              With three years of experience teaching English online, I've
              worked with students from all over the world, tailoring lessons to
              their individual needs and goals. My teaching style is calm,
              supportive, and engaging—I want my lessons to be a safe space
              where you feel comfortable asking questions and making progress at
              your own pace.
            </p>
            <div className='space-y-4'>
              <h4 className='font-semibold text-lg'>Qualifications:</h4>
              <ul className='list-disc list-inside text-gray-600 space-y-2'>
                <li>Master's degree in Public Policy from UCL</li>
                <li>
                  Bachelor's degree in International Politics from King's
                  College London
                </li>
                <li>Certified TEFL Teacher</li>
                <li>3+ years of online teaching experience</li>
              </ul>
            </div>
          </div>
          <div
            ref={imageRef}
            className='relative w-full h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl group'
          >
            <Image
              src='/images/aboutme.png'
              alt='A photo of Millie, your English tutor, smiling warmly'
              layout='fill'
              className='object-cover rounded-lg shadow-xl'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
