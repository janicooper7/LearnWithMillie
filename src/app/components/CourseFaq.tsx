'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { courseFaq } from '@/lib/courseFaq'

// Objection handling, in scannable form. Same open/close mechanics as
// CourseContentAccordion so the two sections behave identically on the page.
// The first question is open by default so the section never reads as an
// undifferentiated stack of closed bars.
export default function CourseFaq() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]))

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div style={{ border: '1px solid #E2D6C4' }} className="overflow-hidden rounded-lg">
      {courseFaq.map((item, idx) => {
        const isOpen = open.has(idx)
        return (
          <div key={item.question} style={{ borderTop: idx === 0 ? 'none' : '1px solid #E2D6C4' }}>
            <h3>
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors md:px-5"
                style={{ backgroundColor: isOpen ? '#EFE6D8' : '#F4EDE4' }}
              >
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 transition-transform duration-300"
                  style={{ color: '#1F3A34', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                />
                <span
                  className="flex-1 text-sm font-semibold leading-snug md:text-base"
                  style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item.question}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div id={`faq-panel-${idx}`} className="bg-white px-4 pb-5 pt-4 md:px-5">
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
