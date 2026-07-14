'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import type { DebateQuestion } from './debates'

function getRandomIndex(exclude: number[], max: number) {
  let idx
  do {
    idx = Math.floor(Math.random() * max)
  } while (exclude.includes(idx))
  return idx
}

export default function DebateGenerator() {
  const [debateQuestions, setDebateQuestions] = useState<DebateQuestion[]>([])
  const [shown, setShown] = useState<number[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [exampleSentence, setExampleSentence] = useState<string | null>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const keywordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the ~460KB dataset as a separate async chunk after mount, so it
    // isn't part of the initial page JS bundle.
    let active = true
    import('./debates').then((mod) => {
      if (!active) return
      setDebateQuestions(mod.debateQuestions)
      setCurrentIdx(getRandomIndex([], mod.debateQuestions.length))
    })

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      active = false
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleNextDebate = () => {
    const isMobile = window.innerWidth < 768

    // On mobile, skip animations and update immediately
    if (isMobile) {
      let newShown = [...shown, currentIdx]
      if (newShown.length === debateQuestions.length) newShown = []
      const nextIdx = getRandomIndex(newShown, debateQuestions.length)
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
          if (newShown.length === debateQuestions.length) newShown = []
          const nextIdx = getRandomIndex(newShown, debateQuestions.length)
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

  const current = debateQuestions[currentIdx]
  const question = current?.question ?? ''
  const keywords = current?.keywords ?? []

  // Handle both old format (string array) and new format (object array with examples)
  const getKeywordData = (
    keywordItem: string | { keyword: string; example: string }
  ) => {
    // If it's a string (old format), return with no example
    if (typeof keywordItem === 'string') {
      return { keyword: keywordItem, example: null }
    }

    // It's an object - extract keyword and example
    const keyword = keywordItem.keyword || ''

    // Check if example exists and is a valid non-empty string
    let example: string | null = null
    if (
      keywordItem.example !== undefined &&
      keywordItem.example !== null &&
      typeof keywordItem.example === 'string' &&
      keywordItem.example.trim().length > 0
    ) {
      example = keywordItem.example.trim()
    }

    return { keyword, example }
  }

  const handleKeywordClick = (keyword: string, example: string | null) => {
    if (selectedKeyword === keyword) {
      // Toggle off if clicking the same keyword
      setSelectedKeyword(null)
      setExampleSentence(null)
    } else {
      // Show example sentence for the clicked keyword - only if example exists in database
      if (example && example.trim().length > 0) {
        setSelectedKeyword(keyword)
        setExampleSentence(example)
      }
      // If no example, do nothing - don't show anything
    }
  }

  // Reset selected keyword when debate changes
  useEffect(() => {
    setSelectedKeyword(null)
    setExampleSentence(null)
  }, [currentIdx])

  // Dataset still loading (async chunk) — show the hero with a placeholder card.
  if (!current) {
    return (
      <div className='min-h-screen py-20' style={{ backgroundColor: '#F4EDE4' }}>
        <div className='container'>
          <div className='text-center mb-16'>
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
          <div className='max-w-5xl mx-auto'>
            <div className='relative bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-8 md:p-12 min-h-[500px] flex items-center justify-center'>
              <div className='flex flex-col items-center gap-4 text-gray-500'>
                <ArrowPathIcon className='w-8 h-8 animate-spin' />
                <p className='text-sm font-medium'>Loading debate topics…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen py-20' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='container'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
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
            <div className='flex flex-col lg:flex-row gap-12'>
              {/* Question Section */}
              <div className='flex-1'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Your Debate Topic
                    </span>
                  </div>

                  <div ref={questionRef} className='space-y-4'>
                    <div className='bg-primary/5 rounded-2xl p-6 border border-primary/10'>
                      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4'>
                        {question}
                      </h2>
                      <div className='h-1 bg-primary rounded-full'></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className='flex-1 lg:border-l border-gray-200 lg:pl-12'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
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
                      {keywords.map((keywordItem, index) => {
                        const { keyword, example } = getKeywordData(keywordItem)
                        return (
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
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleKeywordClick(keyword, example)
                              }}
                              className={`bg-gray-50 hover:bg-primary/10 rounded-xl p-3 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                                selectedKeyword === keyword
                                  ? 'bg-primary/15 border-primary/40 shadow-md scale-105'
                                  : 'border-gray-200 hover:border-primary/20'
                              }`}
                            >
                              <span
                                className={`font-medium text-sm transition-colors ${
                                  selectedKeyword === keyword
                                    ? 'text-primary font-semibold'
                                    : 'text-gray-700 group-hover:text-primary'
                                }`}
                              >
                                {keyword}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Example Sentence Display */}
                    {selectedKeyword && exampleSentence && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5'>
                            <span className='text-primary text-xs'>💡</span>
                          </div>
                          <div className='flex-1'>
                            <p className='text-xs font-semibold text-primary mb-1 uppercase tracking-wide'>
                              Example for "{selectedKeyword}"
                            </p>
                            <p className='text-sm text-gray-700 leading-relaxed'>
                              {exampleSentence}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='mt-12 flex justify-center'>
              <button
                onClick={handleNextDebate}
                className='btn-primary gap-2 group'
              >
                <ArrowPathIcon className='w-5 h-5 group-hover:rotate-180 transition-transform duration-500' />
                Generate New Debate
              </button>
            </div>

            {/* Usage Tips */}
            <div className='mt-12 pt-8 border-t border-gray-200'>
              <div className='grid md:grid-cols-3 gap-6 text-center'>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
                  <div className='w-12 h-12 bg-accent rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
                  <div className='w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
