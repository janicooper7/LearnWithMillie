import type { Metadata } from 'next'
import CoursesComingSoon from '../sections/CoursesComingSoon'

export const metadata: Metadata = {
  title: 'Teacher Courses',
  description:
    'In-depth courses for English teachers — coming soon. Sign up to be the first to know when Millie\'s teacher courses launch.',
  openGraph: {
    title: 'Teacher Courses — Coming Soon | LearnWithMillie',
    description: 'Courses designed to help English teachers grow their skills and build a thriving teaching practice.',
    url: '/courses',
  },
}

export default function CoursesPage() {
  return <CoursesComingSoon />
}
