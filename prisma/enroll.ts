import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const email = 'johnycooper2301@gmail.com'
  const bundleSlug = 'course-full'

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (!user) throw new Error(`No user found with email ${email}`)

  const bundle = await prisma.course.findUnique({
    where: { slug: bundleSlug },
    select: { id: true, isBundle: true, bundleIncludes: true },
  })
  if (!bundle) throw new Error(`Course "${bundleSlug}" not found`)

  const slugsToGrant = [bundleSlug, ...(bundle.isBundle ? bundle.bundleIncludes : [])]
  const courses = await prisma.course.findMany({
    where: { slug: { in: slugsToGrant } },
    select: { id: true, slug: true },
  })

  for (const course of courses) {
    await prisma.userCourseAccess.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      create: { userId: user.id, courseId: course.id },
      update: {},
    })
    console.log(`✓ granted access: ${course.slug}`)
  }

  console.log(`\nDone — ${email} enrolled in "${bundleSlug}" + ${courses.length - 1} included course(s).`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
