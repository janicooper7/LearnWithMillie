import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/students`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/teachers`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/teachers/courses`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/teachers/mentorship`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/teachers/platform-finder`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/teachers/debategenerator`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/teacher-materials`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ].map((route) => ({ ...route, lastModified: new Date() }))

  // Public course sales pages — one entry per published course.
  // Auth-gated /learn/[slug] pages are intentionally excluded.
  let courseRoutes: MetadataRoute.Sitemap = []
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    courseRoutes = courses.map((course) => ({
      url: `${baseUrl}/teachers/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch {
    // If the DB is unreachable at build time, still emit the static sitemap.
  }

  return [...staticRoutes, ...courseRoutes]
}
