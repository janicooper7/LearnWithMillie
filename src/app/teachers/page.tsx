import type { Metadata } from 'next'
import MentorshipHero from '../sections/MentorshipHero'
import MentorshipTestimonials from '../sections/MentorshipTestimonials'
import TeacherProducts from '../sections/TeacherProducts'

export const metadata: Metadata = {
  title: 'Teacher Mentorship, Courses & Free Tools',
  description:
    'Everything English teachers need to grow — personalised one-on-one mentorship with Millie Cooper, self-paced teacher courses, the Platform Finder, and the Debate Generator.',
  openGraph: {
    title: 'For Teachers | LearnWithMillie',
    description:
      'Mentorship, courses, and free classroom tools to help English teachers build confidence, structure, and a thriving online presence.',
    url: '/teachers',
  },
  alternates: {
    canonical: '/teachers',
  },
}

export default function TeachersPage() {
  return (
    <>
      <MentorshipHero programHref='#teacher-products' />
      <MentorshipTestimonials />
      <TeacherProducts />
    </>
  )
}
