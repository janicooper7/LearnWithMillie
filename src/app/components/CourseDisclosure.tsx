'use client'

import { useState, type ReactNode } from 'react'
import { Plus, Layers, UserCheck, ListChecks, Heart } from 'lucide-react'

// Icons are looked up by key rather than passed in: a server component can't
// hand a component reference to a client one.
const icons = {
  layers: Layers,
  who: UserCheck,
  checklist: ListChecks,
  heart: Heart,
} as const

export type CourseDisclosureIcon = keyof typeof icons

// A single collapsed detail row. The supporting copy on this page — the
// requirements, the trilogy rationale, who it's for, Millie's story — is
// worth reading but not worth showing all at once, so each block hides behind
// a large, tappable header and opens only for the visitor who wants it.
export default function CourseDisclosure({
  icon,
  title,
  summary,
  children,
  defaultOpen = false,
}: {
  icon: CourseDisclosureIcon
  title: string
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = icons[icon]

  return (
    <div
      className="overflow-hidden rounded-2xl bg-white"
      style={{ border: `1px solid ${open ? '#C2AA6A' : '#E2D6C4'}` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
      >
        <span
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'rgba(194,170,106,0.16)' }}
        >
          <Icon className="h-6 w-6" style={{ color: '#C2AA6A' }} strokeWidth={1.75} />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="block text-lg font-bold leading-snug md:text-xl"
            style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {title}
          </span>
          <span
            className="mt-1 block text-sm md:text-base"
            style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {summary}
          </span>
        </span>

        <Plus
          className="h-6 w-6 flex-shrink-0 transition-transform duration-300"
          style={{ color: '#1F3A34', transform: open ? 'rotate(45deg)' : 'none' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-6 pt-5 md:px-6" style={{ borderTop: '1px solid #EDE4D8' }}>
          {children}
        </div>
      )}
    </div>
  )
}
