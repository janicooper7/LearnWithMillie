import { courseSales, bundleSales } from '@/lib/courseSalesContent'
import { trilogyPrice } from '@/lib/trilogyOffer'

// Course structured data for /teachers/courses/[slug]. Name, description and
// price come from the same sales content the page renders, so the markup can't
// advertise a price the visitor doesn't see (the trilogy uses the live sale price).
export default function CourseSchema({ slug }: { slug: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
  const isBundle = slug === bundleSales.slug
  const sales = isBundle ? null : courseSales[slug]
  if (!isBundle && !sales) return null

  const url = `${siteUrl}/teachers/courses/${slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: isBundle ? bundleSales.label : sales!.label,
    description: isBundle ? bundleSales.intro[0] : sales!.intro,
    url,
    inLanguage: 'en',
    audience: { '@type': 'EducationalAudience', educationalRole: 'teacher' },
    provider: {
      '@type': 'EducationalOrganization',
      name: 'LearnWithMillie',
      url: siteUrl,
    },
    creator: { '@type': 'Person', name: 'Millie Cooper', url: `${siteUrl}/about` },
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: isBundle ? trilogyPrice() : sales!.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: isBundle ? 'PT350M' : undefined,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
