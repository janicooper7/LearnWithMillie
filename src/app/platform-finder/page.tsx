import type { Metadata } from 'next'
import PlatformFinder from './PlatformFinder'

export const metadata: Metadata = {
  title: 'Platform Finder — Which Online English Teaching Platform Is Right for You?',
  description:
    'Answer 7 quick questions and discover which of 33 online English teaching platforms — VIPKid, Cambly, Preply, iTalki, Lingoda and more — actually hire teachers like you. Ranked by pay and fit.',
  keywords: [
    'online English teaching platforms',
    'best ESL teaching platform',
    'teach English online',
    'VIPKid alternatives',
    'Cambly alternatives',
    'Preply teacher',
    'iTalki teacher',
    'Lingoda teacher',
    'TEFL jobs online',
    'non-native English teacher platforms',
  ],
  openGraph: {
    title: 'Platform Finder — Find the right online English teaching platform | LearnWithMillie',
    description:
      'Match your profile to 33 online English teaching platforms in under 2 minutes. Ranked by pay and fit.',
    url: '/platform-finder',
  },
  alternates: {
    canonical: '/platform-finder',
  },
}

export default function PlatformFinderPage() {
  return <PlatformFinder />
}
