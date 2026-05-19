import type { Metadata } from 'next'
import DebateGenerator from '../sections/DebateGenerator'
import FreeLessonPlans from '../sections/FreeLessonPlans'

export const metadata: Metadata = {
  title: 'Teacher Materials - Free Debate Topics & Vocabulary',
  description:
    'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions, speaking practice, and sparking great conversations! Free tool for English teachers and students.',
  keywords: [
    'ESL debate topics',
    'English debate generator',
    'debate topics for ESL',
    'speaking practice',
    'conversation topics',
    'English discussion topics',
    'teacher resources',
    'ESL activities',
  ],
  openGraph: {
    title: 'Teacher Materials - Free Debate Topics & Vocabulary | LearnWithMillie',
    description:
      'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions and speaking practice.',
    url: '/teacher-materials',
  },
}

export default function TeacherMaterialsPage() {
  return (
    <>
      <div id="random-questions">
        <DebateGenerator />
      </div>
      <FreeLessonPlans />
    </>
  )
}
