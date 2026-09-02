import type { Metadata } from 'next'
import JourneyHero from './JourneyHero'
import StageFinder from './StageFinder'
import JourneyBundle from './JourneyBundle'

export const metadata: Metadata = {
  title: 'The Roadmap for Online English Teachers',
  description:
    'The five stages of an online English teaching career, in the order they actually happen — choosing a platform, setting up, getting booked, teaching well, and building a career that lasts.',
  keywords: [
    'teach English online',
    'online English teacher roadmap',
    'how to become an online English tutor',
    'online tutoring business',
    'ESL teacher career',
    'get students teaching English online',
    'online teaching platforms',
  ],
  openGraph: {
    title: 'The Roadmap for Online Teachers | LearnWithMillie',
    description:
      'Five stages from “I think I want to teach online” to a calendar that fills itself — with the exact course or tool for each one.',
    url: '/teachers/journey',
  },
  alternates: {
    canonical: '/teachers/journey',
  },
}

export default function TeacherJourneyPage() {
  return (
    <>
      <JourneyHero />
      <StageFinder />
      <JourneyBundle />
    </>
  )
}
