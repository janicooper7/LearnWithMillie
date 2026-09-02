'use client'

import { useState } from 'react'
import { Plus, PlayCircle } from 'lucide-react'
import { courseSales, trilogyOrder } from '@/lib/courseSalesContent'

// "Course content" accordion. Every section starts closed: the full 35-module
// list is the single biggest wall of text on the page, and a visitor who is
// still deciding needs the three course titles, not the syllabus. Anyone who
// wants the detail opens it — and gets it at a readable size.
export default function CourseContentAccordion() {
  const totalModules = trilogyOrder.reduce(
    (acc, s) => acc + courseSales[s].modules.length,
    0
  )

  const [open, setOpen] = useState<Set<string>>(new Set())
  const allOpen = open.size === trilogyOrder.length

  const toggle = (s: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })

  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(trilogyOrder))

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-base"
          style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          3 courses · {totalModules} modules · ~350 min total
        </p>
        <button
          onClick={toggleAll}
          className="text-base font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="space-y-3">
        {trilogyOrder.map((slug, idx) => {
          const c = courseSales[slug]
          const isOpen = open.has(slug)
          return (
            <div
              key={slug}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ border: `1px solid ${isOpen ? '#C2AA6A' : '#E2D6C4'}` }}
            >
              <button
                onClick={() => toggle(slug)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
              >
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                  style={{
                    backgroundColor: isOpen ? '#C2AA6A' : 'rgba(31,58,52,0.07)',
                    color: isOpen ? '#1F3A34' : 'rgba(31,58,52,0.75)',
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                  }}
                >
                  {idx + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="mt-1 block text-lg font-bold leading-snug md:text-xl"
                    style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {c.tagline}
                  </span>
                  <span
                    className="mt-1 block text-sm md:text-base"
                    style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {c.modules.length} modules · {c.meta[1]?.replace('of video', '').trim()}
                  </span>
                </span>

                <Plus
                  className="h-6 w-6 flex-shrink-0 transition-transform duration-300"
                  style={{
                    color: '#1F3A34',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                  }}
                />
              </button>

              {isOpen && (
                <ul className="px-5 pb-5 md:px-6" style={{ borderTop: '1px solid #EDE4D8' }}>
                  {c.modules.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3.5 py-3.5"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid #F1EAE0' }}
                    >
                      <PlayCircle
                        className="mt-0.5 h-5 w-5 flex-shrink-0"
                        style={{ color: '#C2AA6A' }}
                      />
                      <span
                        className="text-base leading-snug md:text-lg"
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
