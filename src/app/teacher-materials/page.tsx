import type { Metadata } from 'next'
import DebateGenerator from '../sections/DebateGenerator'

export const metadata: Metadata = {
  title: 'ESL Debate Generator - Free Debate Topics & Vocabulary',
  description:
    'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions, speaking practice, and sparking great conversations! Free tool for English teachers and students.',
  keywords: [
    'ESL debate topics',
    'English debate generator',
    'debate topics for ESL',
    'speaking practice',
    'conversation topics',
    'English discussion topics',
  ],
  openGraph: {
    title: 'ESL Debate Generator - Free Debate Topics & Vocabulary',
    description:
      'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions and speaking practice.',
    url: '/teacher-materials',
  },
}

export default function DebateGeneratorPage() {
  return (
    <main className='relative pt-16'>
      <DebateGenerator />
    </main>
  )
}
