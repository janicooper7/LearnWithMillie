'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const debates = [
  {
    question: 'Should school uniforms be mandatory?',
    keywords: [
      'Dress code',
      'Conformity',
      'Identity expression',
      'Sense of belonging',
      'Socioeconomic divide',
    ],
  },
  {
    question: 'Is social media doing more harm than good?',
    keywords: [
      'Echo chamber',
      'Cyberbullying',
      'Misinformation',
      'Digital footprint',
      'Doomscrolling',
    ],
  },
  {
    question: 'Should the legal voting age be lowered to 16?',
    keywords: [
      'Political engagement',
      'Civic responsibility',
      'Informed electorate',
      'Generation gap',
      'Representation',
    ],
  },
  {
    question: 'Is celebrity culture a bad influence on young people?',
    keywords: [
      'Idolisation',
      'Materialism',
      'Parasocial relationship',
      'Influencer culture',
      'Unrealistic beauty standards',
    ],
  },
  {
    question: 'Should the government ban violent video games?',
    keywords: [
      'Desensitization',
      'Moral panic',
      'Censorship',
      'Freedom of expression',
      'Aggression',
    ],
  },
  {
    question: 'Is traditional marriage still relevant in modern society?',
    keywords: [
      'Social construct',
      'Nuclear family',
      'Cohabitation',
      'Legal recognition',
      'Changing demographic',
    ],
  },
  {
    question: 'Should children be allowed to use smartphones?',
    keywords: [
      'Screen time',
      'Digital literacy',
      'Parental controls',
      'Attention span',
      'Childhood development',
    ],
  },
  {
    question: 'Is cancel culture a necessary form of accountability?',
    keywords: [
      'Public shaming',
      'Call-out culture',
      'Due process',
      'Whole picture',
      'Mob mentality',
    ],
  },
  {
    question: 'Should everyone have to do mandatory community service?',
    keywords: [
      'Civic duty',
      'Volunteering',
      'Skill development',
      'Social cohesion',
      'Altruism',
    ],
  },
  {
    question: 'Is there a point when ambition becomes unhealthy?',
    keywords: [
      'Workaholism',
      'Burnout',
      'Cutthroat competition',
      'Life-work balance',
      'Tunnel vision',
    ],
  },
  {
    question: 'Is AI a threat to human jobs?',
    keywords: [
      'Automation',
      'Job displacement',
      'Reskilling',
      'Human touch',
      'Unemployment',
    ],
  },
  {
    question: 'Would society be better without YouTube?',
    keywords: [
      'Digital dependency',
      'Moderation',
      'Educational',
      'Algorithm',
      'Misinformation',
    ],
  },
  {
    question:
      'Should governments regulate social media platforms more strictly?',
    keywords: [
      'Free speech',
      'Hate speech',
      'Data privacy',
      'Echo chambers',
      'Misinformation',
    ],
  },
  {
    question: 'Are self-driving cars a good idea?',
    keywords: [
      'Liability',
      'Road safety',
      'Human error',
      'Cybersecurity risks',
      'Car accidents',
    ],
  },
  {
    question: 'Should we be worried about deepfake technology?',
    keywords: [
      'Disinformation',
      'Online scams',
      'Manipulation tactics',
      'Trust',
      'Reputation',
    ],
  },
  {
    question: 'Do dating apps make relationships less meaningful?',
    keywords: [
      'Superficial',
      'Genuine connection',
      'Instant gratification',
      'Ghosting',
      'Emotional investment',
    ],
  },
  {
    question: 'Is personality determined more by nature or nurture?',
    keywords: [
      'Predispositions',
      'Genetics',
      'Parenting style',
      'Social environment',
      'Life experiences',
    ],
  },
  {
    question: "Can money truly change someone's personality?",
    keywords: [
      'Isolation',
      'Opportunities',
      'Core traits',
      'Lifestyle',
      'Altered',
    ],
  },
  {
    question: 'Should schools ban ChatGPT and other AI tools?',
    keywords: [
      'Integrity',
      'Plagiarism',
      'Learning aid',
      'Critical thinking',
      'Educational equity',
    ],
  },
  {
    question: 'Are video games more beneficial than harmful?',
    keywords: [
      'Cognitive skills',
      'Addiction',
      'Social interaction',
      'Hand-eye coordination',
      'Escapism',
    ],
  },
  {
    question: 'Should students have to learn a second language?',
    keywords: [
      'Bilingual',
      'Globalisation',
      'Cultural awareness',
      'Opportunity',
      'Proficiency',
    ],
  },
  {
    question: 'Is homework necessary for academic success?',
    keywords: [
      'Reinforcement',
      'Burnout',
      'Time management',
      'Self-discipline',
      'Independent learning',
    ],
  },
  {
    question: 'Should university education be free?',
    keywords: [
      'Tuition fees',
      'Taxpayer-funded',
      'Inequality',
      'Investment',
      'Debt',
    ],
  },
  {
    question: 'Do grades truly reflect intelligence?',
    keywords: [
      'Critical thinking',
      'Standardised testing',
      'Bias',
      'Assessment',
      'Performance',
    ],
  },
  {
    question: 'Is homeschooling better than traditional schooling?',
    keywords: [
      'Tailored',
      'Socialisation',
      'Flexibility',
      'Curriculum',
      'Discipline',
    ],
  },
  {
    question: 'Should schools focus more on practical life skills?',
    keywords: [
      'Real-world',
      'Soft skills',
      'Traditional',
      'Adaptability',
      'Vocational',
    ],
  },
  {
    question: 'Should students have more say in what they learn?',
    keywords: ['Autonomy', 'Engagement', 'Curriculum', 'Voice', 'Motivation'],
  },
  {
    question: 'Is online learning as effective as in-person learning?',
    keywords: [
      'Flexibility',
      'Face-to-face',
      'Self-motivation',
      'Interaction',
      'Hands-on',
    ],
  },
  {
    question: 'Are standardised tests a fair way to measure ability?',
    keywords: ['Consistency', 'Criteria', 'Score', 'Fairness', 'Pressure'],
  },
  {
    question: 'Should financial literacy be a required subject in school?',
    keywords: [
      'Real-world',
      'Awareness',
      'Overload',
      'Inequality',
      'Priorities',
    ],
  },
  {
    question: 'Should companies have a 4-day workweek?',
    keywords: [
      'Work-life balance',
      'Productivity',
      'Burnout',
      'Workload',
      'Industries',
    ],
  },
  {
    question: 'Is working from home better than working in an office?',
    keywords: ['Flexibility', 'Cost', 'Autonomy', 'Talent pool', 'Networking'],
  },
  {
    question: 'Should unpaid internships be banned?',
    keywords: [
      'Exploitation',
      'Inequality',
      'Network',
      'Career exploration',
      'Prestigious',
    ],
  },
  {
    question: 'Is job stability more important than job satisfaction?',
    keywords: [
      'Uncertainty',
      'Motivation',
      'Long-term',
      'Quality of life',
      'Predictability',
    ],
  },
  {
    question: 'Are emotions or logic more important in decision-making?',
    keywords: [
      'Rational',
      'Impulsiveness',
      'Intuition',
      'Values',
      'Consistency',
    ],
  },
  {
    question: 'Is it better to travel alone or with others?',
    keywords: [
      'Personal growth',
      'Spontaneity',
      'Memories',
      'Photos',
      'Independence',
    ],
  },
  {
    question: 'Should businesses be required to have a gender-equal workforce?',
    keywords: [
      'Reverse discrimination',
      'Implementation',
      'Reputation',
      'Diversity',
      'Fairness',
    ],
  },
  {
    question: 'Is it important to learn about history in school?',
    keywords: [
      'Critical thinking',
      'Awareness',
      'Bias',
      'Identity',
      'Irrelevant',
    ],
  },
  {
    question: 'Should tourists learn basic phrases of the local language?',
    keywords: [
      'Technology',
      'Pronunciation',
      'Respect',
      'Misunderstanding',
      'Safety',
    ],
  },
  {
    question: 'Is it better to work for a company or be self-employed?',
    keywords: [
      'Job security',
      'Career path',
      'Paid leave',
      'Autonomy',
      'Fulfillment',
    ],
  },
  {
    question: 'Should junk food be heavily taxed?',
    keywords: [
      'Personal choice',
      'Education',
      'Small businesses',
      'Habits',
      'Environmental impact',
    ],
  },
  {
    question: 'Is veganism the future of food?',
    keywords: [
      'Plant-based',
      'Preferences',
      'Animal rights',
      'Sustainability',
      'Nutritional concerns',
    ],
  },
  {
    question: 'Should smoking be completely banned?',
    keywords: [
      'Second-hand smoke',
      'Generations',
      'Freedom',
      'Addiction',
      'Black market',
    ],
  },
  {
    question: 'Is mental health more important than physical health?',
    keywords: [
      'Interconnection',
      'Quality of life',
      'Survival',
      'Independence',
      'Well-being',
    ],
  },
  {
    question:
      'Is it better to work in a job you love, or a job that pays well?',
    keywords: [
      'Fulfillment',
      'Productivity',
      'Financial security',
      'Regret',
      'Job security',
    ],
  },
  {
    question: 'Is exercise more important than diet for a healthy life?',
    keywords: [
      'Metabolism',
      'Mental health',
      'Nutrients',
      'Immune system',
      'Long-term',
    ],
  },
  {
    question: 'Should euthanasia be legal?',
    keywords: [
      'Autonomy',
      'Suffering',
      'Dignity',
      'Misdiagnosis',
      'Slippery slope',
    ],
  },
  {
    question: 'Are beauty standards harmful to society?',
    keywords: [
      'Mental health',
      'Stereotypes',
      'Superficial',
      'Self-improvement',
      'Body image',
    ],
  },
  {
    question: 'Is it better to live in a small town or a big city?',
    keywords: [
      'Community',
      'Job opportunities',
      'Diversity',
      'Transportation',
      'Cost of living',
    ],
  },
  {
    question: 'Is social media addiction a real problem?',
    keywords: [
      'FOMO',
      'Social isolation',
      'Body image',
      'Escapism',
      'Connectivity',
    ],
  },
]

function getRandomIndex(exclude: number[], max: number) {
  let idx
  do {
    idx = Math.floor(Math.random() * max)
  } while (exclude.includes(idx))
  return idx
}

export default function DebateGenerator() {
  const [shown, setShown] = useState<number[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const questionRef = useRef<HTMLDivElement>(null)
  const keywordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentIdx(getRandomIndex([], debates.length))
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNextDebate = () => {
    const isMobile = window.innerWidth < 768

    // On mobile, skip animations and update immediately
    if (isMobile) {
      let newShown = [...shown, currentIdx]
      if (newShown.length === debates.length) newShown = []
      const nextIdx = getRandomIndex(newShown, debates.length)
      setCurrentIdx(nextIdx)
      setShown(newShown)
      return
    }

    // Animate out
    if (questionRef.current && keywordsRef.current) {
      gsap.to([questionRef.current, keywordsRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.3,
        onComplete: () => {
          let newShown = [...shown, currentIdx]
          if (newShown.length === debates.length) newShown = []
          const nextIdx = getRandomIndex(newShown, debates.length)
          setCurrentIdx(nextIdx)
          setShown(newShown)
          // Animate in
          gsap.fromTo(
            [questionRef.current, keywordsRef.current],
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
          )
        },
      })
    }
  }

  const { question, keywords } = debates[currentIdx]

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 py-20'>
      <div className='container'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <span className='inline-block px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-bold rounded-full text-sm mb-6'>
            💬 ESL Tool
          </span>
          <h1 className='heading-lg text-gray-900 mb-6'>
            Random Debate{' '}
            <span className='text-gradient-primary'>Generator</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Get inspired with thought-provoking ESL debate topics and key
            vocabulary. Perfect for classroom discussions, speaking practice, or
            just sparking great conversations!
          </p>
        </div>

        {/* Main Generator Card */}
        <div className='max-w-5xl mx-auto'>
          <div className='relative bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-8 md:p-12 min-h-[500px]'>
            {/* Status Indicator */}
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-sm text-gray-600 font-medium'>
                  Ready to generate debate topics
                </span>
              </div>
              <div className='text-sm text-gray-500'>
                {shown.length} / {debates.length} topics used
              </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-12'>
              {/* Question Section */}
              <div className='flex-1'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Your Debate Topic
                    </span>
                  </div>

                  <div ref={questionRef} className='space-y-4'>
                    <div className='bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10'>
                      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4'>
                        {question}
                      </h2>
                      <div className='h-1 bg-gradient-to-r from-primary to-accent rounded-full'></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className='flex-1 lg:border-l border-gray-200 lg:pl-12'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Vocabulary Boost
                    </span>
                  </div>

                  <div className='space-y-4'>
                    <h3 className='text-xl font-bold text-gray-900'>
                      💡 Make It Interesting
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Try to incorporate these vocabulary words when developing
                      your arguments and responses.
                    </p>
                  </div>

                  <div ref={keywordsRef} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      {keywords.map((keyword, index) => (
                        <motion.div
                          key={keyword}
                          {...(isMobile
                            ? {
                                initial: { opacity: 1, scale: 1 },
                                animate: { opacity: 1, scale: 1 },
                              }
                            : {
                                initial: { opacity: 0, scale: 0.9 },
                                animate: { opacity: 1, scale: 1 },
                                transition: { delay: index * 0.1 },
                              })}
                          className='group'
                        >
                          <div className='bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary/10 hover:to-accent/10 rounded-xl p-3 border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-105'>
                            <span className='text-gray-700 font-medium text-sm group-hover:text-primary transition-colors'>
                              {keyword}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='mt-12 flex justify-center'>
              <button
                onClick={handleNextDebate}
                className='btn-primary shadow-glow-lg hover:shadow-glow-lg group'
              >
                <ArrowPathIcon className='w-5 h-5 group-hover:rotate-180 transition-transform duration-500' />
                Generate New Debate
              </button>
            </div>

            {/* Usage Tips */}
            <div className='mt-12 pt-8 border-t border-gray-200'>
              <div className='grid md:grid-cols-3 gap-6 text-center'>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    🎯
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Classroom Ready
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Perfect for ESL lessons and group discussions
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    💬
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Speaking Practice
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Enhance fluency and persuasive speaking skills
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-gradient-to-br from-custom-pink to-rose-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    🧠
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Critical Thinking
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Develop analytical and reasoning abilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// NOTE: Fill in the rest of the debates array with the provided JSON for full functionality.
