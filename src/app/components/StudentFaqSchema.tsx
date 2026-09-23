import { studentFaq } from '@/lib/studentFaq'

// FAQPage structured data for /students. Reads the same array the accordion
// renders, so the markup only ever claims answers the page actually shows.
export default function StudentFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: studentFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim(),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
