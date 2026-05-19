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

  // Course 1 — 10 placeholder modules (lorem ipsum + placeholder Vimeo).
  // Idempotent: re-running updates the existing lessons in place by order.
  const course1 = await prisma.course.findUnique({ where: { slug: 'course-1' } })
  if (!course1) throw new Error('course-1 not found — course upsert above must have failed')

  const PLACEHOLDER_VIMEO_ID = '76979871'

  const LOREM_SHORT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  const LOREM_LONG =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

  const course1Lessons = Array.from({ length: 10 }, (_, i) => {
    const order = i + 1
    return {
      order,
      title: `Module ${order}`,
      description: order % 2 === 0 ? LOREM_LONG : LOREM_SHORT,
      vimeoId: PLACEHOLDER_VIMEO_ID,
      vimeoHash: null as string | null,
      duration: 300 + order * 30, // 5:30, 6:00, 6:30, … placeholder durations
    }
  })

  for (const lesson of course1Lessons) {
    const existing = await prisma.courseLesson.findFirst({
      where: { courseId: course1.id, order: lesson.order },
      select: { id: true },
    })
    if (existing) {
      await prisma.courseLesson.update({ where: { id: existing.id }, data: lesson })
    } else {
      await prisma.courseLesson.create({ data: { ...lesson, courseId: course1.id } })
    }
    console.log(`  ✓ course-1 / module ${lesson.order}`)
  }

  console.log('Course 1 modules seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
