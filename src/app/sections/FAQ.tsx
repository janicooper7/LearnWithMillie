'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import gsap from 'gsap'

const faqs = [
  {
    question: 'How can I pay for my subscription?',
    answer:
      "You can pay for your subscription via Paypal. If you set up an Automatic Payment on PayPal, your payments will automatically be taken at the same time every month- it's hassle free for you!",
  },
  {
    question:
      'How can I book a single lesson instead of buying the bundle/subscription?',
    answer:
      "If you wish to buy extra lessons separately please get in touch with me and I'll be happy to help! Whether you need a few extra lessons to prepare for an upcoming work presentation or job interview, we can find suitable dates and time to work together in achieving your goals.",
  },
  {
    question: 'Can I change my subscription plan?',
    answer:
      'You can upgrade or downgrade your plan anytime. If you are looking to increase your monthly lessons, or want to temporarily decrease them, just get in touch.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription anytime. Following the cancellation of your subscription, you will not be charged for the next month on your next billing date. You can still take lessons with the remaining balance.',
  },
  {
    question:
      'Do I have to schedule the same amount of lessons each week with a subscription?',
    answer:
      "Once you have paid for your monthly amount of lessons, you can schedule them anytime suitable for you. If you are away one week and wish to schedule two lessons for the previous week- that totally works too! <br/><br/>I would highly recommend having regular, weekly lessons for the most effective learning experience, but it's totally up to you!",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    // Ensure answerRefs array is initialized and has the correct length
    answerRefs.current = answerRefs.current.slice(0, faqs.length)
    // Initialize all answers to be closed
    answerRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { height: 0, opacity: 0, display: 'none' })
      }
    })
  }, []) // Runs once on mount

  const handleToggle = (indexToToggle: number) => {
    const isMobile = window.innerWidth < 768
    
    // If clicking the currently open item to close it
    if (openIndex === indexToToggle) {
      const elToClose = answerRefs.current[indexToToggle]
      if (elToClose) {
        if (isMobile) {
          // Instant on mobile
          gsap.set(elToClose, { display: 'none', height: 0, opacity: 0 })
          setOpenIndex(null)
        } else {
          gsap.to(elToClose, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.set(elToClose, { display: 'none' })
              setOpenIndex(null)
            },
          })
        }
      }
    } else {
      // Opening a new item (or switching)
      // Close the currently open item first (if any)
      if (openIndex !== null) {
        const currentOpenEl = answerRefs.current[openIndex]
        if (currentOpenEl) {
          if (isMobile) {
            gsap.set(currentOpenEl, { display: 'none', height: 0, opacity: 0 })
          } else {
            gsap.to(currentOpenEl, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.set(currentOpenEl, { display: 'none' })
              },
            })
          }
        }
      }

      // Open the new item
      const elToOpen = answerRefs.current[indexToToggle]
      if (elToOpen) {
        setOpenIndex(indexToToggle) // Update state to reflect the item that is now "active"
        gsap.set(elToOpen, { display: 'block', height: 'auto' }) // Make visible and set height to auto to measure
        const autoHeight = elToOpen.scrollHeight // Get the full height
        
        if (isMobile) {
          // Instant on mobile
          gsap.set(elToOpen, { height: autoHeight, opacity: 1 })
        } else {
          gsap.fromTo(
            elToOpen,
            { height: 0, opacity: 0 }, // Start from height 0 and faded out
            {
              height: autoHeight,
              opacity: 1,
              duration: 0.3,
              ease: 'power1.inOut',
            } // Animate to autoHeight and faded in
          )
        }
      }
    }
  }

  return (
    <div className='bg-white py-16 sm:py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl divide-y divide-gray-900/10'>
          <h2 className='text-3xl font-bold leading-10 tracking-tight text-gray-900 text-center mb-12'>
            Frequently Asked Questions
          </h2>
          <dl className='mt-10 space-y-6 divide-y divide-gray-900/10'>
            {faqs.map((faq, index) => (
              <div key={faq.question} className='pt-6'>
                <dt>
                  <button
                    onClick={() => handleToggle(index)}
                    className='flex w-full items-start justify-between text-left text-gray-900'
                  >
                    <span className='text-lg font-semibold leading-7'>
                      {faq.question}
                    </span>
                    <span className='ml-6 flex h-7 items-center'>
                      {openIndex === index ? (
                        <MinusIcon className='h-6 w-6' aria-hidden='true' />
                      ) : (
                        <PlusIcon className='h-6 w-6' aria-hidden='true' />
                      )}
                    </span>
                  </button>
                </dt>
                <dd
                  ref={(el) => {
                    answerRefs.current[index] = el
                  }}
                  className='mt-2 pr-12 overflow-hidden'
                >
                  <div
                    className='pb-4 text-base leading-7 text-gray-600'
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
