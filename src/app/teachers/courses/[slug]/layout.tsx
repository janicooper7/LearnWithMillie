import type { Metadata } from 'next'
import { courseSales, bundleSales } from '@/lib/courseSalesContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sales = slug === bundleSales.slug ? bundleSales : courseSales[slug]
  const name =
    slug === bundleSales.slug ? bundleSales.label : sales ? titleCase(sales.label) : null
  return {
    title: name ? `${name} – Course for English Teachers` : 'Courses for English Teachers',
    ...(sales ? { description: sales.tagline } : {}),
    alternates: {
      canonical: `/teachers/courses/${slug}`,
    },
  }
}

// "GET READY" -> "Get Ready"
function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children
}
