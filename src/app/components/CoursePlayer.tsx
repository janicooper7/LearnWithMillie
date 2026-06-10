'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CheckCircle, Circle, ChevronRight, PlayCircle, Clock, PartyPopper, X, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

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
  const allComplete = lessons.length > 0 && completedCount === lessons.length

  // Track whether the course was already finished on load, so we only celebrate
  // when the learner crosses the finish line during this session — not on revisit.
  const wasCompleteRef = useRef(
    initialLessons.length > 0 && initialLessons.every((l) => l.completedAt)
  )

  const fireCelebration = useCallback(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
    const colors = ['#1F3A34', '#C2AA6A', '#2A4D45', '#D4C08A', '#F4EDE4']
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)
      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors })
    }, 250)
  }, [])

  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    if (allComplete && !wasCompleteRef.current) {
      fireCelebration()
      setShowCompletionModal(true)
      // Reset the player back to Module 1 so the learner sees the first lesson
      // again instead of the finished last video's Vimeo end-screen placeholder.
      if (initialLessons[0]) setActiveId(initialLessons[0].id)
    }
    wasCompleteRef.current = allComplete
  }, [allComplete, fireCelebration, initialLessons])

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
      // When a module is marked complete, advance to the next one (if any).
      if (completed) {
        setActiveId((prev) => {
          const idx = initialLessons.findIndex((l) => l.id === lessonId)
          return idx >= 0 && idx < initialLessons.length - 1 ? initialLessons[idx + 1].id : prev
        })
      }
    } catch {}
  }, [courseSlug, initialLessons])

  // In-component notification (no browser alerts): null | a confirm prompt | a result toast.
  const [notice, setNotice] = useState<{ kind: 'confirm' | 'success' | 'error'; message: string } | null>(null)

  const requestReset = useCallback(() => {
    setNotice({ kind: 'confirm', message: 'Reset your progress and redo this course from the start? This clears all your completed modules.' })
  }, [])

  const resetCourse = useCallback(async () => {
    try {
      const res = await fetch(`/api/learn/${courseSlug}/progress`, { method: 'DELETE' })
      if (!res.ok) throw new Error('reset failed')
      setLessons((prev) => prev.map((l) => ({ ...l, completedAt: null })))
      setShowCompletionModal(false)
      wasCompleteRef.current = false
      setActiveId((prev) => initialLessons[0]?.id ?? prev)
      setNotice({ kind: 'success', message: 'Progress reset — start fresh from Module 1.' })
    } catch {
      setNotice({ kind: 'error', message: "Couldn't reset your progress. Please try again." })
    }
  }, [courseSlug, initialLessons])

  // Auto-dismiss result toasts (the confirm prompt stays until the learner acts).
  useEffect(() => {
    if (!notice || notice.kind === 'confirm') return
    const t = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(t)
  }, [notice])

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
    {/* Celebration banner sits above the course once every module is complete */}
    {allComplete && (
      <div className="mb-6 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-[#1F3A34] text-white">
        <PartyPopper className="w-8 h-8 flex-shrink-0 text-[#C2AA6A]" />
        <div className="min-w-0">
          <p className="font-bold text-lg mb-0.5">Congratulations — course complete! 🎉</p>
          <p className="text-sm text-white/65">
            You&apos;ve finished all {lessons.length} modules of {courseTitle}. Amazing work.
          </p>
        </div>
        <div className="sm:ml-auto flex flex-shrink-0 flex-wrap items-center gap-2">
          <button
            onClick={fireCelebration}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Celebrate again
          </button>
          <button
            onClick={requestReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset course
          </button>
          <Link
            href="/teachers/courses"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#C2AA6A] text-[#1F3A34] hover:opacity-85 transition-opacity"
          >
            Next course <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )}
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
          {/* Mid-course reset for learners who want to start over (the full banner covers the completed case) */}
          {completedCount > 0 && !allComplete && (
            <button
              onClick={requestReset}
              className="mt-3 flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset progress
            </button>
          )}
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
                  <p className={`text-sm font-medium leading-snug ${isActive ? 'text-white' : 'text-white/70'}`}>
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
            <p className="text-sm text-[#1F3A34]/50 mb-1">
              Lesson {lessons.findIndex((l) => l.id === activeId) + 1} of {lessons.length}
            </p>
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#1F3A34] min-w-0">{activeLesson.title}</h1>
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
              <p className="mt-4 text-[#1F3A34]/70 leading-relaxed whitespace-pre-line">{activeLesson.description}</p>
            )}
          </div>
        </div>
      </main>
    </div>
    </div>

    {/* Course-complete celebration modal */}
    {showCompletionModal && (
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowCompletionModal(false)}
      >
        <div
          className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowCompletionModal(false)}
            aria-label="Close"
            className="absolute right-4 top-4 text-[#1F3A34]/40 hover:text-[#1F3A34] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F3A34]">
            <PartyPopper className="h-8 w-8 text-[#C2AA6A]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1F3A34] mb-2">Congratulations! 🎉</h2>
          <p className="text-[#1F3A34]/70 leading-relaxed">
            You&apos;ve completed <span className="font-semibold text-[#1F3A34]">{courseTitle}</span> —
            all {lessons.length} modules done. That&apos;s a huge step. Time to put it into practice!
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/teachers/courses"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1F3A34] px-5 py-3 text-sm font-bold text-white hover:bg-[#1F3A34]/90 transition-colors"
            >
              Continue to your next course <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowCompletionModal(false)}
              className="text-sm font-medium text-[#1F3A34]/50 hover:text-[#1F3A34] transition-colors"
            >
              Keep reviewing this course
            </button>
          </div>
        </div>
      </div>
    )}

    {/* In-component notification — confirm prompt for reset, plus success/error toast */}
    {notice && (
      <div className="fixed bottom-6 left-1/2 z-[10000] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
        <div className="rounded-2xl bg-[#1F3A34] text-white shadow-2xl p-5 flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0">
            {notice.kind === 'success' ? (
              <CheckCircle className="w-5 h-5 text-[#C2AA6A]" />
            ) : notice.kind === 'error' ? (
              <X className="w-5 h-5 text-[#C2AA6A]" />
            ) : (
              <RotateCcw className="w-5 h-5 text-[#C2AA6A]" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug text-white/90">{notice.message}</p>
            {notice.kind === 'confirm' && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={resetCourse}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#C2AA6A] text-[#1F3A34] hover:opacity-85 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  onClick={() => setNotice(null)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )}
    </div>
  )
}
