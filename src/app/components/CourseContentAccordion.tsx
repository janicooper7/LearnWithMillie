'use client'

import { useState } from 'react'
import { ChevronDown, PlayCircle } from 'lucide-react'
import { courseSales, trilogyOrder } from '@/lib/courseSalesContent'

// Udemy-style "Course content" accordion. Each of the three courses is a
// collapsible section; expanding reveals its module list.
export default function CourseContentAccordion() {
  const totalModules = trilogyOrder.reduce(
    (acc, s) => acc + courseSales[s].modules.length,
    0
  )

  const [open, setOpen] = useState<Set<string>>(new Set([trilogyOrder[0]]))
  const allOpen = open.size === trilogyOrder.length

  const toggle = (s: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })

  const toggleAll = () =>
    setOpen(allOpen ? new Set() : new Set(trilogyOrder))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-sm"
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          3 courses · {totalModules} modules · ~350 min total length
        </p>
        <button
          onClick={toggleAll}
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {allOpen ? 'Collapse all sections' : 'Expand all sections'}
        </button>
      </div>

      <div style={{ border: '1px solid #E2D6C4' }} className="overflow-hidden rounded-lg">
        {trilogyOrder.map((slug, idx) => {
          const c = courseSales[slug]
          const isOpen = open.has(slug)
          return (
            <div
              key={slug}
              style={{ borderTop: idx === 0 ? 'none' : '1px solid #E2D6C4' }}
            >
              <button
                onClick={() => toggle(slug)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors md:px-5"
                style={{ backgroundColor: isOpen ? '#EFE6D8' : '#F4EDE4' }}
              >
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 transition-transform duration-300"
                  style={{
                    color: '#1F3A34',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
                <span className="flex-1">
                  <span
                    className="block text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {c.courseNumber} — {c.label}
                  </span>
                  <span
                    className="mt-0.5 block text-sm font-semibold leading-snug md:text-base"
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {c.tagline}
                  </span>
                </span>
                <span
                  className="hidden flex-shrink-0 text-xs sm:block"
                  style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {c.modules.length} modules
                </span>
              </button>

              {isOpen && (
                <ul className="bg-white px-4 pb-3 pt-1 md:px-5">
                  {c.modules.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-2.5"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid #F1EAE0' }}
                    >
                      <PlayCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'rgba(31,58,52,0.4)' }} />
                      <span
                        className="text-base leading-snug"
                        style={{ color: 'rgba(31,58,52,0.85)', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {m.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
