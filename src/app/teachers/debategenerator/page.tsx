import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import DebateGenerator from '../../sections/DebateGenerator'
import DebateGeneratorPaywall from './DebateGeneratorPaywall'

export const metadata: Metadata = {
  title: 'Debate Generator - ESL Debate Topics & Vocabulary',
  description:
    'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions, speaking practice, and sparking great conversations! Lifetime access for English teachers and students.',
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
    title: 'Debate Generator - ESL Debate Topics & Vocabulary | LearnWithMillie',
    description:
      'Get inspired with thought-provoking ESL debate topics and key vocabulary. Perfect for classroom discussions and speaking practice.',
    url: '/teachers/debategenerator',
  },
}

export const dynamic = 'force-dynamic'

export default async function DebateGeneratorPage() {
  const session = await auth()

  let hasAccess = false
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { debateAccess: true },
    })
    hasAccess = !!user?.debateAccess
  }

  if (hasAccess) {
    return <DebateGenerator />
  }

  return <DebateGeneratorPaywall loggedIn={!!session?.user?.id} />
}
