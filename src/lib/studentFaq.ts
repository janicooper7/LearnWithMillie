// FAQ for the students page (/students#faq).
//
// Shared by the accordion and the FAQPage JSON-LD so the two can't drift.
// Answers may contain <br/> for the accordion; the schema strips tags.

export type StudentFaqItem = {
  question: string
  answer: string
}

export const studentFaq: StudentFaqItem[] = [
  {
    question: 'How can I pay for my subscription?',
    answer:
      "You can pay for your subscription via Stripe. If you set up an automatic payment on Stripe, your payments will automatically be taken at the same time every month — it's hassle free for you!",
  },
  {
    question:
      'How can I book a single lesson instead of buying the bundle/subscription?',
    answer:
      "If you wish to buy extra lessons separately please get in touch with me and I'll be happy to help! Whether you need a few extra lessons to prepare for an upcoming work presentation or job interview, we can find suitable dates and time to work together in achieving your goals.",
  },
  {
    question: 'Can I change my subscription plan?',
    answer:
      'You can upgrade or downgrade your plan anytime. If you are looking to increase your monthly lessons, or want to temporarily decrease them, just get in touch.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription anytime. Following the cancellation of your subscription, you will not be charged for the next month on your next billing date. You can still take lessons with the remaining balance.',
  },
  {
    question:
      'Do I have to schedule the same amount of lessons each week with a subscription?',
    answer:
      "Once you have paid for your monthly amount of lessons, you can schedule them anytime suitable for you. If you are away one week and wish to schedule two lessons for the previous week — that totally works too!<br/><br/>I would highly recommend having regular, weekly lessons for the most effective learning experience, but it's totally up to you!",
  },
]
