import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

// The live courses (created via the admin UI) use these slugs.
// An earlier version of this seed used course-1/2/3 + a "Full Course Bundle",
// which created orphan courses and broke the real bundle's includes. The
// cleanup + bundle repair below undo that and are safe to re-run.
const GET_READY_SLUG = 'get-ready'
const BUNDLE_SLUG = 'course-full'
const BUNDLE_INCLUDES = ['get-ready', 'get-booked', 'stay-booked']
const ORPHAN_SLUGS = ['course-1', 'course-2', 'course-3']

async function main() {
  // Remove the orphan courses the old seed created (only ever empty placeholders
  // with no enrolled students — guard so we never delete a course someone owns).
  for (const slug of ORPHAN_SLUGS) {
    const orphan = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, _count: { select: { userAccess: true } } },
    })
    if (!orphan) continue
    if (orphan._count.userAccess > 0) {
      console.log(`! skipping delete of "${slug}" — it has ${orphan._count.userAccess} student(s)`)
      continue
    }
    await prisma.course.delete({ where: { slug } }) // cascades to its lessons
    console.log(`✓ removed orphan course "${slug}"`)
  }

  // Repair the bundle the old seed clobbered: point it at the real course slugs
  // so a bundle purchase grants access to get-ready/get-booked/stay-booked
  // (see api/webhook/route.ts, which grants [slug, ...bundleIncludes]).
  const bundle = await prisma.course.findUnique({ where: { slug: BUNDLE_SLUG } })
  if (bundle) {
    await prisma.course.update({
      where: { slug: BUNDLE_SLUG },
      data: {
        title: 'BOOKED Trilogy',
        description: 'All 3 courses — launch, fill, and keep your tutoring business thriving.',
        bundleIncludes: BUNDLE_INCLUDES,
        isBundle: true,
      },
    })
    console.log(`✓ repaired bundle "${BUNDLE_SLUG}" → includes [${BUNDLE_INCLUDES.join(', ')}]`)
  }

  // GET READY — 11 real modules (titles + descriptions + key topics).
  // Placeholder Vimeo video stands in until the real lesson recordings are uploaded.
  // Idempotent: re-running updates the existing lessons in place by order.
  const course1 = await prisma.course.findUnique({ where: { slug: GET_READY_SLUG } })
  if (!course1) throw new Error(`${GET_READY_SLUG} not found — create it in the admin UI first`)

  const PLACEHOLDER_VIMEO_ID = '76979871'

  const GET_READY_MODULES: {
    title: string
    description: string
    topics: string[]
    vimeoId?: string
    vimeoHash?: string
  }[] = [
    {
      title: `Module 1 — Welcome + the kind of tutor you want to be`,
      vimeoId: '1200062966', // real recording uploaded
      description: `Sets up the whole course and the mindset that makes everything else work. The three non-negotiable traits of every successful online tutor — emotional intelligence, adaptability, and consistency — plus the imposter syndrome research that gives you permission to start before you feel ready.`,
      topics: [
        `The three traits of every successful online tutor`,
        `Who this course is actually for`,
        `What's inside the BOOKED Trilogy`,
        `Imposter syndrome and the perfectionism trap (Clance & Imes, 1978)`,
      ],
    },
    {
      title: `Module 2 — Do you actually need a TEFL? (And if so, which one to get)`,
      vimeoId: '1200063065', // real recording uploaded
      description: `The honest answer to the question every new tutor asks, and a comparison of which TEFL course is actually worth your money. Also covers the "do I need previous experience?" question — what your existing career background, whatever it is, actually brings to your tutoring.`,
      topics: [
        `The technical answer vs the honest answer`,
        `Five reasons to get TEFL-certified anyway`,
        `TEFL.org Premier 120-hour vs Level 5 Diploma compared`,
        `Reframing non-teaching backgrounds (healthcare, business, parenting, tech, academia)`,
      ],
    },
    {
      title: `Module 3 — Choosing your route: platform, private, or hybrid?`,
      vimeoId: '1200063091', // real recording uploaded
      description: `The single biggest decision you'll make in your first month. The full pros and cons of teaching on existing platforms (Preply, italki, Cambly, Lingoda) versus going private versus running both. Includes the Platform-Match tool that tells you exactly which platforms you can apply to today.`,
      topics: [
        `Platform vs private vs hybrid: pros and cons of each`,
        `The five major adult-teaching platforms compared`,
        `Realistic income timelines for each route`,
        `What to do if you get rejected from a platform (the five common reasons and how to fix them)`,
      ],
    },
    {
      title: `Module 4 — Tech setup that doesn't cost a fortune`,
      vimeoId: '1200063108', // real recording uploaded
      description: `Exactly what you need to teach professionally from home — webcam, microphone, lighting, audio, screen setup — and what you absolutely don't need to spend money on. Plus what to fix first when things go wrong mid-lesson.`,
      topics: [
        `Webcam, microphone, and lighting essentials`,
        `The exact tech setup I use`,
        `Common tech issues and quick fixes`,
        `What to upgrade first when budget allows`,
      ],
    },
    {
      title: `Module 5 — Your essential software stack`,
      vimeoId: '1200065439', // real recording uploaded
      description: `The free and paid tools every online tutor actually uses — from video editing to lesson materials to scheduling. Built around the modern AI-enabled workflow that saves you hours every week.`,
      topics: [
        `Video editing tools (CapCut, InShot)`,
        `Lesson materials and slide tools`,
        `Scheduling and calendar setup`,
        `The AI tools that make your prep faster`,
      ],
    },
    {
      title: `Module 6 — Setting your rates with confidence`,
      vimeoId: '1200065583', // real recording uploaded
      description: `Why undercharging hurts you more than you think — grounded in Tversky and Kahneman's anchoring bias research. The realistic rate ranges for each niche, the career-stage progression to plan around, and a practical word on time zones that nobody warns you about.`,
      topics: [
        `Pricing in the market — the realistic rate ranges by niche`,
        `Career-stage progression: under 1 year / 1–3 years / 3+ years`,
        `The Busy Tutor vs Smart Tutor maths`,
        `Anchoring bias and the cost of undercharging (Tversky & Kahneman, 1974)`,
        `Time zone strategy and protecting your sleep`,
      ],
    },
    {
      title: `Module 7 — Building a tutor profile that gets clicked`,
      vimeoId: '1200388322', // real recording uploaded
      description: `The six-step structure that turns a generic profile into one students actually choose. Why specificity beats credentials, and how to write a description that makes the right student feel like you wrote it about them.`,
      topics: [
        `The six-step profile description structure`,
        `Writing a headline that gets clicked`,
        `Choosing the right profile photo`,
        `The mistakes that get profiles ignored`,
      ],
    },
    {
      title: `Module 8 — The intro video that makes them book`,
      vimeoId: '1200388324', // real recording uploaded
      description: `The single most important asset on your tutor profile — and the Harvard research from Ambady & Rosenthal that explains why six seconds of silent footage decides whether a student books you. The six-step script framework, the production checklist, and a special version for tutors who have no teaching experience yet.`,
      topics: [
        `Why thin-slicing means the first six seconds matter (Ambady & Rosenthal, 1992)`,
        `The six-step intro video script framework`,
        `The six-step production checklist (lighting, audio, framing, editing)`,
        `A special script for beginner tutors with no teaching experience`,
        `The YouTube hack that saves you hours uploading to multiple platforms`,
      ],
    },
    {
      title: `Module 9 — Pricing structures: trial pricing, packages, and when to raise`,
      vimeoId: '1200388323', // real recording uploaded
      description: `How to price your trial lesson, when to bundle into packages, and the exact signals that tell you it's time to raise your rates. Plus the conversation with existing students that costs you fewer of them than you'd think.`,
      topics: [
        `Trial pricing strategies that don't undersell you`,
        `When and how to bundle into packages`,
        `The signals that mean it's time to raise rates`,
        `How to communicate a rate increase to existing students`,
      ],
    },
    {
      title: `Module 10 — Invoicing, taxes & freelance admin (the unsexy essentials)`,
      vimeoId: '1200388321', // real recording uploaded
      description: `The bit nobody covers — invoicing private students, choosing a payment processor, setting aside tax money every month, and the financial basics that turn online tutoring from a hobby into a real income.`,
      topics: [
        `Payment processors compared (Wise, Stripe, PayPal)`,
        `Invoicing private students cleanly`,
        `Tax setup for freelance tutors`,
        `The financial admin to set up in your first month`,
      ],
    },
    {
      title: `Module 11 — Where your first five students come from`,
      vimeoId: '1200391577', // real recording uploaded
      description: `The honest answer to "how do I get my first students?" — five distinct sources, none of which are "go viral on TikTok." Plus the mental prep for first-lesson nerves, what the first 90 days actually look like in terms of income, and an honest look at the wall every new tutor hits at five students.`,
      topics: [
        `The five sources of your first five students`,
        `Mental prep for your first lesson (and what to do if it goes silent)`,
        `What the first 90 days actually look like (realistic income timeline)`,
        `The wall at five students — and how Course 2 (GET BOOKED) gets you to twenty-five`,
      ],
    },
  ]

  const course1Lessons = GET_READY_MODULES.map((m, i) => {
    const order = i + 1
    const topicLines = m.topics.map((t) => `• ${t}`).join('\n')
    return {
      order,
      title: m.title,
      description: `${m.description}\n\nWhat's inside:\n${topicLines}`,
      vimeoId: m.vimeoId ?? PLACEHOLDER_VIMEO_ID,
      vimeoHash: m.vimeoHash ?? null,
      duration: 300 + order * 30, // placeholder durations until real videos are uploaded
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
    console.log(`  ✓ ${GET_READY_SLUG} / module ${lesson.order}`)
  }

  console.log('GET READY modules seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
