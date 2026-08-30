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
      <MentorshipHero
        id='teachers-hero'
        eyebrow='For Teachers'
        headline={<>Teach with confidence.<br />Grow with purpose.</>}
        subheading={
          <>
            One-on-one mentorship, self-paced courses, and free classroom tools for
            English teachers at every stage. Whether you&apos;re just starting out or
            refining your craft, Millie helps you build confidence, structure, and
            real results — in and out of the classroom.
          </>
        }
      />
      <MentorshipTestimonials
        id='teachers-testimonials'
        intro={
          <>
            Hear from teachers who have grown their craft and confidence through
            Millie&apos;s mentorship and courses.
          </>
        }
      />
      <TeacherProducts />
    </>
  )
}
