'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CheckCircle, Circle, ChevronRight, PlayCircle, Clock } from 'lucide-react'

type Lesson = {
  id: string
  title: string
  description: string | null
  vimeoId: string
  vimeoHash: string | null
  duration: number | null
  order: number
  completedAt: string | null
}

type Props = {
  courseSlug: string
  courseTitle: string
  lessons: Lesson[]
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CoursePlayer({ courseSlug, courseTitle, lessons: initialLessons }: Props) {
  const [lessons, setLessons] = useState(initialLessons)
  const [activeId, setActiveId] = useState(initialLessons[0]?.id ?? null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerOrigin = 'https://player.vimeo.com'

  const activeLesson = lessons.find((l) => l.id === activeId)
  const completedCount = lessons.filter((l) => l.completedAt).length
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  const markComplete = useCallback(async (lessonId: string, completed: boolean) => {
    try {
      await fetch(`/api/learn/${courseSlug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed }),
      })
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ? { ...l, completedAt: completed ? new Date().toISOString() : null } : l
        )
      )
    } catch {}
  }, [courseSlug])

  // Listen for Vimeo postMessage events to auto-mark complete when video ends
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
        if (data.event === 'ended' && activeId && !lessons.find((l) => l.id === activeId)?.completedAt) {
          markComplete(activeId, true)
        }
      } catch {}
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [activeId, lessons, markComplete])

  // Re-subscribe when lesson changes
  useEffect(() => {
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: 'addEventListener', value: 'ended' }),
        playerOrigin
      )
    }, 1500)
    return () => clearTimeout(t)
  }, [activeId])

  function goNext() {
    const idx = lessons.findIndex((l) => l.id === activeId)
    if (idx < lessons.length - 1) setActiveId(lessons[idx + 1].id)
  }

  if (!activeLesson) return null

  const vimeoSrc = `https://player.vimeo.com/video/${activeLesson.vimeoId}${activeLesson.vimeoHash ? `?h=${activeLesson.vimeoHash}&` : '?'}api=1&color=C2AA6A&title=0&byline=0&portrait=0`

  return (
    <div className="bg-[#F4EDE4] py-8">
    <div className="container">
    <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid rgba(31,58,52,0.1)' }}>
      {/* Sidebar */}
      <aside className="lg:w-80 xl:w-96 bg-[#1F3A34] text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h2 className="font-semibold text-sm text-[#C2AA6A] uppercase tracking-wider mb-1">Course Progress</h2>
          <p className="text-white font-bold text-lg leading-tight mb-3">{courseTitle}</p>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div
                className="bg-[#C2AA6A] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-white/70 whitespace-nowrap">
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lessons.map((lesson, idx) => {
            const isActive = lesson.id === activeId
            const isDone = !!lesson.completedAt
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
                  <p className={`text-sm font-medium leading-snug truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                    <span className="text-white/40 mr-1">{idx + 1}.</span>
                    {lesson.title}
                  </p>
                  {lesson.duration && (
                    <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(lesson.duration)}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F4EDE4] flex flex-col">
        {/* Video */}
        <div className="relative w-full bg-black" style={{ paddingBottom: 'min(56.25%, 520px)' }}>
          <iframe
            key={activeLesson.vimeoId}
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
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-[#1F3A34]/50 mb-1">
                  Lesson {lessons.findIndex((l) => l.id === activeId) + 1} of {lessons.length}
                </p>
                <h1 className="text-2xl font-bold text-[#1F3A34]">{activeLesson.title}</h1>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {activeLesson.completedAt ? (
                  <button
                    onClick={() => markComplete(activeLesson.id, false)}
                    className="flex items-center gap-2 text-sm text-[#1F3A34]/60 hover:text-[#1F3A34] transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-[#C2AA6A]" />
                    Completed
                  </button>
                ) : (
                  <button
                    onClick={() => markComplete(activeLesson.id, true)}
                    className="flex items-center gap-2 bg-[#1F3A34] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1F3A34]/90 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as complete
                  </button>
                )}
                {lessons.findIndex((l) => l.id === activeId) < lessons.length - 1 && (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-1 text-sm text-[#C2AA6A] hover:text-[#1F3A34] transition-colors font-medium"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {activeLesson.description && (
              <p className="mt-4 text-[#1F3A34]/70 leading-relaxed">{activeLesson.description}</p>
            )}
          </div>
        </div>
      </main>
    </div>
    </div>
    </div>
  )
}
