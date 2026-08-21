// Single source of truth for teacher testimonials.
//
// These are messages from teachers who followed Millie's frameworks — the
// mentorship page shows all of them in a carousel, and the course sales page
// shows the `featured` subset. Keeping one array means a new message only ever
// has to be added in one place.
//
// `result` is the specific outcome stated in the message itself, pulled out so
// it can be read at a glance. Never write a `result` that the quote doesn't
// actually say.

export type TeacherTestimonial = {
  name: string
  role: string
  content: string
  rating: number
  /** The concrete outcome the message states, e.g. '5 subscriptions in 36 hours'. */
  result?: string
  /** Headshot path under /public. Falls back to an initial-letter avatar. */
  photo?: string
  /** Shown on the course sales page — the ones with the most specific results. */
  featured?: boolean
}

export const teacherTestimonials: TeacherTestimonial[] = [
  {
    name: 'Tinkerbell_xd',
    role: 'Online English Teacher',
    content:
      'Your videos have helped me so much. My growth has been insane — I got 5 subscriptions in 36 hours! Thanks for all of these videos xx',
    rating: 5,
    result: '5 subscriptions in 36 hours',
    featured: true,
  },
  {
    name: 'Laura',
    role: 'Online English Teacher',
    content:
      'Thank you so much for your response — it was so detailed and helpful. I created my account yesterday, it got approved this morning, and I already have a trial lesson booked!',
    rating: 5,
    result: 'Approved and booked in 24 hours',
    featured: true,
  },
  {
    name: 'Bridgette Nkosi',
    role: 'New Teacher',
    content:
      'Hi Millie, thank you very much for all your lessons. I got accepted on Preply just by using your tips.',
    rating: 5,
    result: 'Accepted onto Preply',
    featured: true,
  },
  {
    name: 'Carminaria',
    role: 'Preply Teacher',
    content:
      'Millie!! I updated my Preply profile after binging your content and got loads of new students! Thank you ❤️',
    rating: 5,
    result: 'Profile rewrite → new students',
    featured: true,
  },
  {
    name: 'Sarah',
    role: 'English Teacher',
    content:
      'Hope everything is going well — after your advice my page is now growing. I am having more students and trial lessons, which I was once scared of, are now very fun.',
    rating: 5,
    result: 'From scared of trials to enjoying them',
    featured: true,
  },
  {
    name: 'Jessica',
    role: 'Aspiring Online Teacher',
    content:
      'I just got my first trial on Preply thanks to your videos! You\'re such an inspiration! 🥰',
    rating: 5,
    result: 'First trial lesson booked',
  },
  {
    name: 'Emma',
    role: 'New Preply Teacher',
    content:
      'Thanks to your videos I have my 1st student 😊 I cannot believe how quickly things moved once I followed your advice.',
    rating: 5,
    result: 'First paying student',
  },
]

/** The subset shown on the course sales page, in display order. */
export const featuredTeacherTestimonials = teacherTestimonials.filter(
  (t) => t.featured
)
