import DebateGenerator from '../sections/DebateGenerator'

export const metadata = {
  title: 'Debate Generator - Fluentify',
  description:
    'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions, speaking practice, and sparking great conversations!',
}

export default function DebateGeneratorPage() {
  return (
    <main className='relative pt-16'>
      <DebateGenerator />
    </main>
  )
}
