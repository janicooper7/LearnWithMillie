'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StarIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    name: 'Blanche Pearson',
    role: 'Marketing Manager',
    content:
      "Millie's teaching approach is exceptional. She helped me improve my business English significantly, which has been invaluable in my career.",
    rating: 5,
  },
  {
    name: 'Jonas Brauers',
    role: 'Software Developer',
    content:
      'The personalized attention and focus on technical vocabulary has made a huge difference in my ability to communicate with international colleagues.',
    rating: 5,
  },
  {
    name: 'Kristina Zasiadko',
    role: 'HR Professional',
    content:
      "Thanks to Millie's interview preparation sessions, I successfully landed my dream job at an international company.",
    rating: 5,
  },
]

export default function Testimonials() {
  const sectionRef = useRef(null)
  const testimonialsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Set elements to final state immediately on mobile
      testimonialsRef.current.forEach((testimonial) => {
        if (testimonial) {
          gsap.set(testimonial, { y: 0, opacity: 1 })
        }
      })
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    testimonialsRef.current.forEach((testimonial, index) => {
      gsap.fromTo(
        testimonial,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: testimonial,
            start: 'top bottom-=100',
            end: 'bottom center',
            // markers: true, // For debugging
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className='py-20 bg-white' id='testimonials'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='heading-lg mb-6'>Student Testimonials</h2>
          <p className='text-gray-600 text-lg'>
            Hear what my students have to say about their learning experience
            and achievements.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              ref={(el) => {
                if (el) testimonialsRef.current[index] = el
              }}
              className='bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className='h-5 w-5 text-yellow-400' />
                ))}
              </div>
              <p className='text-gray-600 mb-6'>
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <p className='font-semibold'>{testimonial.name}</p>
                <p className='text-gray-500 text-sm'>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
