'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { track, trackingContext } from '@/lib/trackClient'
import {
  ArrowRightIcon,
  LockClosedIcon,
  CheckCircleIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  UsersIcon,
  LightBulbIcon,
  SparklesIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'

// A few real debate topics from the library, used for the free interactive
// taster in the hero — a genuine taste of what the full generator delivers.
type Sample = {
  question: string
  keywords: { keyword: string; example: string }[]
}

const SAMPLE_DEBATES: Sample[] = [
  {
    question: 'Should school uniforms be mandatory?',
    keywords: [
      { keyword: 'Identity', example: "School uniforms can suppress students' sense of identity by preventing them from expressing their individuality through clothing choices." },
      { keyword: 'Discipline', example: 'Proponents argue that mandatory uniforms promote discipline by creating a structured environment that reduces distractions and focuses students on learning.' },
      { keyword: 'Equality', example: 'Uniforms can promote equality by eliminating visible differences in socioeconomic status, ensuring all students are treated the same regardless of their background.' },
      { keyword: 'Tradition', example: 'Many schools maintain the tradition of uniforms as a way to preserve institutional values and create a sense of belonging to the school community.' },
      { keyword: 'Expression', example: "Opponents argue that clothing is a form of self-expression and that restricting it limits students' ability to develop their personal identity." },
    ],
  },
  {
    question: 'Is social media doing more harm than good?',
    keywords: [
      { keyword: 'Wellbeing', example: 'Social media can negatively impact mental wellbeing through constant comparison, cyberbullying, and the pressure to maintain a perfect online image.' },
      { keyword: 'Influence', example: 'The influence of social media extends beyond entertainment, shaping public opinion, political discourse, and cultural trends in unprecedented ways.' },
      { keyword: 'Privacy', example: 'Privacy concerns arise when social media companies collect and monetize user data without transparent consent.' },
      { keyword: 'Misinformation', example: 'The rapid spread of misinformation on social media can have serious consequences, from health scares to political manipulation.' },
      { keyword: 'Behaviour', example: 'Social media can alter behaviour patterns, creating addiction-like dependencies and reducing face-to-face interaction.' },
    ],
  },
  {
    question: 'Should the voting age be lowered to 16?',
    keywords: [
      { keyword: 'Responsibility', example: 'Lowering the voting age to 16 would give young people a say in decisions that directly affect their future, such as climate and education policy.' },
      { keyword: 'Engagement', example: 'Allowing 16-year-olds to vote could increase political engagement and establish voting as a lifelong habit from an earlier age.' },
      { keyword: 'Maturity', example: 'Critics question whether 16-year-olds have sufficient maturity and life experience to make informed decisions on complex issues.' },
      { keyword: 'Representation', example: "Lowering the voting age would improve representation of young people's interests in government." },
      { keyword: 'Participation', example: 'Early participation in democracy could foster a stronger sense of civic duty throughout life.' },
    ],
  },
]

const TOPIC_WALL = [
  'Should school uniforms be mandatory?',
  'Is social media doing more harm than good?',
  'Is AI a threat to human jobs?',
  'Should university education be free?',
  'Do dating apps make relationships less meaningful?',
  'Should schools ban AI tools like ChatGPT?',
  'Is cancel culture a necessary form of accountability?',
  'Are self-driving cars a good idea?',
  'Should companies offer a four-day workweek?',
  'Is homework necessary for academic success?',
  'Should junk food be heavily taxed?',
  'Is working from home better than the office?',
  'Should we be worried about deepfake technology?',
  'Are video games more beneficial than harmful?',
  'Is veganism the future of food?',
  'Should the voting age be lowered to 16?',
  'Do grades reflect intelligence?',
  'Should students learn a second language?',
]

export default function DebateGeneratorPaywall({ loggedIn }: { loggedIn: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pricingRef = useRef<HTMLElement>(null)

  const NEXT = '/teachers/debategenerator'
  // The debate topic is fixed (one taste of the library, no reset), but the five
  // keywords stay interactive so visitors can feel the vocabulary feature.
  const sample = SAMPLE_DEBATES[0]
  const [selectedKeyword, setSelectedKeyword] = useState(sample.keywords[0].keyword)
  const selectedExample = sample.keywords.find((k) => k.keyword === selectedKeyword) ?? sample.keywords[0]

  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function handlePurchase() {
    if (!loggedIn) {
      window.location.href = `/auth/login?next=${encodeURIComponent(NEXT)}`
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/debate-generator/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        track('debate', 'checkout_start', { value: 7 })
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#F4EDE4' }}>
      {/* ============ HERO + INTERACTIVE SAMPLE ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(120% 80% at 85% -10%, rgba(194,170,106,0.18), transparent 55%), radial-gradient(90% 70% at 0% 0%, rgba(31,58,52,0.06), transparent 45%), #F4EDE4',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{ backgroundImage: 'radial-gradient(rgba(31,58,52,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />

        <div className="container relative pt-14 md:pt-20 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
            <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'rgba(31,58,52,0.7)' }}>
              For English teachers &amp; students
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-start">
            {/* Left: pitch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="lg:pt-4"
            >
              <h1 className="heading-xl mb-6" style={{ color: '#1F3A34' }}>
                Never run out of things to{' '}
                <span style={{ color: '#C2AA6A' }}>debate</span>.
              </h1>
              <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'rgba(31,58,52,0.72)' }}>
                One click gives you a thought-provoking debate question and{' '}
                <strong style={{ color: '#1F3A34' }}>five vocabulary words</strong> — each with a model
                sentence your students can borrow. Instant speaking practice, zero prep.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-9">
                {[
                  { icon: SparklesIcon, label: 'Hundreds of ready-to-use topics' },
                  { icon: ChatBubbleLeftRightIcon, label: 'Vocabulary + example sentences' },
                  { icon: BanknotesIcon, label: 'One-time $7 · lifetime access' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(31,58,52,0.75)' }}>
                    <Icon className="w-4 h-4" style={{ color: '#C2AA6A' }} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg pt-8" style={{ borderTop: '1px solid rgba(31,58,52,0.12)' }}>
                {[
                  { value: '300+', label: 'Debate topics' },
                  { value: '5', label: 'Vocab words each' },
                  { value: '$7', label: 'One-time, forever' },
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

            {/* Right: interactive sample console */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div
                aria-hidden
                className="absolute rounded-[2rem] hidden sm:block"
                style={{ top: '18px', left: '18px', right: '-14px', bottom: '-14px', backgroundColor: '#1F3A34', opacity: 0.9, zIndex: 0 }}
              />
              <div
                className="relative rounded-[2rem] shadow-2xl overflow-hidden"
                style={{ backgroundColor: 'white', border: '1px solid #EDE4D8', zIndex: 1 }}
              >
                {/* strip */}
                <div className="flex items-center justify-between px-6 md:px-7 py-4" style={{ borderBottom: '1px solid #EDE4D8', backgroundColor: '#FBF7F1' }}>
                  <span className="text-sm font-semibold" style={{ color: '#1F3A34' }}>
                    Try it now — free sample
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(194,170,106,0.2)', color: '#9a7d3a' }}>
                    Live demo
                  </span>
                </div>

                <div className="px-6 md:px-8 py-7 md:py-8">
                  {/* question */}
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: '#C2AA6A' }}>
                    Your debate topic
                  </p>
                  <div className="rounded-2xl p-5 md:p-6 mb-6" style={{ backgroundColor: 'rgba(31,58,52,0.05)', border: '1px solid rgba(31,58,52,0.08)' }}>
                    <h2 className="text-xl md:text-2xl font-serif font-bold leading-snug" style={{ color: '#1F3A34' }}>
                      {sample.question}
                    </h2>
                    <div className="h-1 w-12 rounded-full mt-4" style={{ backgroundColor: '#C2AA6A' }} />
                  </div>

                  {/* keywords — all interactive; the topic itself stays fixed */}
                  <p className="text-sm mb-3" style={{ color: 'rgba(31,58,52,0.65)' }}>
                    💡 Tap a word to see an example sentence:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {sample.keywords.map((k) => {
                      const isSel = selectedKeyword === k.keyword
                      return (
                        <button
                          key={k.keyword}
                          onClick={() => setSelectedKeyword(k.keyword)}
                          data-selected={isSel}
                          className="pf-option text-center px-3 py-3 rounded-xl text-sm font-medium transition-all"
                          style={{ color: isSel ? '#1F3A34' : 'rgba(31,58,52,0.85)' }}
                        >
                          {k.keyword}
                        </button>
                      )
                    })}
                  </div>

                  {/* example for the selected keyword */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedKeyword}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="mt-4 rounded-xl p-4 flex items-start gap-3"
                      style={{ backgroundColor: 'rgba(194,170,106,0.12)', border: '1px solid rgba(194,170,106,0.3)' }}
                    >
                      <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#9a7d3a' }} />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: '#9a7d3a' }}>
                          Example · {selectedExample.keyword}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: '#1F3A34' }}>
                          {selectedExample.example}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* footer */}
                <div className="px-6 md:px-8 py-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid #EDE4D8', backgroundColor: '#FBF7F1' }}>
                  <span className="text-xs" style={{ color: 'rgba(31,58,52,0.5)' }}>
                    Free sample · 1 of 300+ topics
                  </span>
                  <button onClick={scrollToPricing} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1F3A34' }}>
                    Unlock all topics
                    <ArrowRightIcon className="w-4 h-4" style={{ color: '#C2AA6A' }} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ MARKETING JOURNEY ============ */}
      <ProblemSection />
      <HowItWorks onUnlock={scrollToPricing} />
      <Features />
      <TopicsWall />
      <PricingSection
        innerRef={pricingRef}
        loggedIn={loggedIn}
        loading={loading}
        error={error}
        onPurchase={handlePurchase}
        next={NEXT}
      />
      <DebateFaq />
      <FinalCta onUnlock={scrollToPricing} />
    </div>
  )
}

// ============================================================

function SectionEyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
      <span className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: onDark ? '#C2AA6A' : 'rgba(31,58,52,0.7)' }}>
        {children}
      </span>
    </div>
  )
}

function ProblemSection() {
  const problems = [
    { icon: ChatBubbleLeftRightIcon, title: 'Blank stares', desc: 'An open “what do you think?” falls flat. Students need a real hook — a question worth arguing about.' },
    { icon: BoltIcon, title: 'Endless prep', desc: 'Hunting for fresh, level-appropriate topics and vocabulary quietly eats your evenings, every week.' },
    { icon: SparklesIcon, title: 'Thin vocabulary', desc: 'Learners recycle the same twenty words, with no new language to stretch for or make it interesting.' },
  ]
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>Why speaking class stalls</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: '#1F3A34' }}>
            Speaking practice shouldn’t start with silence
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.72)' }}>
            The hardest part of a discussion lesson is the first thirty seconds. Give students a sharp
            question and the words to answer it, and the conversation runs itself.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div key={p.title} className="rounded-2xl p-7 bg-white h-full" style={{ border: '1px solid #EDE4D8' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(194,170,106,0.16)' }}>
                <p.icon className="w-6 h-6" style={{ color: '#9a7d3a' }} />
              </div>
              <p className="text-lg font-semibold mb-2.5 font-serif" style={{ color: '#1F3A34' }}>{p.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ onUnlock }: { onUnlock: () => void }) {
  const steps = [
    { n: '01', title: 'Generate a topic', desc: 'One click serves a thought-provoking debate question, pitched for real classroom discussion.' },
    { n: '02', title: 'Explore the vocabulary', desc: 'Five keywords come with it — each with a model sentence your students can borrow on the spot.' },
    { n: '03', title: 'Debate with confidence', desc: 'Learners argue both sides using fresh language, while you sit back and facilitate.' },
  ]
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="heading-lg" style={{ color: '#1F3A34' }}>
            From blank page to lively debate in one click
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-2xl p-8 bg-white h-full" style={{ border: '1px solid #EDE4D8' }}>
                <span className="text-5xl font-bold font-serif block mb-5" style={{ color: 'rgba(194,170,106,0.55)' }}>{s.n}</span>
                <h3 className="text-xl font-serif font-bold mb-3" style={{ color: '#1F3A34' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.68)' }}>{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRightIcon className="w-6 h-6 absolute top-1/2 -right-3 -translate-y-1/2 z-10 hidden md:block" style={{ color: '#C2AA6A' }} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-10">
          <button onClick={onUnlock} className="btn-primary gap-2 text-base px-7 py-3">
            Get lifetime access
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: SparklesIcon, title: '300+ debate topics', desc: 'A huge, growing library spanning school, tech, society, work and ethics.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Vocabulary that sticks', desc: 'Five keywords per topic, each paired with a natural example sentence to model.' },
    { icon: AcademicCapIcon, title: 'Every level', desc: 'Questions that flex from A2 small talk right up to C2 argumentation.' },
    { icon: UsersIcon, title: '1:1 or whole class', desc: 'Works just as well for a private lesson as for a room full of teenagers.' },
    { icon: LightBulbIcon, title: 'Builds critical thinking', desc: 'Students weigh both sides, not just repeat opinions — real cognitive work.' },
    { icon: BoltIcon, title: 'Zero prep, instant', desc: 'No planning, no printing. Open it and you have a full activity ready to go.' },
  ]
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mb-12">
          <SectionEyebrow>What you get</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: '#1F3A34' }}>
            A complete speaking activity, on tap
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 bg-white flex gap-4 items-start h-full" style={{ border: '1px solid #EDE4D8' }}>
              <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1F3A34' }}>
                <f.icon className="w-6 h-6" style={{ color: '#C2AA6A' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: '#1F3A34' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-6 flex gap-4 items-start h-full" style={{ backgroundColor: '#1F3A34' }}>
            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(194,170,106,0.2)' }}>
              <BanknotesIcon className="w-6 h-6" style={{ color: '#C2AA6A' }} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: 'white' }}>Buy once, keep forever</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                A single $7 payment unlocks the whole library for life — no subscription, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TopicsWall() {
  const half = Math.ceil(TOPIC_WALL.length / 2)
  const rowA = TOPIC_WALL.slice(0, half)
  const rowB = TOPIC_WALL.slice(half)
  const Pill = ({ text }: { text: string }) => (
    <span
      className="inline-flex items-center flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium mx-1.5"
      style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(194,170,106,0.25)', color: 'rgba(255,255,255,0.9)' }}
    >
      {text}
    </span>
  )
  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: '#1F3A34' }}>
      <div className="container">
        <div className="max-w-3xl mb-10">
          <SectionEyebrow onDark>A taste of the library</SectionEyebrow>
          <h2 className="heading-lg mb-5" style={{ color: 'white' }}>
            300+ topics your students will actually want to argue about
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            From smartphones and social media to AI, four-day weeks and the voting age — every topic
            comes loaded with vocabulary and example sentences.
          </p>
        </div>
      </div>
      <div className="space-y-3 select-none" aria-hidden>
        <div className="pf-marquee">
          <div className="pf-marquee-track">
            {[...rowA, ...rowA].map((t, i) => <Pill key={`a-${i}`} text={t} />)}
          </div>
        </div>
        <div className="pf-marquee">
          <div className="pf-marquee-track pf-marquee-reverse">
            {[...rowB, ...rowB].map((t, i) => <Pill key={`b-${i}`} text={t} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection({
  innerRef,
  loggedIn,
  loading,
  error,
  onPurchase,
  next,
}: {
  innerRef: React.RefObject<HTMLElement>
  loggedIn: boolean
  loading: boolean
  error: string | null
  onPurchase: () => void
  next: string
}) {
  const perks = [
    'Every one of the 300+ debate topics',
    'Five keywords with example sentences per topic',
    'Unlimited random generation, whenever you teach',
    'Works for 1:1 lessons and full classrooms',
    'One-time payment — lifetime access, no subscription',
  ]
  return (
    <section ref={innerRef} className="py-16 md:py-24 scroll-mt-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <SectionEyebrow>
            <span className="inline-block w-full text-center">Unlock everything</span>
          </SectionEyebrow>
          <h2 className="heading-lg mb-4" style={{ color: '#1F3A34' }}>
            The whole library for a one-time <span style={{ color: '#C2AA6A' }}>$7</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>
            You’ve tried the sample. Unlock all 300+ topics and never plan a speaking lesson from scratch again.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* offer */}
          <div className="relative">
            <div aria-hidden className="absolute rounded-[1.75rem] hidden sm:block" style={{ top: '14px', left: '14px', right: '-12px', bottom: '-12px', backgroundColor: '#1F3A34', opacity: 0.9, zIndex: 0 }} />
            <div className="relative rounded-[1.75rem] p-7 md:p-9 shadow-xl" style={{ backgroundColor: 'white', border: '1px solid #EDE4D8', zIndex: 1 }}>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-5" style={{ color: '#1F3A34' }}>
                Lifetime access for teachers &amp; students
              </h3>
              <ul className="space-y-3 mb-7">
                {perks.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'rgba(194,170,106,0.18)' }}>
                      <CheckCircleIcon className="w-4 h-4" style={{ color: '#9a7d3a' }} />
                    </span>
                    <span className="text-sm md:text-[15px] font-medium leading-snug" style={{ color: '#1F3A34' }}>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center gap-3 py-5 mb-6 rounded-2xl" style={{ backgroundColor: '#FBF7F1', border: '1px solid #EDE4D8' }}>
                <span className="font-serif font-bold leading-none" style={{ color: '#1F3A34', fontSize: '3.5rem' }}>$7</span>
                <div className="text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: '#C2AA6A', color: '#1F3A34' }}>
                    One-time
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'rgba(31,58,52,0.6)' }}>Lifetime · no subscription</div>
                </div>
              </div>

              <button
                onClick={onPurchase}
                disabled={loading}
                className="btn-primary gap-2.5 w-full justify-center text-base md:text-lg font-semibold"
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer', paddingTop: '0.95rem', paddingBottom: '0.95rem' }}
              >
                {loading ? (
                  'Redirecting…'
                ) : loggedIn ? (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Get lifetime access — $7
                  </>
                ) : (
                  <>
                    Log in to unlock
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>

              {!loggedIn && (
                <p className="text-center text-sm mt-3" style={{ color: 'rgba(31,58,52,0.65)' }}>
                  New here?{' '}
                  <a href={`/auth/signup?next=${encodeURIComponent(next)}`} className="font-semibold hover:underline" style={{ color: '#9a7d3a' }}>
                    Create an account
                  </a>
                </p>
              )}
              {error && <p className="text-sm mt-3 text-center" style={{ color: '#9a4a38' }}>{error}</p>}

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-5">
                {['Secure Stripe checkout', 'Instant access', 'Yours forever'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'rgba(31,58,52,0.55)' }}>
                    <CheckCircleIcon className="w-3.5 h-3.5" style={{ color: '#C2AA6A' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DebateFaq() {
  const faqs = [
    { q: 'How much does it cost?', a: 'A one-time $7 — no subscription and no hidden fees. That unlocks the entire library of 300+ debate topics, with vocabulary and example sentences, for life.' },
    { q: 'Who is it for?', a: 'English teachers running speaking and discussion lessons, and students who want to practise argumentation and build vocabulary. It works for 1:1 tutoring and whole classes alike.' },
    { q: 'What exactly do I get with each topic?', a: 'A debate question plus five keywords, and each keyword comes with a natural example sentence students can model — so they always have language to reach for.' },
    { q: 'Do I need to prepare anything?', a: 'Nothing. Open the generator, click for a topic, and you have a complete speaking activity ready to run — no planning or printing required.' },
    { q: 'Is it really lifetime access?', a: 'Yes. Pay once and it’s yours forever, with no recurring charges. Any new topics added to the library are included.' },
  ]
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionEyebrow><span className="inline-block w-full text-center">Questions</span></SectionEyebrow>
            <h2 className="heading-lg" style={{ color: '#1F3A34' }}>Good to know</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #EDE4D8' }}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5" style={{ color: '#1F3A34' }}>
                  <span className="text-base md:text-lg font-semibold">{f.q}</span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform group-open:rotate-45" style={{ backgroundColor: 'rgba(31,58,52,0.06)' }}>
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="8" y1="3" x2="8" y2="13" />
                      <line x1="3" y1="8" x2="13" y2="8" />
                    </svg>
                  </span>
                </summary>
                <p className="px-6 pb-5 -mt-1 text-sm md:text-base leading-relaxed" style={{ color: 'rgba(31,58,52,0.7)' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onUnlock }: { onUnlock: () => void }) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#F4EDE4' }}>
      <div className="container">
        <div className="relative rounded-[2.5rem] overflow-hidden px-8 py-14 md:px-16 md:py-20 text-center" style={{ backgroundColor: '#1F3A34' }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 60% at 50% 0%, rgba(194,170,106,0.22), transparent 60%)' }} />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="heading-lg mb-5" style={{ color: 'white' }}>Ready for debates that run themselves?</h2>
            <p className="text-lg leading-relaxed mb-9" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Unlock all 300+ topics — with vocabulary and example sentences — for a one-time $7, and never plan a speaking lesson from scratch again.
            </p>
            <button
              onClick={onUnlock}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-lg text-base md:text-lg font-semibold transition-all hover:brightness-105"
              style={{ backgroundColor: '#C2AA6A', color: '#1F3A34', letterSpacing: '0.02em' }}
            >
              Get lifetime access — $7
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <p className="text-sm mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              One-time $7 · Lifetime access · Secure Stripe checkout
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
