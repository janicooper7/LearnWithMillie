import type { Metadata } from 'next'
import Testimonials from './sections/Testimonials'
import Pricing from './sections/Pricing'
import FAQ from './sections/FAQ'
import LessonOptions from './sections/LessonOptions'
import MeetTutor from './sections/MeetTutor'

export const metadata: Metadata = {
  title: 'Professional English Tutoring | Business English & Interview Prep',
  description:
    'Transform your English skills with personalized tutoring. Learn Business English, improve conversational fluency, and prepare for job interviews with a certified TEFL teacher from London. Flexible scheduling and tailored lessons.',
  openGraph: {
    title: 'Professional English Tutoring | Business English & Interview Prep',
    description:
      'Transform your English skills with personalized tutoring. Learn Business English, improve conversational fluency, and prepare for job interviews.',
    url: '/',
  },
}

export default function Home() {
  return (
    <>
      <MeetTutor />
      <Testimonials />
      <LessonOptions />
      <Pricing />
      <FAQ />
    </>
  )
}
