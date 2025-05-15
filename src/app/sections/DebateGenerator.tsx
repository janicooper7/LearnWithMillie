'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
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
  const questionRef = useRef<HTMLDivElement>(null)
  const keywordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentIdx(getRandomIndex([], debates.length))
  }, [])

  const handleNextDebate = () => {
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
    <div className='flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-white via-rose-50 to-pink-100 py-12 px-2'>
      <div className='mb-10 text-center max-w-2xl mx-auto'>
        <h1 className='heading-lg text-gray-900 mb-2'>
          Random Debate Generator
        </h1>
        <p className='text-gray-500 text-md md:text-lg'>
          Get inspired with thought-provoking debate topics and key vocabulary.
          Perfect for classroom discussions, speaking practice, or just sparking
          great conversations!
        </p>
      </div>
      <div className='relative bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-8 md:p-12 max-w-4xl w-full mx-auto min-h-[440px] flex flex-col justify-between'>
        <div className='flex-1 flex flex-col md:flex-row gap-10'>
          <div className='flex-1 flex flex-col justify-center'>
            <p className='text-gray-400 text-sm mb-2'>
              Here is your debate to discuss:
            </p>
            <div ref={questionRef} className='heading-lg text-gray-900 mb-6'>
              {question}
            </div>
          </div>
          <div className='flex-1 md:border-l border-gray-200 md:pl-8 flex flex-col justify-center'>
            <h3 className='font-semibold text-md text-gray-900 mb-2'>
              Make It Interesting
            </h3>
            <p className='text-gray-400 text-xs mb-3'>
              Try and use the following vocabulary when answering the questions.
            </p>
            <div ref={keywordsRef} className='flex flex-wrap gap-2'>
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className='px-3 py-1 rounded-full bg-primary/10 text-gray-900 text-sm font-medium shadow-sm'
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleNextDebate}
          className='mt-8 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-custom-pink to-rose-300 text-white font-semibold text-base shadow hover:scale-105 hover:from-rose-300 hover:to-custom-pink transition-all w-1/2 mx-auto'
        >
          <ArrowPathIcon className='w-5 h-5' />
          New Debate
        </button>
      </div>
    </div>
  )
}
// NOTE: Fill in the rest of the debates array with the provided JSON for full functionality.
