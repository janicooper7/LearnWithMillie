import type { Metadata } from 'next'
import About from '../sections/About'
import LessonOptions from '../sections/LessonOptions'

export const metadata: Metadata = {
  title: 'About Millie Cooper',
  description:
    'Meet Millie, a certified TEFL teacher from London with four years of experience teaching English online. Specialising in Business English, interview preparation, and helping learners improve fluency, pronunciation, and confidence. Master\'s in Public Policy from UCL, Bachelor\'s in International Politics from King\'s College London.',
  openGraph: {
    title: 'About Millie - Certified TEFL Teacher | Professional English Tutoring',
    description:
      'Meet Millie, a certified TEFL teacher from London with four years of experience. Specialising in Business English, interview preparation, and personalised lessons tailored to your goals.',
    url: '/about',
    images: ['/images/aboutme.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <About />
      <LessonOptions />
    </>
  )
}
