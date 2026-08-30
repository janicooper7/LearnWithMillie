// Single source of truth for student testimonials.
//
// These are reviews from Millie's one-on-one English students. Both the
// students page and the homepage social-proof band show all of them in a
// carousel. Keeping one array means a new review only ever has to be added in
// one place.
//
// `role` is the student's country — that's the detail reviews are signed with.

export type StudentTestimonial = {
  name: string
  /** Country the student is learning from, e.g. 'Germany'. */
  role: string
  content: string
  rating: number
  /** Headshot path under /public. Falls back to an initial-letter avatar. */
  photo?: string
}

export const studentTestimonials: StudentTestimonial[] = [
  {
    name: 'Sophie',
    role: 'France',
    content:
      'Militsa is a wonderful and brilliant woman. It\'s always a pleasure to talk with her. Time flies, her lessons are well-prepared and tailored to my level. I can already feel that my level has improved. Every exchange is enriching. Our lessons start with a discussion, followed by vocabulary work. After each session, she sends me the words we covered together. I can only highly recommend her.',
    rating: 5,
  },
  {
    name: 'Verena',
    role: 'Germany',
    content:
      'Millie is a great teacher! The lessons are very well prepared, and each lesson covers a different topic. There is a lot of discussion, so the individual speaking time is very high. Millie is super friendly and empathetic! Absolute recommendation 😊',
    rating: 5,
  },
  {
    name: 'Johanna',
    role: 'Austria',
    content:
      'Millie is an extraordinary teacher who stands out for her professionalism, empathy, patience, and also humor. Due to her friendly, motivating, and incredibly competent manner, learning is fun and does not focus on deficits. Her lessons are designed in such a way that you not only practice conversation with targeted phrases but also discuss current topics. I look forward to every lesson and my further learning journeys with her!',
    rating: 5,
  },
  {
    name: 'Emanuela',
    role: 'Italy',
    content:
      'Militsa is an excellent tutor, highly knowledgeable and passionate about her work. She offers lessons on current topics, making discussions enjoyable due to her deep understanding of current affairs. With remarkable patience, she guides her students through complex subjects with ease. I wholeheartedly recommend her to anyone seeking an enriching English learning experience.',
    rating: 5,
  },
  {
    name: 'Patrycja',
    role: 'Poland',
    content:
      'Millie is a fantastic teacher. Always cheerful, she puts you at ease right away, seeks to understand all possible areas of improvement, and never makes the lesson boring. I\'m truly satisfied and happy with the journey I have undertaken with her. Highly recommend her as well!',
    rating: 5,
  },
  {
    name: 'Lubica',
    role: 'Slovakia',
    content:
      'I have found the ideal conversation teacher in Millie. She brings interesting topics to each lesson and makes every session enjoyable. It feels like a natural conversation with her, as she encourages me to speak as much as possible. Her practice of sending actual vocabulary with explanations after each session greatly enhances my learning experience. I highly recommend her!',
    rating: 5,
  },
  {
    name: 'Dmytro',
    role: 'Ukraine',
    content:
      'Millie is a true gem. She is not just a tutor but a wonderful human being who makes learning enjoyable. Her kindness, confidence, and communication skills will make a significant difference in your English language journey. I\'m grateful for her lesson and would highly recommend her to anyone seeking to improve their English skills. Thank you for being such an inspiring tutor!',
    rating: 5,
  },
  {
    name: '학배',
    role: 'South Korea',
    content:
      'Militsa is very hard-working, well-prepared, encouraged, well-organized and customer-oriented. I had the great time with her for my English improvement. Thank you so much !!!',
    rating: 5,
  },
  {
    name: 'Xintong',
    role: 'China',
    content:
      'Militsa is an amazing tutor. She has very clear accent and she\'s always very patient and nice. Also, she is good at choosing the course content, and the lessons are very interesting and useful. She really helps me to improve a lot. I would highly recommend to choose her as your English tutor, and I\'ll keep learning with her.',
    rating: 5,
  },
]
