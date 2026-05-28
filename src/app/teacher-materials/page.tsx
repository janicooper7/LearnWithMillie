import type { Metadata } from 'next'
import FreeLessonPlans from '../sections/FreeLessonPlans'

export const metadata: Metadata = {
  title: 'Teacher Materials - Free ESL Lesson Plans',
  description:
    'Download free ESL lesson plans for English teachers. Ready-to-use classroom materials to save you prep time and engage your students.',
  keywords: [
    'free ESL lesson plans',
    'ESL teaching resources',
    'English lesson plans',
    'teacher resources',
    'ESL activities',
    'classroom materials',
  ],
  openGraph: {
    title: 'Teacher Materials - Free ESL Lesson Plans | LearnWithMillie',
    description:
      'Download free ESL lesson plans for English teachers. Ready-to-use classroom materials to save you prep time.',
    url: '/teacher-materials',
  },
}

export default function TeacherMaterialsPage() {
  return <FreeLessonPlans />
}
