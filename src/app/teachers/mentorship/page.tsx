import type { Metadata } from 'next'
import MentorshipHero from '../../sections/MentorshipHero'
import MentorshipProgram from '../../sections/MentorshipProgram'
import MentorshipTestimonials from '../../sections/MentorshipTestimonials'
import MentorshipPricing from '../../sections/MentorshipPricing'

export const metadata: Metadata = {
  title: 'Teacher Mentorship',
  description:
    'Personalised one-on-one mentorship for English teachers. Work with Millie Cooper to develop your teaching skills, lesson design, and online presence.',
  openGraph: {
    title: 'Teacher Mentorship | LearnWithMillie',
    description:
      'Personalised mentorship for English teachers at every stage — from lesson design to building your brand.',
    url: '/teachers/mentorship',
  },
}

export default function MentorshipPage() {
  return (
    <>
      <MentorshipHero />
      <MentorshipTestimonials />
      <MentorshipProgram />
      <MentorshipPricing />
    </>
  )
}
