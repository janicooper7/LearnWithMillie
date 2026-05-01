'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CheckCircle, Circle, ChevronRight, PlayCircle, Clock, Info } from 'lucide-react'

const DEMO_LESSONS = [
  {
    id: 'demo-1',
    order: 1,
    title: 'Welcome & Course Introduction',
    duration: 312,
    vimeoId: '76979871',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In this opening lesson we cover what to expect, how the course is structured, and the key outcomes you will achieve by the end. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'demo-2',
    order: 2,
    title: 'Core Vocabulary — Everyday Conversations',
    duration: 487,
    vimeoId: '76979871',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. We explore the 200 most common English words used in daily conversations and how to use them naturally.',
  },
  {
    id: 'demo-3',
    order: 3,
    title: 'Pronunciation & Intonation Patterns',
    duration: 523,
    vimeoId: '76979871',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. This lesson breaks down the rhythm and melody of spoken English so you can sound more natural and confident.',
  },
  {
    id: 'demo-4',
    order: 4,
    title: 'Grammar in Context — Present Tenses',
    duration: 398,
    vimeoId: '76979871',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. We look at how present simple and present continuous are used in real conversations, not just textbook rules.',
  },
  {
    id: 'demo-5',
    order: 5,
    title: 'Listening Skills — Accents & Speed',
    duration: 441,
    vimeoId: '76979871',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. We train your ear to understand different accents and speech speeds so you can follow native speakers with confidence.',
  },
  {
    id: 'demo-6',
    order: 6,
    title: 'Putting It All Together — Final Practice',
    duration: 356,
    vimeoId: '76979871',
    description:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. In this final lesson we bring everything together with a full conversation practice session and review of everything covered in the course.',
  },
]

const STORAGE_KEY = 'demo-course-progress'

function formatDuration(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

export default function DemoCoursePlayer() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState(DEMO_LESSONS[0].id)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerOrigin = 'https://player.vimeo.com'

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCompleted(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  const toggleComplete = useCallback((lessonId: string, mark: boolean) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      mark ? next.add(lessonId) : next.delete(lessonId)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  // Vimeo postMessage — auto-mark complete when video ends
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== playerOrigin) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data.event === 'ready') {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: 'addEventListener', value: 'ended' }),
            playerOrigin
          )
        }
        if (data.event === 'ended') toggleComplete(activeId, true)
      } catch {}
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [activeId, toggleComplete])

  useEffect(() => {
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: 'addEventListener', value: 'ended' }),
        playerOrigin
      )
    }, 1500)
    return () => clearTimeout(t)
  }, [activeId])

  function resetProgress() {
    setCompleted(new Set())
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const activeLesson = DEMO_LESSONS.find((l) => l.id === activeId)!
  const activeIdx = DEMO_LESSONS.findIndex((l) => l.id === activeId)
  const completedCount = completed.size
  const pct = Math.round((completedCount / DEMO_LESSONS.length) * 100)

  const vimeoSrc = `https://player.vimeo.com/video/${activeLesson.vimeoId}?api=1&color=C2AA6A&title=0&byline=0&portrait=0`

  return (
    <div className="flex flex-col min-h-screen bg-[#F4EDE4]">
      {/* Top bar */}
      <div className="bg-[#1F3A34] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Link href="/courses" className="text-white/60 hover:text-white text-sm transition-colors">
          ← Back to Courses
        </Link>
        <span className="text-[#C2AA6A] text-sm font-medium">Course 1 — Demo Preview</span>
        <div />
      </div>

      {/* Demo banner */}
      <div className="bg-[#C2AA6A]/15 border-b border-[#C2AA6A]/30 px-4 py-2.5 flex items-center justify-center gap-2">
        <Info className="w-4 h-4 text-[#C2AA6A] flex-shrink-0" />
        <p className="text-sm text-[#1F3A34]/80" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          <span className="font-semibold text-[#1F3A34]">Demo preview</span> — placeholder video and lorem ipsum content. Progress saves to your browser.
        </p>
      </div>

      <div className="flex-1 bg-[#F4EDE4] py-8">
      <div className="container">
      <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid rgba(31,58,52,0.1)' }}>
        {/* Sidebar */}
        <aside className="lg:w-80 xl:w-96 bg-[#1F3A34] text-white flex-shrink-0 flex flex-col">
          <div className="p-5 border-b border-white/10">
            <p className="text-[#C2AA6A] text-xs font-semibold uppercase tracking-wider mb-1">Course Progress</p>
            <p className="text-white font-bold text-lg leading-tight mb-3">Course 1 — Beginner English</p>
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div
                  className="bg-[#C2AA6A] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-white/70 whitespace-nowrap tabular-nums">
                {completedCount}/{DEMO_LESSONS.length}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-white/40">{pct}% complete</p>
              {completedCount > 0 && (
                <button
                  onClick={resetProgress}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Reset progress
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {DEMO_LESSONS.map((lesson) => {
              const isActive = lesson.id === activeId
              const isDone = completed.has(lesson.id)
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors border-b border-white/5 ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-[#C2AA6A]" />
                    ) : isActive ? (
                      <PlayCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/30" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${isActive ? 'text-white' : 'text-white/70'}`}>
                      <span className="text-white/30 mr-1 tabular-nums">{lesson.order}.</span>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(lesson.duration)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-[#F4EDE4] flex flex-col min-w-0">
          {/* Video */}
          <div className="relative w-full bg-black" style={{ paddingBottom: 'min(56.25%, 520px)' }}>
            <iframe
              key={activeLesson.vimeoId + activeId}
              ref={iframeRef}
              src={vimeoSrc}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Lesson info */}
          <div className="p-6 lg:p-8 flex-1">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <p className="text-xs mb-2" style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                Course 1 — Beginner English &nbsp;·&nbsp; Lesson {activeIdx + 1} of {DEMO_LESSONS.length}
              </p>

              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <h1 className="text-2xl font-bold" style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {activeLesson.title}
                </h1>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {completed.has(activeLesson.id) ? (
                    <button
                      onClick={() => toggleComplete(activeLesson.id, false)}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: '#C2AA6A' }} />
                      Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleComplete(activeLesson.id, true)}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as complete
                    </button>
                  )}

                  {activeIdx < DEMO_LESSONS.length - 1 && (
                    <button
                      onClick={() => setActiveId(DEMO_LESSONS[activeIdx + 1].id)}
                      className="flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {activeLesson.description}
              </p>

              {/* Completion callout when all done */}
              {completedCount === DEMO_LESSONS.length && (
                <div
                  className="mt-8 rounded-2xl p-6 flex items-center gap-4"
                  style={{ backgroundColor: '#1F3A34', color: 'white' }}
                >
                  <CheckCircle className="w-8 h-8 flex-shrink-0" style={{ color: '#C2AA6A' }} />
                  <div>
                    <p className="font-bold text-lg mb-0.5" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      Course Complete!
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      You&apos;ve finished all lessons. Ready to take the next course?
                    </p>
                  </div>
                  <Link
                    href="/courses"
                    className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    Next Course <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      </div>
      </div>
    </div>
  )
}
