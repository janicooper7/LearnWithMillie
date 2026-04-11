import type { Metadata } from 'next'
import Contact from '../sections/Contact'

export const metadata: Metadata = {
  title: 'Contact — Book a Lesson',
  description: 'Get in touch with Millie to book your first English lesson or free 15-minute trial. Flexible scheduling, personalised lessons.',
}

export default function ContactPage() {
  return <Contact />
}
