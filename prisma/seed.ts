import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const courses = [
    {
      slug: 'course-1',
      title: 'Course 1',
      description: 'Start your English teaching journey with the foundations.',
      order: 1,
      isBundle: false,
      bundleIncludes: [],
      published: true,
    },
    {
      slug: 'course-2',
      title: 'Course 2',
      description: 'Build on your foundations and develop your teaching practice.',
      order: 2,
      isBundle: false,
      bundleIncludes: [],
      published: true,
    },
    {
      slug: 'course-3',
      title: 'Course 3',
      description: 'Master advanced skills and grow a thriving teaching career.',
      order: 3,
      isBundle: false,
      bundleIncludes: [],
      published: true,
    },
    {
      slug: 'course-full',
      title: 'Full Course Bundle',
      description: 'All 3 courses included — complete English teacher mastery.',
      order: 4,
      isBundle: true,
      bundleIncludes: ['course-1', 'course-2', 'course-3'],
      published: true,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      create: course,
      update: course,
    })
    console.log(`✓ ${course.slug}`)
  }

  console.log('Courses seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
