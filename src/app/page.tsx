import type { Metadata } from 'next'
import HomeHybrid from './sections/HomeHybrid'

export const metadata: Metadata = {
  title: 'English Tutoring & Teacher Mentorship with Millie Cooper',
  description:
    'Learn English with confidence or grow as a teacher. Personalized one-on-one English lessons for students and one-on-one mentorship, courses, and free tools for teachers — all with certified TEFL teacher Millie Cooper from London.',
  openGraph: {
    title: 'English Tutoring & Teacher Mentorship with Millie Cooper',
    description:
      'Learn English with confidence or grow as a teacher — lessons for students and mentorship for teachers, with certified TEFL teacher Millie Cooper.',
    url: '/',
  },
}

export default function Home() {
  return (
    <>
      <HomeHybrid />
    </>
  )
}
