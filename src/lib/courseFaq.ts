// FAQ for the course sales page.
//
// Answers are plain strings so the same text feeds both the accordion and the
// FAQPage JSON-LD without a second copy drifting out of date. Anything here
// that states a policy (refunds, access, updates) has to match /terms#courses.

export type CourseFaqItem = {
  question: string
  answer: string
}

export const courseFaq: CourseFaqItem[] = [
  {
    question: 'I have never taught English before — will this actually work for me?',
    answer:
      'Yes. The trilogy is built to be started from zero. Course 1 (GET READY) assumes you have never taught a lesson, never applied to a platform, and have no idea which TEFL to pick — it walks you through the decisions in order, from certification to your first five students. Millie started at $8 an hour with no teaching background, and the trilogy is the route she took, written down.',
  },
  {
    question: 'Is this for complete beginners, or for tutors who are already teaching?',
    answer:
      'Both, and the three-course structure is why. If you have never taught, start at GET READY and work through in order. If you are already teaching but not full, GET BOOKED (marketing and trial-lesson conversion) is usually where the gap is. If your calendar fills but students drift away after a few months, STAY BOOKED covers lesson craft and retention. You can buy the trilogy or start with the single course that matches where you are stuck.',
  },
  {
    question: 'How long until I see results?',
    answer:
      'That depends entirely on how quickly you apply it, and nobody can honestly promise you a date or an income figure. What the trilogy gives you is the sequence — profile, application, marketing, trial lesson — so you are not guessing at which step to take next. Some teachers have written in within days of applying it; others build more slowly around a job or family. The material is yours for life, so you can move at whatever pace real life allows.',
  },
  {
    question: 'Which platforms does this apply to?',
    answer:
      'The frameworks are platform-agnostic and are taught with the major marketplaces in mind — Preply, italki, Cambly and similar sites — as well as finding private students directly. Profile and application guidance is most specific to the big marketplaces, while the marketing, trial-lesson and retention systems apply wherever your students come from, including students you find and bill yourself.',
  },
  {
    question: 'How much time do I need to put in each week?',
    answer:
      'The videos total around 350 minutes across 35 modules, so you could watch the whole trilogy in a week of evenings. The work is in applying it — rewriting a profile, filming an intro video, running trial lessons. A few focused hours a week is enough to move through it steadily. This is a system you take action with rather than something you only watch.',
  },
  {
    question: 'Do I have to buy all three courses at once?',
    answer:
      'No. The trilogy is the best value and the courses are designed to run in order, each finishing where the next begins — but every course is also sold on its own if you would rather start with one. If you buy a single course first and later want the rest, you can simply purchase the others when you are ready.',
  },
  {
    question: 'How long do I have access, and do I get future updates?',
    answer:
      'Access is for life. It is a one-time payment with no subscription and no renewal, you can watch on mobile or desktop, and the worksheets, templates and downloads are yours to keep. Access is granted to you personally and is not transferable.',
  },
  {
    question: 'What if it is not right for me?',
    answer:
      'Every course is backed by a 7-day money-back guarantee. If you decide it is not for you, email Millie within 7 days of purchase quoting the address you used at checkout and you will get a full refund — we only ask that you have watched the first module first, so the course has had a fair chance. Approved refunds are processed back to your original payment method within 5 to 10 business days, and your statutory rights are unaffected.',
  },
]
