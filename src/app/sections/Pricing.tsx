'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckIcon } from '@heroicons/react/24/solid'

const plans = [
  {
    name: 'Standard',
    price: 34,
    lessons: 4,
    description: 'Ideal for flexible learning',
    features: [
      '4 lessons per month',
      'Personalized lesson plans',
      'Progress tracking',
      'Learning materials included',
    ],
  },
  {
    name: 'Advanced',
    price: 32,
    lessons: 8,
    description: 'Perfect for steady progress',
    features: [
      '8 lessons per month',
      'Personalized lesson plans',
      'Progress tracking',
      'Learning materials included',
      'Priority scheduling',
    ],
  },
  {
    name: 'Pro',
    price: 30,
    lessons: 12,
    description: 'Best for intensive learning',
    features: [
      '12 lessons per month',
      'Personalized lesson plans',
      'Progress tracking',
      'Learning materials included',
      'Priority scheduling',
      'Email support between lessons',
    ],
  },
]

export default function Pricing() {
  const sectionRef = useRef(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Set elements to final state immediately on mobile
      cardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, { y: 0, opacity: 1 })
        }
      })
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'bottom center',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className='section-padding bg-gray-50'
      id='pricing'
    >
      <div className='container'>
        <div className='text-center max-w-4xl mx-auto mb-20'>
          <span className='inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-6'>
            Pricing Plans
          </span>
          <h2 className='heading-lg text-gray-900 mb-8'>Available Plans</h2>
          <p className='text-xl text-gray-600 leading-relaxed'>
            Choose the perfect plan for your learning journey. All plans include
            personalized attention and flexible scheduling.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className='card group relative overflow-visible'
            >
              {/* Most Popular Badge */}
              {plan.name === 'Advanced' && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-gradient-primary text-white font-bold rounded-full text-xs uppercase tracking-wide shadow-lg'>
                  Most Popular
                </div>
              )}
              <div className='p-8 lg:p-10'>
                {/* Header */}
                <div className='text-center mb-8'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    {plan.name}
                  </h3>
                  <p className='text-gray-600 mb-6'>{plan.description}</p>

                  <div className='space-y-2 mb-8'>
                    <div className='flex items-end justify-center gap-1'>
                      <span className='text-5xl font-bold text-gradient-primary'>
                        £{plan.price}
                      </span>
                      <span className='text-gray-600 mb-2'>/ lesson</span>
                    </div>
                    <p className='text-lg font-semibold text-gray-500'>
                      £{plan.price * plan.lessons} per month
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className='space-y-4 mb-8'>
                  {plan.features.map((feature) => (
                    <div key={feature} className='flex items-start gap-3'>
                      <div className='flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-primary text-white'>
                        <CheckIcon className='h-4 w-4' />
                      </div>
                      <span className='text-gray-700 leading-relaxed'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div>
                  <a
                    href='#contact'
                    className='btn-primary block w-full py-4 px-6 text-center rounded-2xl font-bold text-lg transition-all duration-300 shadow-glow-lg hover:shadow-glow-lg'
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
