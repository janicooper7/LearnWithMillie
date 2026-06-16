'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CheckCircle, Circle, ChevronRight, ChevronDown, PlayCircle, PartyPopper, X, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import CourseEssentials from './CourseEssentials'
import { getCourseEssentials } from '@/lib/courseEssentials'
import CourseResources from './CourseResources'
import { getAllCourseResources } from '@/lib/courseResources'

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

export default function CoursePlayer({ courseSlug, courseTitle, lessons: initialLessons }: Props) {
  const [lessons, setLessons] = useState(initialLessons)
  const [activeId, setActiveId] = useState<string | null>(initialLessons[0]?.id ?? null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerOrigin = 'https://player.vimeo.com'

  // On desktop the sidebar + main layout shows; on mobile it becomes an accordion.
  // We mount only one of the two so a single Vimeo iframe owns `iframeRef`.
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

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

  if (lessons.length === 0) return null

  // Shared video + lesson-info panel. Used by the desktop main column and by the
  // open accordion module on mobile. `compact` drops the redundant title/number
  // on mobile, where the accordion header already shows them.
  const renderLessonPanel = (lesson: Lesson, compact = false) => {
    const idx = lessons.findIndex((l) => l.id === lesson.id)
    const vimeoSrc = `https://player.vimeo.com/video/${lesson.vimeoId}${lesson.vimeoHash ? `?h=${lesson.vimeoHash}&` : '?'}api=1&playsinline=1&color=C2AA6A&title=0&byline=0&portrait=0`
    const isLast = idx >= lessons.length - 1
    return (
      <>
        {/* Video */}
        <div className="relative w-full bg-black" style={{ paddingBottom: 'min(56.25%, 520px)' }}>
          <iframe
            key={lesson.vimeoId}
            ref={iframeRef}
            src={vimeoSrc}
            className="absolute inset-0 w-full h-full"
            // translateZ(0) promotes the iframe to its own layer — without it, iOS
            // Safari stops routing taps to an absolutely-positioned iframe nested in
            // an overflow-hidden/rounded container after the first interaction.
            style={{ transform: 'translateZ(0)' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Lesson info */}
        <div className="p-5 sm:p-6 lg:p-8 flex-1">
          <div className="max-w-3xl">
            {!compact && (
              <p className="text-sm text-[#1F3A34]/50 mb-1">
                Lesson {idx + 1} of {lessons.length}
              </p>
            )}
            <div className={compact ? 'flex flex-wrap items-center gap-3' : 'flex items-baseline justify-between gap-4'}>
              {!compact && <h1 className="text-2xl font-bold text-[#1F3A34] min-w-0">{lesson.title}</h1>}
              <div className={`flex items-center gap-3 flex-shrink-0 ${compact ? 'flex-wrap' : ''}`}>
                {lesson.completedAt ? (
                  <button
                    onClick={() => markComplete(lesson.id, false)}
                    className="flex items-center gap-2 text-sm text-[#1F3A34]/60 hover:text-[#1F3A34] transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-[#C2AA6A]" />
                    Completed
                  </button>
                ) : (
                  <button
                    onClick={() => markComplete(lesson.id, true)}
                    className="flex items-center gap-2 bg-[#1F3A34] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1F3A34]/90 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as complete
                  </button>
                )}
                {!isLast && (
                  <button
                    onClick={() => setActiveId(lessons[idx + 1].id)}
                    className="flex items-center gap-1 text-sm text-[#C2AA6A] hover:text-[#1F3A34] transition-colors font-medium"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {lesson.description && (
              <p className="mt-4 text-[#1F3A34]/70 leading-relaxed whitespace-pre-line">{lesson.description}</p>
            )}
          </div>
        </div>
      </>
    )
  }

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
    {isDesktop ? (
      /* ---------- Desktop: sidebar + main ---------- */
      <div className="flex flex-row overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid rgba(31,58,52,0.1)' }}>
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
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-[#F4EDE4] flex flex-col">
          {activeLesson && renderLessonPanel(activeLesson)}
        </main>
      </div>
    ) : (
      /* ---------- Mobile: accordion ---------- */
      <div className="overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid rgba(31,58,52,0.1)' }}>
        {/* Progress header */}
        <div className="bg-[#1F3A34] text-white p-5">
          <h2 className="font-semibold text-xs text-[#C2AA6A] uppercase tracking-wider mb-1">Course Progress</h2>
          <p className="text-white font-bold text-lg leading-tight mb-3">{courseTitle}</p>
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
          {completedCount > 0 && !allComplete && (
            <button
              onClick={requestReset}
              className="mt-3 flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset progress
            </button>
          )}
        </div>

        {/* Accordion modules */}
        {lessons.map((lesson, idx) => {
          const isOpen = lesson.id === activeId
          const isDone = !!lesson.completedAt
          return (
            <div key={lesson.id} className="border-t border-[#1F3A34]/10">
              <button
                onClick={(e) => {
                  const willOpen = !isOpen
                  setActiveId(willOpen ? lesson.id : null)
                  // Scroll the just-opened module's header to the top so the
                  // learner lands on its video, not wherever they tapped.
                  if (willOpen) {
                    const header = e.currentTarget
                    requestAnimationFrame(() =>
                      header.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    )
                  }
                }}
                aria-expanded={isOpen}
                className={`w-full text-left px-4 py-4 flex items-center gap-3 transition-colors scroll-mt-20 ${
                  isOpen ? 'bg-[#1F3A34] text-white' : 'bg-white text-[#1F3A34] hover:bg-[#1F3A34]/5'
                }`}
              >
                <span className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-[#C2AA6A]" />
                  ) : isOpen ? (
                    <PlayCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#1F3A34]/30" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    <span className={isOpen ? 'text-white/50 mr-1' : 'text-[#1F3A34]/40 mr-1'}>{idx + 1}.</span>
                    {lesson.title}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#C2AA6A]' : 'text-[#1F3A34]/40'}`}
                />
              </button>
              {isOpen && <div className="bg-[#F4EDE4]">{renderLessonPanel(lesson, true)}</div>}
            </div>
          )
        })}
      </div>
    )}

    {/* Amazon "must-haves" + resource links — shown once below the player, available throughout the course */}
    <CourseEssentials items={getCourseEssentials(courseSlug)} />
    <CourseResources groups={getAllCourseResources(courseSlug)} />
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
