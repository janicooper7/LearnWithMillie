// Single source of truth for teacher testimonials.
//
// These are messages from teachers who followed Millie's frameworks — some as
// paying course students, the rest through the free content and mentorship. The
// mentorship page shows all of them in a carousel, and the course sales page
// shows the `featured` subset. Keeping one array means a new message only ever
// has to be added in one place.
//
// Array order is display order, so the course students sit at the top.
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
  /** Where the teacher wrote from, e.g. 'United Kingdom'. */
  country?: string
  /** Flag emoji for `country`, shown beside it. */
  flag?: string
  /** Shown on the course sales page — the ones with the most specific results. */
  featured?: boolean
}

export const teacherTestimonials: TeacherTestimonial[] = [
  // The four course students lead the order: they bought and worked through the
  // trilogy, so their messages carry the sales page in a way that notes from
  // free-content followers can't.
  {
    name: 'Kirsten',
    role: 'Online English Tutor',
    country: 'United Kingdom',
    flag: '🇬🇧',
    content:
      'I didn’t just watch the course once and move on. I watched it, rewatched it, took pages and pages of notes. I had to pause the video every few seconds because almost every sentence was something I wanted to write down.',
    rating: 5,
    result: 'Flooded with trial bookings and new student conversions',
    featured: true,
  },
  {
    name: 'Hillary',
    role: 'Online English Tutor',
    country: 'United States',
    flag: '🇺🇸',
    content:
      'I was accepted onto an online teaching platform, and within about a week, parents had booked all of the availability I opened. I finally feel like I am moving forward.',
    rating: 5,
    result: 'Within a week, parents had booked all of my availability',
    featured: true,
  },
  {
    name: 'Iman',
    role: 'Online English Tutor',
    country: 'Palestine',
    flag: '🇵🇸',
    content:
      'I felt much more confident as a tutor and I’ve seen an increase in my bookings. It’s practical, easy to follow, and full of valuable advice from someone who genuinely wants tutors to succeed.',
    rating: 5,
    result: 'Rebuilt her tutoring business after a three-year break',
    featured: true,
  },
  {
    name: 'Diamond',
    role: 'Online English Tutor',
    country: 'Mexico',
    flag: '🇲🇽',
    content:
      'It gave me a chance to make sure I’m on the right track. I also love that I have lifetime access so I can refer back whenever I need to as I continue growing.',
    rating: 5,
    result: 'Double-checked my approach and got back on track',
    featured: true,
  },
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
