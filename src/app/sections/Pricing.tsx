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
    <section ref={sectionRef} className='py-20 bg-gray-50' id='pricing'>
      <div className='container'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='heading-lg mb-6'>Available Plans</h2>
          <p className='text-gray-600 text-lg'>
            Choose the perfect plan for your learning journey. All plans include
            personalized attention and flexible scheduling.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full relative ${
                plan.name === 'Advanced'
                  ? 'border-2 border-custom-pink scale-105'
                  : ''
              }`}
            >
              {plan.name === 'Advanced' && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-custom-pink text-white px-4 py-1 rounded-full text-sm font-semibold'>
                  Most Popular
                </div>
              )}
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                <p className='text-gray-600 mb-4'>{plan.description}</p>
                <div className='flex items-end justify-center gap-1'>
                  <span
                    className={`text-4xl font-bold ${
                      plan.name === 'Advanced' ? 'text-custom-pink' : ''
                    }`}
                  >
                    £{plan.price}
                  </span>
                  <span className='text-gray-600 mb-1'>/ lesson</span>
                </div>
                <p className='text-sm text-gray-500 mt-2'>
                  £{plan.price * plan.lessons} per month
                </p>
              </div>

              <ul className='space-y-4 flex-grow'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start gap-3'>
                    <CheckIcon
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.name === 'Advanced'
                          ? 'text-custom-pink'
                          : 'text-green-500'
                      }`}
                    />
                    <span className='text-gray-600'>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className='mt-8 pt-6 border-t border-gray-100'>
                <a
                  href='#contact'
                  className={`block w-full py-3 px-6 text-center rounded-full text-white font-semibold transition-colors ${
                    plan.name === 'Advanced'
                      ? 'bg-custom-pink hover:bg-opacity-90 shadow-md hover:shadow-lg'
                      : 'bg-custom-pink hover:bg-opacity-90'
                  }`}
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
