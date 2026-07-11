'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ArrowPathIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import {
  matchAll,
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
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Could not start checkout')
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Something went wrong. Please try again.')
      setCheckoutLoading(false)
    }
  }

  function setAnswer(step: Step, value: string) {
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
          matchCount={matched.length}
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

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <h1 className="heading-lg mb-4" style={{ color: '#1F3A34' }}>
            Stop guessing where to <span style={{ color: '#C2AA6A' }}>teach English online</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'rgba(31,58,52,0.72)' }}>
            There are dozens of platforms and most will waste your time. Answer seven quick questions and
            we'll instantly show you exactly which ones will hire you — ranked by pay, so you apply where
            it actually counts.
          </p>

          {/* Slim banner */}
          <div
            className="rounded-lg px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 max-w-2xl mx-auto"
            style={{ backgroundColor: '#1F3A34' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C2AA6A' }}>
              The #1 tool for online English teachers
            </span>
            <span className="hidden sm:block h-4 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                33 platforms compared
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                Under a minute
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                Free — no sign-up
              </span>
            </div>
          </div>
        </div>

        {/* Wizard card */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl shadow-xl overflow-hidden"
            style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
          >
            {/* Progress bar */}
            <div className="px-6 md:px-10 pt-6 md:pt-8">
              <div className="flex items-center justify-between mb-3">
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

            {/* Question */}
            <div className="px-6 md:px-10 py-8 md:py-10" style={{ minHeight: '480px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2
                    className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-3"
                    style={{ color: '#1F3A34' }}
                  >
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="text-sm md:text-base mb-7" style={{ color: 'rgba(31,58,52,0.65)' }}>
                      {currentQuestion.subtitle}
                    </p>
                  )}

                  <div
                    className="space-y-2.5 overflow-y-auto pf-options"
                    style={{ maxHeight: '340px' }}
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
                          className="pf-option w-full text-left px-5 py-4 rounded-xl transition-all duration-150 flex items-center gap-3"
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
                            className="text-sm md:text-base font-medium"
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

            {/* Footer */}
            <div
              className="px-6 md:px-10 py-5 flex items-center justify-between gap-3"
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

          {/* Trust line */}
          <p className="text-center text-xs mt-5" style={{ color: 'rgba(31,58,52,0.45)' }}>
            Based on data from 33 leading online English teaching platforms · Updated 2026
          </p>
        </div>
      </div>
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
  matchCount: number
  onUnlock: () => void
  loading: boolean
  error: string | null
  onRestart: () => void
}

function Paywall({ matchCount, onUnlock, loading, error, onRestart }: PaywallProps) {
  const benefits = [
    'Every platform you qualify for, ranked by pay',
    'Direct sign-up links so you can apply today',
    'The exact TEFL, degree & experience requirements for each',
    'The full list of platforms that ruled you out — and why',
    'A copy emailed to you — so you never lose your results',
  ]
  const skeletonRows = Math.min(3, Math.max(1, matchCount))

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-medium tracking-wide uppercase"
              style={{ backgroundColor: '#1F3A34', color: 'white' }}
            >
              <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
              Your results are ready
            </div>
            <h1 className="heading-lg mb-4" style={{ color: '#1F3A34' }}>
              You match <span style={{ color: '#C2AA6A' }}>{matchCount}</span> platform
              {matchCount === 1 ? '' : 's'}
            </h1>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
              Unlock your personalised report to see every platform you qualify for — ranked by pay,
              with sign-up links and the exact requirements for each.
            </p>
          </div>

          {/* Locked preview */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-xl"
            style={{ border: '1px solid #EDE4D8', backgroundColor: 'white' }}
          >
            <div
              className="p-5 md:p-6 space-y-3"
              style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}
              aria-hidden="true"
            >
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ backgroundColor: '#FBF7F1', border: '1px solid #EDE4D8' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                    style={{ backgroundColor: '#1F3A34', color: '#C2AA6A' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="h-4 rounded" style={{ backgroundColor: 'rgba(31,58,52,0.18)', width: '55%' }} />
                    <div className="h-3 rounded mt-2" style={{ backgroundColor: 'rgba(31,58,52,0.1)', width: '35%' }} />
                  </div>
                </div>
              ))}
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, rgba(244,237,228,0.15), rgba(244,237,228,0.85))' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#1F3A34' }}
              >
                <LockClosedIcon className="w-5 h-5" style={{ color: '#C2AA6A' }} />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-3xl mt-6 p-7 md:p-10 text-center shadow-lg"
            style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-7" style={{ color: '#1F3A34' }}>
              Here's everything you'll unlock
            </h2>
            <ul className="text-left space-y-4 mb-9 max-w-md mx-auto">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3.5">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: 'rgba(194,170,106,0.18)' }}
                  >
                    <CheckCircleIcon className="w-5 h-5" style={{ color: '#C2AA6A' }} />
                  </span>
                  <span className="text-base md:text-lg font-medium leading-snug" style={{ color: '#1F3A34' }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="font-serif font-bold leading-none" style={{ color: '#1F3A34', fontSize: '4rem' }}>
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

            <button
              onClick={onUnlock}
              disabled={loading}
              className="btn-primary gap-2.5 w-full justify-center text-base md:text-lg font-semibold"
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer',
                paddingTop: '1rem',
                paddingBottom: '1rem',
              }}
            >
              {loading ? (
                'Redirecting to checkout…'
              ) : (
                <>
                  <LockClosedIcon className="w-5 h-5" />
                  Unlock my results — $5
                </>
              )}
            </button>
            {error && (
              <p className="text-sm mt-3" style={{ color: '#9a4a38' }}>
                {error}
              </p>
            )}
            <p className="text-xs mt-4" style={{ color: 'rgba(31,58,52,0.5)' }}>
              One-time payment · Secure checkout via Stripe · Results emailed to you
            </p>
          </div>

          <div className="text-center mt-6">
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
