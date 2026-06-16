import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

const STAY_BOOKED_SLUG = 'stay-booked'

// Placeholder Vimeo video stands in until the real lesson recordings are uploaded.
// Swap each module's `vimeoId` (and `vimeoHash` if the video is private) for the
// real ID as the recordings come in, then re-run this seed.
const PLACEHOLDER_VIMEO_ID = '76979871'

// STAY BOOKED — Course 3 of the BOOKED Trilogy.
// 12 real modules (titles + descriptions + key topics), organised around the
// SCALE framework: Skill, Continuity, Automation, Longevity, Earnings.
// Idempotent: re-running updates the existing lessons in place by order.
const STAY_BOOKED_MODULES: {
  title: string
  description: string
  topics: string[]
  vimeoId?: string
  vimeoHash?: string
}[] = [
  {
    title: `Module 1 — Welcome + the Career Tutor identity + the SCALE framework`,
    vimeoId: '1201505991', // real recording uploaded
    description: `Sets up the whole course and the identity that everything else rests on. There are two kinds of online tutor — side-hustlers and Career Tutors — and the choice shapes every decision from rates to schedule to skill development. Introduces the SCALE framework that organises the rest of the course: Skill, Continuity, Automation, Longevity, Earnings.`,
    topics: [
      `The Career Tutor identity vs the side-hustler trap`,
      `The SCALE framework — five dimensions of a tutoring career`,
      `The Pygmalion Effect (Rosenthal & Jacobson, 1968) — your belief shapes their progress`,
      `Krashen's Affective Filter — students stay when they feel safe speaking with you`,
    ],
  },
  {
    title: `Module 2 — S — Skill: The 50-minute lesson structure that works`,
    vimeoId: '1201505992', // real recording uploaded
    description: `The exact template I use for almost every regular 50-minute lesson with my long-term students. Five phases in a specific order, for specific reasons — and a credibility detour through the four official TEFL frameworks (PPP, ESA, TTT, TBL) for context. By the end you'll have a structure you can use for every lesson going forward.`,
    topics: [
      `The five-phase 50-minute lesson structure`,
      `Why the order matters — cold first means freeze, warm first means flow`,
      `The four official TEFL frameworks compared (PPP, ESA, TTT, TBL)`,
      `Why my structure is closest to boomerang ESA`,
      `How to test which framework works best for your style`,
    ],
  },
  {
    title: `Module 3 — S — Skill: Building a personalised learning journey — what to actually teach`,
    vimeoId: '1201505993', // real recording uploaded
    description: `The module that answers the question every new tutor asks at lesson two: what do I actually teach them? Five core categories each for conversational and business English, an honest signpost for exam prep and kids, and topic stacking — anchored in Roediger & Karpicke (2006) — the technique that takes everything you teach and makes it stick.`,
    topics: [
      `The 5 categories for conversational English`,
      `The 5 categories for business English`,
      `Honest signposting for exam prep and kids (with specialist training routes)`,
      `Topic stacking — same vocab, four contexts, four lessons`,
      `Worked example: the travel stack`,
    ],
  },
  {
    title: `Module 4 — S — Skill: Sourcing real materials — articles, videos, conversation prompts`,
    vimeoId: '1201505995', // real recording uploaded
    description: `The single biggest question I get from other tutors — where do you get your lesson materials from? This module gives the full answer. The free sources I actually use, the one paid subscription that's saved me hundreds of prep hours, AI workflows for custom materials, and the adaptation principle that turns anything generic into something that feels like yours.`,
    topics: [
      `The five free sources I use weekly`,
      `ESL Brains — the paid subscription that pays for itself`,
      `AI tools for tutors (Claude, ChatGPT, iChalkie, Topic to Lesson)`,
      `My top 10 conversational and top 10 business English lessons`,
      `The five-step adaptation checklist`,
    ],
  },
  {
    title: `Module 5 — S — Skill: Conversation that flows — starters, follow-ups, and graceful redirecting`,
    vimeoId: '1201510647', // real recording uploaded
    description: `The conversational backbone of every lesson. Three skills that together make any lesson feel natural: how to start strong, how to keep it flowing with the right follow-up questions, and how to gracefully redirect when a student goes off on a tangent. Plus the silence rule — the hardest skill to learn — that separates okay tutors from great ones.`,
    topics: [
      `The five lesson starters (never default to "how was your weekend?")`,
      `The four follow-up question categories (dig deeper, feel it, expand, soften pushback)`,
      `The silence rule — count to seven before you fill the gap`,
      `Three strengths of redirect phrases (soft / medium / firmer)`,
      `Spotting and handling the anxiety tangent`,
    ],
  },
  {
    title: `Module 6 — S — Skill: Teaching across levels — A1, A2, B1, B2, C1, C2`,
    vimeoId: '1201510941', // real recording uploaded
    description: `The biggest mistake new tutors make is treating every student roughly the same way. An A1 beginner and a C2 advanced student need almost opposite approaches. This module covers what changes at each end of the spectrum, plus the intermediate plateau — the long, flat B1/B2 stretch where many students get stuck for years.`,
    topics: [
      `Teaching A1/A2: slow pace, visuals, recasting, small wins, staying in their tense`,
      `Teaching B1/B2: pushing past comfortable vocab, breaking the intermediate plateau, output over input`,
      `Teaching C1/C2: precision, naturalness, cultural nuance`,
      `The level adjustment grid — what shifts at each level`,
      `How to name the plateau directly to your B1/B2 students`,
    ],
  },
  {
    title: `Module 7 — S — Skill: Correcting without embarrassing them`,
    vimeoId: '1201510986', // real recording uploaded
    description: `Correction is the skill nobody trains you on — and yet it decides whether students feel safe with you. Done badly, it embarrasses them and they go quiet. Done well, it's almost invisible and they leave more confident. The warm phrases, the correction filter, the recasting technique, and Dweck's growth mindset research that gives all of this a stronger foundation.`,
    topics: [
      `The principle: correction is a gift, not a public embarrassment`,
      `The correction filter — when to correct in real time, when to log for later`,
      `The warm correction phrases`,
      `Recasting — the most invisible form of correction`,
      `Dweck's growth mindset (Dweck, 2006) — how language shapes the learner's identity`,
    ],
  },
  {
    title: `Module 8 — C — Continuity: Vocab lists + the retention system that keeps students for years`,
    vimeoId: '1201511023', // real recording uploaded
    description: `The single most important module in STAY BOOKED. The vocab list system has done more for my retention than every clever lesson activity, every great material, every smart prompt combined. It's the reason my students stay an average of two-plus years. Anchored in Ebbinghaus's Forgetting Curve — without intervention, students lose 80% of a lesson within a week.`,
    topics: [
      `Why the vocab list is the single biggest retention lever`,
      `The Forgetting Curve (Ebbinghaus, 1885) — what you're fighting against`,
      `The vocab list format — word / phrase / definition / example sentence`,
      `The AI workflow that takes a vocab list from 20 minutes to 4`,
      `Remembering the small personal details — what makes a tutor irreplaceable`,
    ],
  },
  {
    title: `Module 9 — A — Automation: AI for the modern tutor, and what AI could never do`,
    vimeoId: '1201514514', // real recording uploaded
    description: `The module that didn't exist three years ago. In 2026, if you're not using AI to leverage your time as a tutor, you're working three times harder than the tutors who do — but the bigger story is what AI could never do. The four uniquely human things that are your moat in the age of AI.`,
    topics: [
      `The five AI workflows that change everything (vocab, materials, questions, assessments, lesson planning)`,
      `The three rules for using AI well (personalisation / templates / privacy)`,
      `The four things AI cannot do — your moat`,
      `Real-time attunement, accountability, personalised history, belief in them`,
      `The synthesis — the AI-augmented Career Tutor`,
    ],
  },
  {
    title: `Module 10 — L — Longevity: Energy, sustainability, and the students who drain you`,
    vimeoId: '1201514677', // real recording uploaded
    description: `The module about energy, sustainability, and avoiding the burnout that ends most online tutoring careers within eighteen months. Grounded in Christina Maslach's foundational research on the three dimensions of burnout. Plus the two specific situations every tutor faces — students who go quiet, and students who become difficult — each with their own playbook.`,
    topics: [
      `Maslach's three dimensions of burnout (Maslach et al., 2001)`,
      `The five longevity practices (cap hours, build gaps, protect a day, take real holidays, cap difficult students)`,
      `The check-in message for students who go quiet`,
      `The difficult-student playbook`,
      `How to know when it's time to let a student go`,
    ],
  },
  {
    title: `Module 11 — E — Earnings: The Career Tutor's economics — money, mastery, rates`,
    vimeoId: '1201515623', // real recording uploaded
    description: `The module about money — how you turn online tutoring into an income that grows over years instead of staying flat at $14 an hour. Grounded in Cal Newport's career capital model. The four sources of career capital, the rate progression that follows when you build it deliberately, the qualification ladder (CELTA → DELTA → MA TESOL), and the financial planning that protects what you've built.`,
    topics: [
      `Career capital (Newport, 2012) — mastery comes first, then autonomy and income`,
      `The four sources of tutor career capital`,
      `The CELTA → Trinity → DELTA → MA TESOL qualification ladder`,
      `When to raise rates — any two of four signals`,
      `Financial planning for the freelance tutor (buffer, tax, retirement)`,
    ],
  },
  {
    title: `Module 12 — Becoming the Career Tutor: the SCALE self-audit and the trilogy close`,
    vimeoId: '1201519225', // real recording uploaded
    description: `The final module of STAY BOOKED — and the final module of the BOOKED trilogy. Walk through the SCALE self-audit so you can see exactly where you stand across all five dimensions. Get a clear horizon for 3, 5, and 10 years from here. Close out the whole trilogy properly. Designed as the diagnostic you'll use for the rest of your working life.`,
    topics: [
      `The SCALE self-audit — score yourself out of 50`,
      `Interpreting your score — focus on the lowest letter`,
      `Which module to revisit for each weak dimension`,
      `The 3 / 5 / 10 year career horizon`,
      `The BOOKED trilogy close`,
    ],
  },
]

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: STAY_BOOKED_SLUG } })
  if (!course) throw new Error(`${STAY_BOOKED_SLUG} not found — create it in the admin UI first`)

  const lessons = STAY_BOOKED_MODULES.map((m, i) => {
    const order = i + 1
    const topicLines = m.topics.map((t) => `• ${t}`).join('\n')
    return {
      order,
      title: m.title,
      description: `${m.description}\n\nWhat's inside:\n${topicLines}`,
      vimeoId: m.vimeoId ?? PLACEHOLDER_VIMEO_ID,
      vimeoHash: m.vimeoHash ?? null,
      duration: 300 + order * 30, // placeholder durations until real videos are measured
    }
  })

  for (const lesson of lessons) {
    const existing = await prisma.courseLesson.findFirst({
      where: { courseId: course.id, order: lesson.order },
      select: { id: true },
    })
    if (existing) {
      await prisma.courseLesson.update({ where: { id: existing.id }, data: lesson })
    } else {
      await prisma.courseLesson.create({ data: { ...lesson, courseId: course.id } })
    }
    console.log(`  ✓ ${STAY_BOOKED_SLUG} / module ${lesson.order} → vimeo:${lesson.vimeoId}`)
  }

  console.log('STAY BOOKED modules seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
