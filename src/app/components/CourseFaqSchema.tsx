import { courseFaq } from '@/lib/courseFaq'

// FAQPage structured data for /teachers/courses. Reads the same array the
// accordion renders, so the markup can never claim an answer the page doesn't
// actually show — which is what Google requires of FAQ rich results.
export default function CourseFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: courseFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
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
