'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const teachingApproach = [
  {
    title: 'Personalised Lessons',
    content: (
      <div className='space-y-3'>
        <p>
          Every student is unique, and so should be their learning journey. I
          design lessons specifically tailored to your individual goals, whether
          you're focusing on Business English for professional advancement,
          preparing for important interviews, or simply wanting to improve your
          everyday conversational skills.
        </p>
        <p>
          Before we begin, I take time to understand your current level, your
          objectives, and your preferred learning style. This allows me to
          create a customized curriculum that addresses your specific needs and
          helps you progress at the right pace.
        </p>
        <p>
          From structured Business English sessions to casual small talk
          practice, each lesson is crafted to match what you want to achieve.
        </p>
      </div>
    ),
  },
  {
    title: 'Supportive & Friendly Approach',
    content: (
      <div className='space-y-3'>
        <p>
          Learning a new language can feel intimidating, but it doesn't have to
          be. I create a relaxed, welcoming learning environment where you feel
          comfortable making mistakes, asking questions, and expressing yourself
          freely.
        </p>
        <p>
          My teaching style is built on kindness and encouragement. I believe
          that confidence grows when you feel supported, not judged. Whether
          you're struggling with pronunciation, grammar, or finding the right
          words, I'm here to help you overcome challenges with patience and
          understanding.
        </p>
        <p>
          Together, we'll build your confidence step by step, celebrating your
          progress along the way. Remember, every mistake is a learning
          opportunity, and every lesson brings you closer to your goals.
        </p>
      </div>
    ),
  },
  {
    title: 'Practical & Engaging Topics',
    content: (
      <div className='space-y-3'>
        <p>
          I believe the best way to learn English is through real-world
          application. That's why my lessons focus on practical, engaging topics
          that you'll actually use in your daily life and professional
          environment.
        </p>
        <p>
          We'll explore relevant scenarios through role-playing exercises,
          meaningful discussions, and interactive activities. Whether we're
          practicing a job interview, discussing current events, or working
          through a business presentation, every activity is designed to build
          your confidence and help you speak naturally.
        </p>
        <p>
          You'll learn not just the language, but how to use it effectively in
          real situations. This practical approach ensures that what you learn
          in our lessons translates directly to your everyday conversations and
          professional interactions.
        </p>
      </div>
    ),
  },
  {
    title: 'Comprehensive Support',
    content: (
      <div className='space-y-3'>
        <p>
          Your learning doesn't stop when the lesson ends. After each session, I
          provide detailed lesson notes that include all the new vocabulary we
          covered, key grammar points, and practical examples you can review at
          your own pace.
        </p>
        <p>
          These notes serve as a valuable reference tool, helping you reinforce
          what you've learned and continue practicing between lessons. You'll
          also receive personalized feedback on your progress, highlighting your
          strengths and areas for improvement.
        </p>
        <p>
          I'm committed to supporting your learning journey beyond our scheduled
          lessons. If you have questions or need clarification on anything we've
          covered, I'm here to help. Your success is my priority, and I want to
          make sure you have all the resources you need to achieve your English
          learning goals.
        </p>
      </div>
    ),
  },
]

const aboutSections = [
  {
    title: 'My Qualifications & Background',
    content: (
      <div className='space-y-4'>
        <p className='text-gray-700 leading-relaxed'>
          I hold a Master's in Public Policy from UCL (University College
          London) and a Bachelor's in International Politics from King's College
          London. These academic foundations, combined with my professional
          experience in local government, management, and accounting, give me a
          unique perspective on business communication and professional
          development.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          My diverse background allows me to offer valuable insights for
          business communication, professional writing, and interview success. I
          understand the challenges professionals face when communicating in
          English, whether it's writing emails, giving presentations, or
          participating in meetings.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          I am a TEFL certified teacher with four years of experience teaching
          English online. I specialise in Business English, interview
          preparation, and helping learners improve fluency, pronunciation, and
          confidence in both professional and everyday conversations.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          My real-world experience in various professional settings means I can
          help you navigate the specific language challenges you face in your
          career, from understanding business terminology to mastering the art
          of professional small talk.
        </p>
      </div>
    ),
  },
  {
    title: 'My Teaching Philosophy',
    content: (
      <div className='space-y-4'>
        <p className='text-gray-700 leading-relaxed'>
          Learning English should be enjoyable, engaging, and easygoing! I
          believe that when you're having fun and feeling comfortable, you learn
          more effectively. That's why I create a positive and supportive space
          where you can build confidence and improve your skills without fear of
          judgment.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          My teaching style is warm, encouraging, and tailored to your needs.
          Whether you're working on fluency, confidence, or business
          communication, I adapt my approach to match your learning style and
          goals. I understand that everyone learns differently, and I'm
          committed to finding the methods that work best for you.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          I provide all materials for fun and engaging lessons, so you don't
          need to worry about purchasing textbooks or resources. Everything you
          need is included, and I'm always happy to incorporate topics that
          interest you personally or relate to your professional field.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          Outside of teaching, I enjoy reading, traveling, and writing books.
          These passions keep me curious and help me bring fresh perspectives
          and interesting topics into our lessons. I believe that learning a
          language is about more than just grammar and vocabulary—it's about
          connecting with people, cultures, and ideas.
        </p>
        <p className='text-gray-700 leading-relaxed font-medium'>
          Book your first lesson today—I look forward to helping you achieve
          your goals and making your English learning journey both successful
          and enjoyable!
        </p>
      </div>
    ),
  },
]

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [openApproachIndex, setOpenApproachIndex] = useState<number | null>(
    null
  )
  const answerRefs = useRef<Array<HTMLElement | null>>([])
  const approachRefs = useRef<Array<HTMLElement | null>>([])
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    // Initialize refs
    answerRefs.current = answerRefs.current.slice(0, aboutSections.length)
    approachRefs.current = approachRefs.current.slice(
      0,
      teachingApproach.length
    )

    // Initialize all answers to be closed
    answerRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { height: 0, opacity: 0, display: 'none' })
      }
    })
    approachRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { height: 0, opacity: 0, display: 'none' })
      }
    })

    // Disable animations on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      if (textRef.current) {
        gsap.set(textRef.current, { x: 0, opacity: 1 })
      }
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
      },
    })

    tl.fromTo(
      textRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleToggle = (indexToToggle: number, type: 'about' | 'approach') => {
    const isMobile = window.innerWidth < 768
    const refs = type === 'about' ? answerRefs : approachRefs
    const setOpen = type === 'about' ? setOpenIndex : setOpenApproachIndex
    const currentOpen = type === 'about' ? openIndex : openApproachIndex

    // If clicking the currently open item to close it
    if (currentOpen === indexToToggle) {
      const elToClose = refs.current[indexToToggle]
      if (elToClose) {
        if (isMobile) {
          gsap.set(elToClose, { display: 'none', height: 0, opacity: 0 })
          setOpen(null)
        } else {
          gsap.to(elToClose, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.set(elToClose, { display: 'none' })
              setOpen(null)
            },
          })
        }
      }
    } else {
      // Close the currently open item first (if any)
      if (currentOpen !== null) {
        const currentOpenEl = refs.current[currentOpen]
        if (currentOpenEl) {
          if (isMobile) {
            gsap.set(currentOpenEl, { display: 'none', height: 0, opacity: 0 })
          } else {
            gsap.to(currentOpenEl, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.set(currentOpenEl, { display: 'none' })
              },
            })
          }
        }
      }

      // Open the new item
      const elToOpen = refs.current[indexToToggle]
      if (elToOpen) {
        setOpen(indexToToggle)
        gsap.set(elToOpen, { display: 'block', height: 'auto' })
        const autoHeight = elToOpen.scrollHeight

        if (isMobile) {
          gsap.set(elToOpen, { height: autoHeight, opacity: 1 })
        } else {
          gsap.fromTo(
            elToOpen,
            { height: 0, opacity: 0 },
            {
              height: autoHeight,
              opacity: 1,
              duration: 0.3,
              ease: 'power1.inOut',
            }
          )
        }
      }
    }
  }

  return (
    <section ref={sectionRef} className='section-padding bg-white' id='about'>
      <div className='container'>
        {/* Hero Section */}
        <div className='mb-16'>
          <div ref={textRef} className='space-y-6'>
            <div className='space-y-4'>
              <h1 className='heading-lg text-gray-900'>
                Hi! I'm Millie, a certified TEFL teacher from London
              </h1>
            </div>

            <div className='space-y-4'>
              <p className='text-xl text-gray-700 leading-relaxed'>
                Passionate about helping students gain confidence in English.
              </p>
              <p className='text-lg text-gray-600 leading-relaxed'>
                With four years of experience teaching online, I tailor lessons
                to individual needs in a calm, supportive, and engaging way. My
                background in management, local government and accounting also
                makes me a great fit for those looking to improve their Business
                English.
              </p>
              <p className='text-lg text-gray-600 leading-relaxed'>
                I hold a Master's in Public Policy from UCL and a Bachelor's in
                International Politics from King's College London. Outside
                teaching, I enjoy reading, traveling, and writing books.
              </p>
              <p className='text-lg text-gray-700 font-medium leading-relaxed'>
                Learning a language can be challenging, but you don't have to do
                it alone. Let's learn together!
              </p>
            </div>
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className='mb-16'>
          <div>
            <div
              className='relative w-full'
              style={{ paddingBottom: '56.25%' }}
            >
              <iframe
                className='absolute top-0 left-0 w-full h-full rounded-2xl shadow-xl'
                src='https://www.youtube.com/embed/GevjT36pwJI?si=CasLXflYe670jtEJ'
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* My Teaching Approach - Dropdown Section */}
        <div className='mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
            My Teaching Approach
          </h2>
          <div className='space-y-4'>
            {teachingApproach.map((item, index) => (
              <div
                key={index}
                className='bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden'
              >
                <button
                  onClick={() => handleToggle(index, 'approach')}
                  className='flex w-full items-center justify-between text-left p-6 hover:bg-gray-100 transition-colors duration-200'
                >
                  <span className='text-lg font-semibold text-gray-900'>
                    {item.title}
                  </span>
                  <span className='ml-6 flex h-7 items-center flex-shrink-0'>
                    {openApproachIndex === index ? (
                      <MinusIcon className='h-6 w-6 text-primary' />
                    ) : (
                      <PlusIcon className='h-6 w-6 text-primary' />
                    )}
                  </span>
                </button>
                <div
                  ref={(el) => {
                    approachRefs.current[index] = el
                  }}
                  className='overflow-hidden'
                >
                  <div className='px-8 py-6 text-gray-700 leading-relaxed'>
                    {typeof item.content === 'string' ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional About Sections - Dropdown */}
        <div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
            Learn More About Me
          </h2>
          <div className='space-y-4'>
            {aboutSections.map((section, index) => (
              <div
                key={index}
                className='bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden'
              >
                <button
                  onClick={() => handleToggle(index, 'about')}
                  className='flex w-full items-center justify-between text-left p-6 hover:bg-gray-100 transition-colors duration-200'
                >
                  <span className='text-lg font-semibold text-gray-900'>
                    {section.title}
                  </span>
                  <span className='ml-6 flex h-7 items-center flex-shrink-0'>
                    {openIndex === index ? (
                      <MinusIcon className='h-6 w-6 text-primary' />
                    ) : (
                      <PlusIcon className='h-6 w-6 text-primary' />
                    )}
                  </span>
                </button>
                <div
                  ref={(el) => {
                    answerRefs.current[index] = el
                  }}
                  className='overflow-hidden'
                >
                  <div className='px-8 py-6'>{section.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-16 text-center'>
          <div className='bg-gradient-primary rounded-3xl p-8 md:p-12 text-white'>
            <h3 className='text-2xl md:text-3xl font-bold mb-4'>
              Ready to Start Your English Learning Journey?
            </h3>
            <p className='text-lg md:text-xl mb-6 opacity-90'>
              If you're looking to improve business communication, preparing for
              an interview, or refining your English skills, I'd love to help
              you achieve your goals!
            </p>
            <a
              href='#contact'
              className='bg-white text-black shadow-glow-lg hover:shadow-glow-lg hover:scale-105 transform inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300'
            >
              Book Your First Lesson
              <ArrowRight className='w-5 h-5' />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
