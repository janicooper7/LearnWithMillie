'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import gsap from 'gsap'
import { studentFaq as faqs } from '@/lib/studentFaq'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const answerRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    answerRefs.current = answerRefs.current.slice(0, faqs.length)
    answerRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { height: 0, opacity: 0, display: 'none' })
      }
    })
  }, [])

  const handleToggle = (indexToToggle: number) => {
    const isMobile = window.innerWidth < 768

    if (openIndex === indexToToggle) {
      const elToClose = answerRefs.current[indexToToggle]
      if (elToClose) {
        if (isMobile) {
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

      const elToOpen = answerRefs.current[indexToToggle]
      if (elToOpen) {
        setOpenIndex(indexToToggle)
        gsap.set(elToOpen, { display: 'block', height: 'auto' })
        const autoHeight = elToOpen.scrollHeight

        if (isMobile) {
          gsap.set(elToOpen, { height: autoHeight, opacity: 1 })
        } else {
          gsap.fromTo(
            elToOpen,
            { height: 0, opacity: 0 },
            { height: autoHeight, opacity: 1, duration: 0.3, ease: 'power1.inOut' }
          )
        }
      }
    }
  }

  return (
    <section className='section-padding bg-white' id='faq'>
      <div className='container'>
        <div className='max-w-3xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-14'>
            <div className='flex items-center justify-center gap-3 mb-6'>
              <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }}></div>
              <span
                className='text-xs uppercase tracking-[0.25em] font-medium'
                style={{ color: '#1F3A34', opacity: 0.6 }}
              >
                Got Questions?
              </span>
              <div className='h-px w-10' style={{ backgroundColor: '#C2AA6A' }}></div>
            </div>
            <h2 className='heading-lg' style={{ color: '#1F3A34' }}>
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Items */}
          <dl className='space-y-3'>
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className='rounded-xl border overflow-hidden transition-all duration-300'
                style={{
                  borderColor: openIndex === index ? 'rgba(31,58,52,0.2)' : '#EDE4D8',
                  backgroundColor: openIndex === index ? 'rgba(31,58,52,0.03)' : 'white',
                }}
              >
                <dt>
                  <button
                    onClick={() => handleToggle(index)}
                    className='flex w-full items-start justify-between text-left px-6 py-5 transition-colors duration-200'
                  >
                    <span
                      className='text-base font-semibold leading-relaxed pr-4'
                      style={{ color: '#1F3A34' }}
                    >
                      {faq.question}
                    </span>
                    <span
                      className='flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 transition-all duration-200'
                      style={{
                        backgroundColor: openIndex === index ? '#1F3A34' : 'rgba(31,58,52,0.08)',
                      }}
                    >
                      {openIndex === index ? (
                        <MinusIcon className='h-3.5 w-3.5 text-white' aria-hidden='true' />
                      ) : (
                        <PlusIcon className='h-3.5 w-3.5' style={{ color: '#1F3A34' }} aria-hidden='true' />
                      )}
                    </span>
                  </button>
                </dt>
                <dd
                  ref={(el) => {
                    answerRefs.current[index] = el
                  }}
                  className='overflow-hidden'
                >
                  <div
                    className='px-6 pb-5 text-sm leading-7'
                    style={{ color: '#1F3A34', opacity: 0.7 }}
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
