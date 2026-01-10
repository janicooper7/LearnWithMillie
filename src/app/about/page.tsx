import type { Metadata } from 'next'
import About from '../sections/About'
import LessonOptions from '../sections/LessonOptions'

export const metadata: Metadata = {
  title: 'About - Meet Your English Tutor',
  description:
    'Meet Millie Cooper, a certified TEFL teacher from London with three years of experience teaching English online. Master\'s degree in Public Policy from UCL, Bachelor\'s in International Politics from King\'s College London. Professional English tutoring tailored to your needs.',
  openGraph: {
    title: 'About Millie Cooper - Certified TEFL Teacher | Fluentify',
    description:
      'Meet Millie Cooper, a certified TEFL teacher from London with three years of experience teaching English online. Professional English tutoring tailored to your needs.',
    url: '/about',
    images: ['/images/aboutme.png'],
  },
}

export default function AboutPage() {
  return (
    <main className='relative pt-16'>
      <About />
      <LessonOptions />
    </main>
  )
}
