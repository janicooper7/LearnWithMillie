'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { track, trackingContext } from '@/lib/trackClient'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  BriefcaseIcon,
  LanguageIcon,
  MapPinIcon,
  BoltIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import {
  matchAll,
  PLATFORMS,
  COUNTRY_LABELS,
  studentAgeLabel,
  teflLabel,
  type Profile,
  type Country,
  type AudienceChoice,
  type ExperienceLevel,
  type HoursBucket,
} from './platforms'

type Step =
  | 'nativeSpeaker'
  | 'country'
  | 'tefl'
  | 'degree'
  | 'audience'
  | 'experience'
  | 'hours'

const STEPS: Step[] = ['nativeSpeaker', 'country', 'tefl', 'degree', 'audience', 'experience', 'hours']

type Question = {
  step: Step
  title: string
  subtitle?: string
  multi?: boolean
  options: { value: string; label: string; hint?: string }[]
}

const QUESTIONS: Question[] = [
  {
    step: 'nativeSpeaker',
    title: 'Are you a native English speaker?',
    subtitle: "Some platforms only hire teachers whose first language is English.",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    step: 'country',
    title: 'Where are you based?',
    subtitle: 'Several platforms restrict hiring to specific countries.',
    options: [
      { value: 'usa', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'canada', label: 'Canada' },
      { value: 'australia', label: 'Australia' },
      { value: 'new_zealand', label: 'New Zealand' },
      { value: 'ireland', label: 'Ireland' },
      { value: 'mexico', label: 'Mexico' },
      { value: 'spain', label: 'Spain' },
      { value: 'south_korea', label: 'South Korea' },
      { value: 'other', label: 'Somewhere else' },
    ],
  },
  {
    step: 'tefl',
    title: 'Do you have a TEFL or CELTA certificate?',
    subtitle: 'TEFL, CELTA, TESOL or similar 120-hour ESL teaching qualifications all count.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No, not yet' },
    ],
  },
  {
    step: 'degree',
    title: 'Do you have a university degree?',
    subtitle: 'Any bachelor’s degree or higher counts.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    step: 'audience',
    title: 'Who do you want to teach?',
    subtitle: 'Pick one or more age groups — we\'ll show platforms that match any of your choices.',
    multi: true,
    options: [
      { value: 'young_learners', label: 'Young learners (under 13)' },
      { value: 'k12', label: 'K-12 (children & teens)' },
      { value: 'teens_adults', label: 'Teens & adults' },
      { value: 'adults', label: 'Adults only' },
      { value: 'any', label: 'Open to any age' },
    ],
  },
  {
    step: 'experience',
    title: 'How much teaching experience do you have?',
    subtitle: 'Include classroom, online, tutoring or volunteer teaching.',
    options: [
      { value: 'none', label: 'None yet' },
      { value: 'under_1', label: 'Less than 1 year' },
      { value: '1_to_2', label: '1–2 years' },
      { value: '3_plus', label: '3+ years' },
    ],
  },
  {
    step: 'hours',
    title: 'Max hours per week you can commit to one platform?',
    subtitle: 'Some platforms require minimum weekly hours to stay active.',
    options: [
      { value: 'under_5', label: 'Less than 5 hrs/week' },
      { value: '5_to_10', label: '5–10 hrs/week' },
      { value: '10_to_20', label: '10–20 hrs/week' },
      { value: '20_plus', label: '20+ hrs/week' },
    ],
  },
]

const STEP_LABELS: Record<Step, string> = {
  nativeSpeaker: 'Native speaker',
  country: 'Your country',
  tefl: 'TEFL / CELTA',
  degree: 'University degree',
  audience: 'Who you teach',
  experience: 'Experience',
  hours: 'Weekly hours',
}

type Answers = Partial<{
  nativeSpeaker: 'yes' | 'no'
  country: Country
  tefl: 'yes' | 'no'
  degree: 'yes' | 'no'
  audience: AudienceChoice[]
  experience: ExperienceLevel
  hours: HoursBucket
}>

export default function PlatformFinder() {
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)
  const [showAllExcluded, setShowAllExcluded] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [idError, setIdError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const quizStarted = useRef(false)
  const quizCompleted = useRef(false)

  // Reaching the results screen is the 'finished the questions' step.
  useEffect(() => {
    if (!finished || quizCompleted.current) return
    quizCompleted.current = true
    track('platform-finder', 'quiz_complete')
  }, [finished])
  const quizRef = useRef<HTMLDivElement | null>(null)

  function scrollToQuiz() {
    quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const totalSteps = STEPS.length
  const isLastStep = stepIdx === totalSteps - 1
  const currentQuestion = QUESTIONS[stepIdx]
  const rawAnswer = answers[currentQuestion.step as keyof Answers]
  const hasAnswer = currentQuestion.multi
    ? Array.isArray(rawAnswer) && rawAnswer.length > 0
    : typeof rawAnswer === 'string' && rawAnswer.length > 0
  const singleAnswer = !currentQuestion.multi && typeof rawAnswer === 'string' ? rawAnswer : undefined
  const multiAnswer = currentQuestion.multi && Array.isArray(rawAnswer) ? (rawAnswer as string[]) : []

  const profile: Profile | null = useMemo(() => {
    if (
      !answers.nativeSpeaker ||
      !answers.country ||
      !answers.tefl ||
      !answers.degree ||
      !answers.audience ||
      answers.audience.length === 0 ||
      !answers.experience ||
      !answers.hours
    ) {
      return null
    }
    return {
      nativeSpeaker: answers.nativeSpeaker === 'yes',
      country: answers.country,
      tefl: answers.tefl === 'yes',
      degree: answers.degree === 'yes',
      audience: answers.audience,
      experience: answers.experience,
      hours: answers.hours,
    }
  }, [answers])

  const results = useMemo(() => (profile ? matchAll(profile) : []), [profile])
  const matched = results.filter((r) => r.matches)
  const excluded = results.filter((r) => !r.matches)

  // On mount: if the URL carries a result id (from the Stripe redirect or a
  // shared/bookmarked link), load that paid report. The record is created at
  // checkout, so we poll briefly to cover the gap before payment settles.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) return

    let cancelled = false
    let attempts = 0
    setVerifying(true)

    const poll = async () => {
      attempts++
      try {
        const res = await fetch(`/api/platform-finder/result?id=${encodeURIComponent(id)}`)
        const d = await res.json()
        if (cancelled) return

        if (d.paid && d.answers) {
          setAnswers(d.answers)
          setUnlocked(true)
          setFinished(true)
          setVerifying(false)
          return
        }
        if (d.found === false) {
          setIdError("We couldn't find those results. Please double-check your link.")
          setVerifying(false)
          return
        }
        if (attempts < 8) {
          window.setTimeout(poll, 1500)
        } else {
          setIdError('Your payment is still processing. Please refresh this page in a moment.')
          setVerifying(false)
        }
      } catch {
        if (cancelled) return
        if (attempts < 8) {
          window.setTimeout(poll, 1500)
        } else {
          setIdError('Something went wrong loading your results. Please refresh to try again.')
          setVerifying(false)
        }
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleUnlock() {
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/platform-finder/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('platform-finder', 'checkout_start', { value: 5 })
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Could not start checkout')
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.')
      setCheckoutLoading(false)
    }
  }

  // The first answer is what counts as starting — landing on the page and
  // scrolling to the quiz without picking anything isn't an intent signal.
  function markQuizStart() {
    if (quizStarted.current) return
    quizStarted.current = true
    track('platform-finder', 'quiz_start')
  }

  function setAnswer(step: Step, value: string) {
    markQuizStart()
    setAnswers((a) => ({ ...a, [step]: value }))
    // Auto-advance on single-select for a snappier feel. On the final step,
    // selecting an answer takes the visitor straight to their results.
    window.setTimeout(() => {
      if (isLastStep) {
        setFinished(true)
      } else {
        setStepIdx((i) => (i < totalSteps - 1 ? i + 1 : i))
      }
    }, 280)
  }

  function toggleMultiAnswer(step: Step, value: string) {
    markQuizStart()
    setAnswers((a) => {
      const current = (a[step as keyof Answers] as string[] | undefined) ?? []
      // "any" is exclusive: selecting it clears others; selecting any other clears "any"
      if (value === 'any') {
        return { ...a, [step]: current.includes('any') ? [] : ['any'] }
      }
      const withoutAny = current.filter((v) => v !== 'any')
      const next = withoutAny.includes(value)
        ? withoutAny.filter((v) => v !== value)
        : [...withoutAny, value]
      return { ...a, [step]: next }
    })
  }

  function handleNext() {
    if (!hasAnswer) return
    if (isLastStep) {
      setFinished(true)
    } else {
      setStepIdx((i) => i + 1)
    }
  }

  function handleBack() {
    if (stepIdx > 0) setStepIdx((i) => i - 1)
  }

  function handleRestart() {
    // A fresh set of answers is a new report — clear the paid entitlement and
    // drop the id from the URL so the visitor starts clean.
    setAnswers({})
    setStepIdx(0)
    setFinished(false)
    setUnlocked(false)
    setShowAllExcluded(false)
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', '/teachers/platform-finder')
    }
  }

  if (verifying) {
    return <VerifyingView />
  }

  if (idError) {
    return <ResultErrorView message={idError} onRestart={handleRestart} />
  }

  if (finished && profile) {
    // Nothing to sell when there are no matches — show the free "adjust your
    // answers" screen instead of charging for an empty report.
    if (!unlocked && matched.length > 0) {
      return (
        <Paywall
          matched={matched}
          excludedCount={excluded.length}
          profile={profile}
          onUnlock={handleUnlock}
          loading={checkoutLoading}
          error={checkoutError}
          onRestart={handleRestart}
        />
      )
    }
    return (
      <ResultsView
        matched={matched}
        excluded={excluded}
        showAllExcluded={showAllExcluded}
        onToggleExcluded={() => setShowAllExcluded((s) => !s)}
        onRestart={handleRestart}
        profile={profile}
      />
    )
  }

  const progress = (stepIdx / totalSteps) * 100
  const answeredCount = STEPS.filter((s) => {
    const v = answers[s as keyof Answers]
    return Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.length > 0
  }).length

  return (
    <div style={{ backgroundColor: '#F4EDE4' }}>
      {/* ============ HERO + QUIZ CONSOLE ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(120% 80% at 85% -10%, rgba(194,170,106,0.18), transparent 55%), radial-gradient(90% 70% at 0% 0%, rgba(31,58,52,0.06), transparent 45%), #F4EDE4',
        }}
      >
        {/* faint dotted texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(rgba(31,58,52,0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="container relative pt-14 md:pt-20 pb-16 md:pb-24">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
            <span
              className="text-xs uppercase tracking-[0.25em] font-medium"
              style={{ color: 'rgba(31,58,52,0.7)' }}
            >
              The #1 tool for online English teachers
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-10 lg:gap-16 items-start">
            {/* --- Left: pitch --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="lg:pt-4"
            >
              <h1 className="heading-xl mb-6" style={{ color: '#1F3A34' }}>
                Stop guessing where to{' '}
                <span className="relative whitespace-nowrap">
                  <span style={{ color: '#C2AA6A' }}>teach English</span>
                </span>{' '}
                online.
              </h1>
              <p
                className="text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: 'rgba(31,58,52,0.72)' }}
              >
                There are <strong style={{ color: '#1F3A34' }}>33 major platforms</strong> — and each
                has its own rules on nationality, location, TEFL, degrees, age groups and hours. Most
                will never hire you. Answer 7 quick questions and get your personalised report of
                exactly which ones will, <span style={{ color: '#1F3A34', fontWeight: 600 }}>ranked by pay</span> —
                a one-time <strong style={{ color: '#1F3A34' }}>$5</strong>.
              </p>

              {/* trust row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-9">
                {[
                  { icon: BoltIcon, label: 'Ready in under a minute' },
                  { icon: BanknotesIcon, label: 'One-time $5 — no subscription' },
                  { icon: CheckCircleIcon, label: 'Yours to keep forever' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'rgba(31,58,52,0.75)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#C2AA6A' }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* Hero stats */}
              <div
                className="grid grid-cols-3 gap-4 max-w-lg pt-8"
                style={{ borderTop: '1px solid rgba(31,58,52,0.12)' }}
              >
                {[
                  { value: '33', label: 'Platforms compared' },
                  { value: '7', label: 'Eligibility checks' },
                  { value: '2026', label: 'Data updated' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl md:text-4xl font-bold font-serif leading-none mb-1.5" style={{ color: '#1F3A34' }}>
                      {s.value}
                    </p>
                    <p className="text-xs leading-snug" style={{ color: 'rgba(31,58,52,0.6)' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* --- Right: the quiz console --- */}
            <motion.div
              ref={quizRef}
              id="finder-quiz"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative scroll-mt-24"
            >
              {/* offset accent block (brand motif) */}
              <div
                aria-hidden
                className="absolute rounded-[2rem] hidden sm:block"
                style={{ top: '18px', left: '18px', right: '-14px', bottom: '-14px', backgroundColor: '#1F3A34', opacity: 0.9, zIndex: 0 }}
              />
              <div
                className="relative rounded-[2rem] shadow-2xl overflow-hidden grid md:grid-cols-[minmax(0,235px)_1fr]"
                style={{ backgroundColor: 'white', border: '1px solid #EDE4D8', zIndex: 1 }}
              >
                {/* Left rail — story + step tracker */}
                <div
                  className="relative p-7 md:p-8 flex flex-col"
                  style={{ backgroundColor: '#1F3A34' }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none opacity-[0.6]"
                    style={{ background: 'radial-gradient(80% 50% at 100% 0%, rgba(194,170,106,0.16), transparent 60%)' }}
                  />
                  <div className="relative">
                    <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: '#C2AA6A' }}>
                      Platform Finder
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif font-bold leading-snug mb-6" style={{ color: 'white' }}>
                      Your matches in 7 quick steps
                    </h2>

                    {/* vertical step tracker */}
                    <ol className="space-y-1">
                      {QUESTIONS.map((q, i) => {
                        const done = i < stepIdx
                        const active = i === stepIdx
                        return (
                          <li key={q.step} className="flex items-center gap-3 py-1.5">
                            <span
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                              style={{
                                backgroundColor: done ? '#C2AA6A' : active ? 'white' : 'rgba(255,255,255,0.1)',
                                color: done ? '#1F3A34' : active ? '#1F3A34' : 'rgba(255,255,255,0.6)',
                                border: active ? '2px solid #C2AA6A' : 'none',
                              }}
                            >
                              {done ? (
                                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="2 6 5 9 10 3" />
                                </svg>
                              ) : (
                                i + 1
                              )}
                            </span>
                            <span
                              className="text-sm font-medium leading-tight transition-colors"
                              style={{ color: active ? 'white' : done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)' }}
                            >
                              {STEP_LABELS[q.step]}
                            </span>
                          </li>
                        )
                      })}
                    </ol>
                  </div>

                  <div className="relative mt-auto pt-6">
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Built from the real hiring rules of 33 leading platforms · Updated 2026
                    </p>
                  </div>
                </div>

                {/* Right — the live question */}
                <div className="flex flex-col">
                  {/* progress */}
                  <div className="px-6 md:px-8 pt-6 md:pt-7">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(31,58,52,0.55)' }}>
                        Step {stepIdx + 1} of {totalSteps}
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#C2AA6A' }}>
                        {Math.round(progress)}% complete
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F4EDE4' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#1F3A34' }}
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* question */}
                  <div className="px-6 md:px-8 py-7 md:py-8 flex-1" style={{ minHeight: '370px' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.step}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                      >
                        <h3
                          className="text-xl md:text-2xl font-serif font-bold leading-tight mb-2"
                          style={{ color: '#1F3A34' }}
                        >
                          {currentQuestion.title}
                        </h3>
                        {currentQuestion.subtitle && (
                          <p className="text-sm mb-6" style={{ color: 'rgba(31,58,52,0.65)' }}>
                            {currentQuestion.subtitle}
                          </p>
                        )}

                        <div
                          className={`pf-options grid gap-2.5 ${
                            currentQuestion.multi ? 'grid-cols-1' : 'grid-cols-2'
                          }`}
                        >
                          {currentQuestion.options.map((opt) => {
                            const selected = currentQuestion.multi
                              ? multiAnswer.includes(opt.value)
                              : singleAnswer === opt.value
                            const isMulti = !!currentQuestion.multi
                            return (
                              <button
                                key={opt.value}
                                data-selected={selected}
                                onClick={() =>
                                  isMulti
                                    ? toggleMultiAnswer(currentQuestion.step, opt.value)
                                    : setAnswer(currentQuestion.step, opt.value)
                                }
                                className="pf-option w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 flex items-center gap-2.5"
                              >
                                <div
                                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all"
                                  style={{
                                    borderWidth: '1.5px',
                                    borderStyle: 'solid',
                                    borderColor: selected ? '#1F3A34' : 'rgba(31,58,52,0.25)',
                                    backgroundColor: selected ? '#1F3A34' : 'transparent',
                                    borderRadius: isMulti ? '4px' : '9999px',
                                  }}
                                >
                                  {selected && isMulti && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="2 6 5 9 10 3" />
                                    </svg>
                                  )}
                                  {selected && !isMulti && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span
                                  className="text-sm md:text-[15px] font-medium leading-tight"
                                  style={{ color: selected ? '#1F3A34' : 'rgba(31,58,52,0.85)' }}
                                >
                                  {opt.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* footer */}
                  <div
                    className="px-6 md:px-8 py-4 flex items-center justify-between gap-3"
                    style={{ borderTop: '1px solid #EDE4D8', backgroundColor: '#FBF7F1' }}
                  >
                    <button
                      onClick={handleBack}
                      disabled={stepIdx === 0}
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity"
                      style={{
                        color: '#1F3A34',
                        opacity: stepIdx === 0 ? 0.3 : 0.65,
                        cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!hasAnswer}
                      className="btn-primary gap-2"
                      style={{ opacity: hasAnswer ? 1 : 0.4, cursor: hasAnswer ? 'pointer' : 'not-allowed' }}
                    >
                      {isLastStep ? 'See my matches' : 'Next'}
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ MARKETING JOURNEY ============ */}
      <WhySection />
      <HowItWorks onStart={scrollToQuiz} />
      <WhatWeCheck />
      <PlatformWall />
      <ReportPreview onStart={scrollToQuiz} />
      <FinderFaq />
      <FinalCta onStart={scrollToQuiz} answeredCount={answeredCount} totalSteps={totalSteps} />
    </div>
  )
}

// --- Results view ---

type ResultsProps = {
  matched: ReturnType<typeof matchAll>
  excluded: ReturnType<typeof matchAll>
  showAllExcluded: boolean
  onToggleExcluded: () => void
  onRestart: () => void
  profile: Profile
}

function ResultsView({ matched, excluded, showAllExcluded, onToggleExcluded, onRestart, profile }: ResultsProps) {
  const excludedToShow = showAllExcluded ? excluded : excluded.slice(0, 3)

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-medium tracking-wide uppercase"
            style={{ backgroundColor: '#1F3A34', color: 'white' }}
          >
            <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
            Your matches
          </div>
          <h1 className="heading-lg mb-4" style={{ color: '#1F3A34' }}>
            You match <span style={{ color: '#C2AA6A' }}>{matched.length}</span> platform{matched.length === 1 ? '' : 's'}
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
            Ranked by pay rate. The full list of excluded platforms — and why — is at the bottom.
          </p>
        </div>

        {/* Profile chips */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          <ProfileChip label={profile.nativeSpeaker ? 'Native speaker' : 'Non-native speaker'} />
          <ProfileChip label={COUNTRY_LABELS[profile.country]} />
          <ProfileChip label={profile.tefl ? 'TEFL/CELTA ✓' : 'No TEFL'} />
          <ProfileChip label={profile.degree ? 'Degree ✓' : 'No degree'} />
          <ProfileChip label={profile.audience.map(audienceLabel).join(', ')} />
          <ProfileChip label={experienceLabel(profile.experience)} />
          <ProfileChip label={hoursLabel(profile.hours)} />
        </div>

        {/* Matches */}
        {matched.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-10 shadow-sm" style={{ border: '1px solid #EDE4D8' }}>
            <h2 className="text-xl font-serif font-bold mb-3" style={{ color: '#1F3A34' }}>
              No exact matches yet
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(31,58,52,0.7)' }}>
              Don't worry — getting a TEFL or expanding your audience choice usually unlocks 10+ platforms.
              Try adjusting your answers below.
            </p>
            <button onClick={onRestart} className="btn-primary gap-2">
              <ArrowPathIcon className="w-4 h-4" />
              Start over
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold" style={{ color: '#1F3A34' }}>
                Your best matches
              </h2>
              <span className="text-sm" style={{ color: 'rgba(31,58,52,0.5)' }}>
                highest pay first
              </span>
            </div>
            <div className="space-y-4">
              {matched.map((r, idx) => (
                <MatchedCard key={r.platform.name} result={r} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Excluded */}
        {excluded.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold" style={{ color: '#1F3A34' }}>
                Not a fit ({excluded.length})
              </h2>
              {excluded.length > 3 && (
                <button
                  onClick={onToggleExcluded}
                  className="text-sm font-medium"
                  style={{ color: '#C2AA6A' }}
                >
                  {showAllExcluded ? 'Show fewer' : `Show all ${excluded.length}`}
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {excludedToShow.map((r) => (
                <ExcludedCard key={r.platform.name} result={r} />
              ))}
            </div>
          </div>
        )}

        {/* Restart */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <button onClick={onRestart} className="btn-secondary gap-2 inline-flex items-center">
            <ArrowPathIcon className="w-4 h-4" />
            Change my answers
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Payment gate ---

function VerifyingView() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="text-center">
        <div
          className="mx-auto mb-4 w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(31,58,52,0.15)', borderTopColor: '#1F3A34' }}
        />
        <p className="text-sm font-medium" style={{ color: 'rgba(31,58,52,0.7)' }}>
          Confirming your payment…
        </p>
      </div>
    </div>
  )
}

function ResultErrorView({ message, onRestart }: { message: string; onRestart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F4EDE4' }}>
      <div
        className="max-w-md w-full text-center bg-white rounded-3xl p-8 md:p-10 shadow-sm"
        style={{ border: '1px solid #EDE4D8' }}
      >
        <h2 className="text-xl md:text-2xl font-serif font-bold mb-3" style={{ color: '#1F3A34' }}>
          Hang tight
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(31,58,52,0.7)' }}>
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="btn-primary gap-2 justify-center">
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={onRestart} className="btn-secondary gap-2 inline-flex items-center justify-center">
            Start a new search
          </button>
        </div>
      </div>
    </div>
  )
}

type PaywallProps = {
  matched: ReturnType<typeof matchAll>
  excludedCount: number
  profile: Profile
  onUnlock: () => void
  loading: boolean
  error: string | null
  onRestart: () => void
}

function Paywall({ matched, excludedCount, profile, onUnlock, loading, error, onRestart }: PaywallProps) {
  const matchCount = matched.length

  // A free, honest teaser: the top pay rate among their matches — enough to
  // create desire without giving away which platform it is.
  const rates = matched
    .map((m) => m.platform.rateMidpoint)
    .filter((r): r is number => typeof r === 'number')
  const topRate = rates.length ? Math.max(...rates) : null

  const benefits = [
    'The names of every platform you qualify for',
    'Ranked by pay, so you apply where it earns most',
    'Direct sign-up links to apply today',
    'The exact TEFL, degree & experience bar for each',
    `Why ${excludedCount} other platform${excludedCount === 1 ? '' : 's'} ruled you out`,
    'The whole report emailed to you, yours forever',
  ]

  const previewRows = matched.slice(0, Math.min(6, matchCount))

  return (
    <div className="min-h-screen py-12 md:py-16" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold tracking-wide uppercase"
            style={{ backgroundColor: '#1F3A34', color: 'white' }}
          >
            <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
            Your results are ready
          </div>
          <h1 className="heading-lg mb-4" style={{ color: '#1F3A34' }}>
            You match{' '}
            <span style={{ color: '#C2AA6A' }}>
              {matchCount}
            </span>{' '}
            platform{matchCount === 1 ? '' : 's'}
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
            {topRate
              ? `The best of them pays up to $${Math.round(topRate)}/hr. Unlock your report to see which platforms they are — ranked by pay, with sign-up links.`
              : 'Unlock your report to see exactly which platforms they are — ranked by pay, with sign-up links.'}
          </p>

          {/* Profile chips — reinforces that this is personalised to them */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <ProfileChip label={profile.nativeSpeaker ? 'Native speaker' : 'Non-native speaker'} />
            <ProfileChip label={COUNTRY_LABELS[profile.country]} />
            <ProfileChip label={profile.tefl ? 'TEFL/CELTA ✓' : 'No TEFL'} />
            <ProfileChip label={profile.degree ? 'Degree ✓' : 'No degree'} />
            <ProfileChip label={experienceLabel(profile.experience)} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">
          {/* --- LEFT: locked real preview --- */}
          <div
            className="relative rounded-[1.75rem] overflow-hidden shadow-xl"
            style={{ border: '1px solid #EDE4D8', backgroundColor: 'white' }}
          >
            {/* header strip */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid #EDE4D8', backgroundColor: '#FBF7F1' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#1F3A34' }}>
                Your ranked report
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(31,58,52,0.06)', color: 'rgba(31,58,52,0.7)' }}
              >
                <LockClosedIcon className="w-3.5 h-3.5" />
                Locked
              </span>
            </div>

            {/* real rows, blurred */}
            <div className="relative">
              <div
                className="p-4 space-y-3"
                style={{ filter: 'blur(7px)', pointerEvents: 'none', userSelect: 'none' }}
                aria-hidden="true"
              >
                {previewRows.map((r, i) => (
                  <div
                    key={r.platform.name}
                    className="flex items-center gap-3.5 rounded-2xl p-4"
                    style={{ backgroundColor: '#FBF7F1', border: '1px solid #EDE4D8' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: i < 3 ? '#1F3A34' : 'rgba(31,58,52,0.08)', color: i < 3 ? '#C2AA6A' : '#1F3A34' }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 rounded" style={{ backgroundColor: 'rgba(31,58,52,0.22)', width: `${60 - i * 4}%` }} />
                      <div className="h-3 rounded mt-2" style={{ backgroundColor: 'rgba(31,58,52,0.12)', width: '40%' }} />
                    </div>
                    <div className="h-6 w-16 rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(194,170,106,0.35)' }} />
                  </div>
                ))}
              </div>

              {/* lock overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(244,237,228,0.9))' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-3"
                  style={{ backgroundColor: '#1F3A34' }}
                >
                  <LockClosedIcon className="w-5 h-5" style={{ color: '#C2AA6A' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#1F3A34' }}>
                  {matchCount} platform{matchCount === 1 ? '' : 's'}, sorted by pay
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(31,58,52,0.6)' }}>
                  Names, pay rates & sign-up links unlock below
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT: the offer --- */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute rounded-[1.75rem] hidden sm:block"
              style={{ top: '14px', left: '14px', right: '-12px', bottom: '-12px', backgroundColor: '#1F3A34', opacity: 0.9, zIndex: 0 }}
            />
            <div
              className="relative rounded-[1.75rem] p-7 md:p-9 shadow-xl"
              style={{ backgroundColor: 'white', border: '1px solid #EDE4D8', zIndex: 1 }}
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold mb-5" style={{ color: '#1F3A34' }}>
                Unlock your full report
              </h2>
              <ul className="space-y-3 mb-7">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: 'rgba(194,170,106,0.18)' }}
                    >
                      <CheckCircleIcon className="w-4 h-4" style={{ color: '#9a7d3a' }} />
                    </span>
                    <span className="text-sm md:text-[15px] font-medium leading-snug" style={{ color: '#1F3A34' }}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div
                className="flex items-center justify-center gap-3 py-5 mb-6 rounded-2xl"
                style={{ backgroundColor: '#FBF7F1', border: '1px solid #EDE4D8' }}
              >
                <span className="font-serif font-bold leading-none" style={{ color: '#1F3A34', fontSize: '3.5rem' }}>
                  $5
                </span>
                <div className="text-left">
                  <div
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: '#C2AA6A', color: '#1F3A34' }}
                  >
                    One-time
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'rgba(31,58,52,0.6)' }}>
                    No subscription · yours forever
                  </div>
                </div>
              </div>

              <button
                onClick={onUnlock}
                disabled={loading}
                className="btn-primary gap-2.5 w-full justify-center text-base md:text-lg font-semibold"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'wait' : 'pointer',
                  paddingTop: '0.95rem',
                  paddingBottom: '0.95rem',
                }}
              >
                {loading ? (
                  'Redirecting to checkout…'
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Unlock my report — $5
                  </>
                )}
              </button>
              {error && (
                <p className="text-sm mt-3 text-center" style={{ color: '#9a4a38' }}>
                  {error}
                </p>
              )}

              {/* reassurance row */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-5">
                {['Secure Stripe checkout', 'Instant access', 'Emailed to you'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(31,58,52,0.55)' }}>
                    <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* restart */}
        <div className="text-center mt-10">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: 'rgba(31,58,52,0.6)' }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Change my answers
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileChip({ label }: { label: string }) {
  return (
    <span
      className="text-xs font-medium px-3 py-1.5 rounded-full"
      style={{ backgroundColor: 'white', color: '#1F3A34', border: '1px solid #EDE4D8' }}
    >
      {label}
    </span>
  )
}

function MatchedCard({ result, rank }: { result: ReturnType<typeof matchAll>[number]; rank: number }) {
  const { platform: p } = result
  const isTop = rank <= 3

  return (
    <div
      className="pf-card pf-card-matched rounded-2xl bg-white overflow-hidden"
      style={{ border: `1px solid ${rank === 1 ? 'rgba(194,170,106,0.55)' : '#EDE4D8'}` }}
    >
      <div className="p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold"
            style={{
              backgroundColor: isTop ? '#1F3A34' : 'rgba(31,58,52,0.06)',
              color: isTop ? '#C2AA6A' : '#1F3A34',
            }}
          >
            {rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight" style={{ color: '#1F3A34' }}>
                {p.name}
              </h3>
              {rank === 1 && (
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#C2AA6A', color: '#1F3A34' }}
                >
                  Best match
                </span>
              )}
            </div>
            <p className="text-lg md:text-xl font-bold mt-1" style={{ color: '#1F3A34' }}>
              {p.hourlyRate}
            </p>
          </div>

          {p.signupUrl && (
            <a
              href={p.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 flex-shrink-0 hidden sm:inline-flex"
            >
              Visit site
            </a>
          )}
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <Stat label="TEFL" value={teflLabel(p.tefl)} />
          <Stat label="Students" value={studentAgeLabel(p.students)} />
          <Stat label="Min hrs / week" value={p.minHoursPerWeek === 0 ? 'None' : `${p.minHoursPerWeek} hrs`} />
          <Stat label="Experience" value={p.minYearsExperience === 0 ? 'None' : `${p.minYearsExperience}+ yrs`} />
        </div>

        {p.notes && (
          <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
            {p.notes}
          </p>
        )}

        {p.signupUrl && (
          <a
            href={p.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2.5 mt-5 w-full justify-center sm:hidden"
          >
            Visit site
          </a>
        )}
      </div>
    </div>
  )
}

function ExcludedCard({ result }: { result: ReturnType<typeof matchAll>[number] }) {
  const { platform: p, reasons } = result

  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{ backgroundColor: '#FBF7F1', border: '1px solid rgba(31,58,52,0.1)' }}
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="text-base md:text-lg font-serif font-bold" style={{ color: 'rgba(31,58,52,0.85)' }}>
          {p.name}
        </h3>
        <p className="text-sm font-semibold" style={{ color: 'rgba(31,58,52,0.55)' }}>
          {p.hourlyRate}
        </p>
      </div>

      {reasons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <span
              key={reason}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg"
              style={{ backgroundColor: 'rgba(180,80,60,0.08)', color: '#9a4a38' }}
            >
              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="3" x2="9" y2="9" />
                <line x1="9" y1="3" x2="3" y2="9" />
              </svg>
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: '#FBF7F1', border: '1px solid #EDE4D8' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(31,58,52,0.5)' }}>
        {label}
      </p>
      <p className="text-sm font-semibold leading-snug" style={{ color: '#1F3A34' }}>
        {value}
      </p>
    </div>
  )
}

function audienceLabel(a: AudienceChoice): string {
  switch (a) {
    case 'young_learners':
      return 'Young learners'
    case 'k12':
      return 'K-12'
    case 'teens_adults':
      return 'Teens & adults'
    case 'adults':
      return 'Adults only'
    case 'any':
      return 'Any age'
  }
}

function experienceLabel(e: ExperienceLevel): string {
  switch (e) {
    case 'none':
      return 'No experience'
    case 'under_1':
      return '< 1 yr exp'
    case '1_to_2':
      return '1–2 yrs exp'
    case '3_plus':
      return '3+ yrs exp'
  }
}

function hoursLabel(h: HoursBucket): string {
  switch (h) {
    case 'under_5':
      return '< 5 hrs/wk'
    case '5_to_10':
      return '5–10 hrs/wk'
    case '10_to_20':
      return '10–20 hrs/wk'
    case '20_plus':
      return '20+ hrs/wk'
  }
}

// ============================================================
// Marketing journey — the "why this is the right tool" story
// ============================================================

function SectionEyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
      <span
        className="text-xs uppercase tracking-[0.25em] font-semibold"
        style={{ color: onDark ? '#C2AA6A' : 'rgba(31,58,52,0.7)' }}
      >
        {children}
      </span>
    </div>
  )
}

function WhySection() {
  const nativeOnlyCount = PLATFORMS.filter((p) => p.nativeOnly).length
  const teflRequiredCount = PLATFORMS.filter((p) => p.tefl === 'required').length
  const restrictedCount = PLATFORMS.filter((p) => p.location !== 'worldwide').length

  const problems = [
    {
      icon: LanguageIcon,
      stat: `${nativeOnlyCount} of 33`,
      title: 'Hire native speakers only',
      desc: 'Apply to the wrong one as a non-native and you’re rejected before you start — no matter how good you are.',
    },
    {
      icon: MapPinIcon,
      stat: `${restrictedCount} of 33`,
      title: 'Lock hiring to certain countries',
      desc: 'Some only take teachers from the US, UK or a short list of nations. Your passport quietly rules them out.',
    },
    {
      icon: AcademicCapIcon,
      stat: `${teflRequiredCount} of 33`,
      title: 'Require a TEFL or degree',
      desc: 'Credentials are mandatory at some platforms and irrelevant at others. Guess wrong and you waste the application.',
    },
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>Why teachers get stuck</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: '#1F3A34' }}>
            Applying blind burns weeks of your time
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.72)' }}>
            Every platform has different, unwritten rules — and they rarely tell you upfront. Most teachers
            find out they were never eligible only after filling in a long application. The Platform Finder
            checks all of it in seconds, so you only apply where you can actually get hired.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-7 bg-white h-full"
              style={{ border: '1px solid #EDE4D8' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(194,170,106,0.16)' }}
              >
                <p.icon className="w-6 h-6" style={{ color: '#9a7d3a' }} />
              </div>
              <p className="text-2xl font-bold font-serif mb-1" style={{ color: '#1F3A34' }}>
                {p.stat}
              </p>
              <p className="text-base font-semibold mb-2.5" style={{ color: '#1F3A34' }}>
                {p.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ onStart }: { onStart: () => void }) {
  const steps = [
    {
      n: '01',
      title: 'Tell us about you',
      desc: '7 quick taps — your nationality, location, credentials, who you want to teach and how many hours you can give.',
    },
    {
      n: '02',
      title: 'We match the real rules',
      desc: 'Your profile is checked against every hiring requirement of all 33 platforms in seconds — nothing generic.',
    },
    {
      n: '03',
      title: 'Get your ranked shortlist',
      desc: 'See exactly which platforms will hire you, sorted highest-pay first, plus the ones that ruled you out and why.',
    },
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
            From guessing to a shortlist in under a minute
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div
                className="rounded-2xl p-8 bg-white h-full"
                style={{ border: '1px solid #EDE4D8' }}
              >
                <span
                  className="text-5xl font-bold font-serif block mb-5"
                  style={{ color: 'rgba(194,170,106,0.55)' }}
                >
                  {s.n}
                </span>
                <h3 className="text-xl font-serif font-bold mb-3" style={{ color: '#1F3A34' }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.68)' }}>
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRightIcon
                  className="w-6 h-6 absolute top-1/2 -right-3 -translate-y-1/2 z-10 hidden md:block"
                  style={{ color: '#C2AA6A' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <button onClick={onStart} className="btn-primary gap-2 text-base px-7 py-3">
            Start the finder
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function WhatWeCheck() {
  const checks = [
    { icon: LanguageIcon, title: 'Native or non-native', desc: 'Filters out the platforms that hire native speakers only — and highlights the many that don’t.' },
    { icon: MapPinIcon, title: 'Your country', desc: 'Respects every country restriction so you never apply somewhere you can’t legally be hired.' },
    { icon: AcademicCapIcon, title: 'TEFL / CELTA', desc: 'Knows which platforms require certification, which prefer it, and which don’t care.' },
    { icon: BriefcaseIcon, title: 'University degree', desc: 'Screens the degree-required platforms so a missing diploma never wastes an application.' },
    { icon: UserGroupIcon, title: 'Who you teach', desc: 'Matches you to young learners, teens, adults or all-ages roles based on what you enjoy.' },
    { icon: ClockIcon, title: 'Weekly hours', desc: 'Drops platforms with minimum-hour commitments you can’t realistically meet.' },
    { icon: BoltIcon, title: 'Teaching experience', desc: 'Accounts for experience minimums so beginner-friendly options rise to the top.' },
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>Why it’s accurate</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: '#1F3A34' }}>
            Seven checks most job boards skip
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.72)' }}>
            A generic list tells everyone the same thing. The Platform Finder runs your answers through the
            same seven filters a hiring team would — and then ranks the survivors by pay.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {checks.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-6 bg-white flex gap-4 items-start h-full"
              style={{ border: '1px solid #EDE4D8' }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#1F3A34' }}
              >
                <c.icon className="w-6 h-6" style={{ color: '#C2AA6A' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: '#1F3A34' }}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)' }}>
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
          {/* ranked-by-pay closer card */}
          <div
            className="rounded-2xl p-6 flex gap-4 items-start h-full"
            style={{ backgroundColor: '#1F3A34' }}
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(194,170,106,0.2)' }}
            >
              <BanknotesIcon className="w-6 h-6" style={{ color: '#C2AA6A' }} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: 'white' }}>
                Then ranked by pay
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Your matches arrive sorted from highest hourly rate down, so your time goes where it earns most.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlatformWall() {
  const names = PLATFORMS.map((p) => p.name)
  const half = Math.ceil(names.length / 2)
  const rowA = names.slice(0, half)
  const rowB = names.slice(half)

  const Pill = ({ name }: { name: string }) => (
    <span
      className="inline-flex items-center flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium mx-1.5"
      style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(194,170,106,0.25)', color: 'rgba(255,255,255,0.9)' }}
    >
      {name}
    </span>
  )

  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: '#1F3A34' }}>
      <div className="container">
        <div className="max-w-3xl mb-10">
          <SectionEyebrow onDark>The full landscape</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: 'white' }}>
            All {PLATFORMS.length} platforms, compared in one place
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            From the big names to the ones you’ve never heard of — VIPKid, Cambly, Preply, iTalki, Lingoda,
            Outschool and dozens more. We track their pay, requirements and restrictions so you don’t have to.
          </p>
        </div>
      </div>

      {/* two marquee rows */}
      <div className="space-y-3 select-none" aria-hidden>
        <div className="pf-marquee">
          <div className="pf-marquee-track">
            {[...rowA, ...rowA].map((n, i) => (
              <Pill key={`a-${i}`} name={n} />
            ))}
          </div>
        </div>
        <div className="pf-marquee">
          <div className="pf-marquee-track pf-marquee-reverse">
            {[...rowB, ...rowB].map((n, i) => (
              <Pill key={`b-${i}`} name={n} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ReportPreview({ onStart }: { onStart: () => void }) {
  const benefits = [
    'Every platform you qualify for, ranked by pay',
    'Direct sign-up links so you can apply today',
    'The exact TEFL, degree & experience bar for each',
    'The full list of platforms that ruled you out — and why',
    'A copy emailed to you, so you never lose your results',
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionEyebrow>Your report</SectionEyebrow>
            <h2 className="heading-lg mb-5" style={{ color: '#1F3A34' }}>
              One report. Every platform that will hire you. $5.
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(31,58,52,0.72)' }}>
              Answer 7 quick questions, then unlock your complete personalised report for a one-time
              <strong style={{ color: '#1F3A34' }}> $5</strong> — no subscription, no hidden fees, yours
              to keep forever.
            </p>
            <ul className="space-y-3.5 mb-9">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: 'rgba(194,170,106,0.18)' }}
                  >
                    <CheckCircleIcon className="w-5 h-5" style={{ color: '#9a7d3a' }} />
                  </span>
                  <span className="text-base font-medium" style={{ color: '#1F3A34' }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <button onClick={onStart} className="btn-primary gap-2 text-base px-7 py-3">
              Start the finder
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* price card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute rounded-[2rem] hidden sm:block"
              style={{ top: '16px', left: '16px', right: '-12px', bottom: '-12px', backgroundColor: '#C2AA6A', opacity: 0.35, zIndex: 0 }}
            />
            <div
              className="relative rounded-[2rem] p-9 md:p-11 text-center shadow-xl"
              style={{ backgroundColor: 'white', border: '1px solid #EDE4D8', zIndex: 1 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: '#1F3A34', color: 'white' }}
              >
                <LockClosedIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                Full personalised report
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="font-serif font-bold leading-none" style={{ color: '#1F3A34', fontSize: '4.5rem' }}>
                  $5
                </span>
                <div className="text-left">
                  <div
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: '#C2AA6A', color: '#1F3A34' }}
                  >
                    One-time
                  </div>
                  <div className="text-sm mt-1.5" style={{ color: 'rgba(31,58,52,0.6)' }}>
                    Yours to keep — forever
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-1" style={{ color: 'rgba(31,58,52,0.6)' }}>
                No subscription. Secure checkout via Stripe.
              </p>
              <p className="text-sm" style={{ color: 'rgba(31,58,52,0.6)' }}>
                Results emailed straight to your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinderFaq() {
  const faqs = [
    {
      q: 'How much does it cost?',
      a: 'The Platform Finder is a one-time $5 — no subscription and no hidden fees. That unlocks your complete personalised report: every platform you qualify for, ranked by pay, with direct sign-up links and the exact requirements for each, emailed to you to keep forever.',
    },
    {
      q: 'Where does the data come from?',
      a: 'We track the publicly stated hiring requirements — nationality, location, TEFL, degree, age groups, hours and experience — across 33 leading online English teaching platforms, and keep them updated for 2026.',
    },
    {
      q: 'I’m not a native English speaker. Is this for me?',
      a: 'Especially. Plenty of platforms hire strong non-native teachers, but they’re mixed in with ones that never will. The finder surfaces exactly which ones are open to you.',
    },
    {
      q: 'Will these platforms definitely hire me?',
      a: 'We filter out every platform whose stated rules you don’t meet, so you stop wasting time on impossible applications. The final hiring decision is always theirs — but you’ll be applying where you actually qualify.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'No account needed. After your one-time payment we email your full report straight to you, so you always have it on hand.',
    },
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionEyebrow>
              <span className="inline-block">Questions</span>
            </SectionEyebrow>
            <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
              Good to know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white overflow-hidden"
                style={{ border: '1px solid #EDE4D8' }}
              >
                <summary
                  className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5"
                  style={{ color: '#1F3A34' }}
                >
                  <span className="text-base md:text-lg font-semibold">{f.q}</span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform group-open:rotate-45"
                    style={{ backgroundColor: 'rgba(31,58,52,0.06)' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="8" y1="3" x2="8" y2="13" />
                      <line x1="3" y1="8" x2="13" y2="8" />
                    </svg>
                  </span>
                </summary>
                <p className="px-6 pb-5 -mt-1 text-sm md:text-base leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta({
  onStart,
  answeredCount,
  totalSteps,
}: {
  onStart: () => void
  answeredCount: number
  totalSteps: number
}) {
  const started = answeredCount > 0
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div
          className="relative rounded-[2.5rem] overflow-hidden px-8 py-14 md:px-16 md:py-20 text-center"
          style={{ backgroundColor: '#1F3A34' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(70% 60% at 50% 0%, rgba(194,170,106,0.22), transparent 60%)' }}
          />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="heading-lg mb-5" style={{ color: 'white' }}>
              {started
                ? `You’re ${answeredCount}/${totalSteps} of the way there`
                : 'Ready to stop guessing?'}
            </h2>
            <p className="text-lg leading-relaxed mb-9" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {started
                ? 'Pick up right where you left off and see every platform that will hire you — ranked by pay.'
                : 'Answer 7 quick questions and get a personalised shortlist of the online English teaching platforms that will actually hire you.'}
            </p>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-lg text-base md:text-lg font-semibold transition-all hover:brightness-105"
              style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', letterSpacing: '0.02em' }}
            >
              {started ? 'Finish my matches' : 'Get my platform report'}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <p className="text-sm mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              One-time $5 · No subscription · Under a minute
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
