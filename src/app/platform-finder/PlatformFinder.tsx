'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
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
  const [showResults, setShowResults] = useState(false)
  const [showAllExcluded, setShowAllExcluded] = useState(false)

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

  function setAnswer(step: Step, value: string) {
    setAnswers((a) => ({ ...a, [step]: value }))
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
      setShowResults(true)
    } else {
      setStepIdx((i) => i + 1)
    }
  }

  function handleBack() {
    if (stepIdx > 0) setStepIdx((i) => i - 1)
  }

  function handleRestart() {
    setAnswers({})
    setStepIdx(0)
    setShowResults(false)
    setShowAllExcluded(false)
  }

  if (showResults && profile) {
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
            Find your <span style={{ color: '#C2AA6A' }}>perfect platform</span> to teach
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
            Answer seven quick questions and we'll match you to the online teaching platforms that actually
            hire teachers like you — ranked by pay and fit.
          </p>
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
                          onClick={() =>
                            isMulti
                              ? toggleMultiAnswer(currentQuestion.step, opt.value)
                              : setAnswer(currentQuestion.step, opt.value)
                          }
                          className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 flex items-center gap-3"
                          style={{
                            backgroundColor: selected ? 'rgba(31,58,52,0.06)' : 'transparent',
                            border: `1.5px solid ${selected ? '#1F3A34' : '#EDE4D8'}`,
                          }}
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
          <div className="max-w-4xl mx-auto space-y-3">
            {matched.map((r, idx) => (
              <PlatformCard key={r.platform.name} result={r} rank={idx + 1} matched />
            ))}
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
            <div className="space-y-3">
              {excludedToShow.map((r) => (
                <PlatformCard key={r.platform.name} result={r} matched={false} />
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

function PlatformCard({
  result,
  rank,
  matched,
}: {
  result: ReturnType<typeof matchAll>[number]
  rank?: number
  matched: boolean
}) {
  const { platform: p, reasons } = result

  return (
    <div
      className="rounded-2xl p-5 md:p-6 transition-all"
      style={{
        backgroundColor: matched ? 'white' : 'rgba(255,255,255,0.5)',
        border: `1px solid ${matched ? '#EDE4D8' : 'rgba(31,58,52,0.08)'}`,
        opacity: matched ? 1 : 0.75,
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {matched && rank !== undefined && (
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
              style={{
                backgroundColor: rank <= 3 ? '#1F3A34' : 'rgba(31,58,52,0.08)',
                color: rank <= 3 ? '#C2AA6A' : '#1F3A34',
              }}
            >
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg md:text-xl font-serif font-bold" style={{ color: '#1F3A34' }}>
                {p.name}
              </h3>
              {matched && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(194,170,106,0.18)', color: '#8a7434' }}
                >
                  Match
                </span>
              )}
            </div>
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#1F3A34' }}>
              {p.hourlyRate}
            </p>
          </div>
        </div>
        {matched && p.signupUrl && (
          <a
            href={p.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs px-4 py-2 flex-shrink-0 hidden sm:inline-flex"
          >
            Visit site
          </a>
        )}
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
        <Detail label="TEFL" value={teflLabel(p.tefl)} />
        <Detail label="Students" value={studentAgeLabel(p.students)} />
        <Detail
          label="Min hrs/wk"
          value={p.minHoursPerWeek === 0 ? 'None' : `${p.minHoursPerWeek} hrs`}
        />
        <Detail
          label="Experience"
          value={p.minYearsExperience === 0 ? 'None' : `${p.minYearsExperience}+ yrs`}
        />
      </div>

      {p.notes && (
        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)' }}>
          {p.notes}
        </p>
      )}

      {!matched && reasons.length > 0 && (
        <div
          className="mt-4 pt-4 text-xs"
          style={{ borderTop: '1px solid rgba(31,58,52,0.08)', color: 'rgba(31,58,52,0.6)' }}
        >
          <span className="font-semibold" style={{ color: 'rgba(31,58,52,0.75)' }}>Why excluded:</span>{' '}
          {reasons.join(' · ')}
        </div>
      )}

      {matched && p.signupUrl && (
        <a
          href={p.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs px-4 py-2 mt-4 w-full justify-center sm:hidden"
        >
          Visit site
        </a>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(31,58,52,0.45)' }}>
        {label}
      </p>
      <p className="font-medium" style={{ color: '#1F3A34' }}>
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
