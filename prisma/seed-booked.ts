import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

const GET_BOOKED_SLUG = 'get-booked'

// GET BOOKED — Course 2 of the BOOKED Trilogy.
// 12 real modules (titles + descriptions + key topics). Vimeo IDs are the real
// uploaded recordings, in order. Idempotent: re-running updates the existing
// lessons in place by order.
const GET_BOOKED_MODULES: {
  title: string
  description: string
  topics: string[]
  vimeoId: string
  vimeoHash?: string
}[] = [
  {
    title: `Module 1 — The self-perception gap`,
    vimeoId: '1200811375',
    description: `The most important mindset piece in the trilogy — and one you've never seen taught anywhere. The lesser-known half of the Dunning-Kruger study shows that skilled people systematically underestimate their ability. By the end of this short module, you'll know what the gap is, how to spot it in yourself, and how to do everything that follows from where the evidence actually places you.`,
    topics: [
      `The self-perception gap most tutors live with`,
      `The Dunning-Kruger flip — the half nobody quotes (Kruger & Dunning, 1999)`,
      `The five-question self-perception audit`,
      `Why the fix isn't confidence — it's evidence`,
    ],
  },
  {
    title: `Module 2 — The Holograms framework`,
    vimeoId: '1200811377',
    description: `The single framework that makes every marketing decision in the rest of the course sharper. Ten archetypes — five Dominants who want to stand out, five Followers who want to belong — and the words, behaviours, and atavistic fears that tell you which one you're talking to. Once you can recognise the Hologram, every piece of language you choose can be tuned to land.`,
    topics: [
      `The ten Holograms (5 Dominants, 5 Followers)`,
      `The words each Hologram uses`,
      `The atavistic fear underneath each archetype`,
      `"Meet them where they are now" — the principle that runs through the rest of GET BOOKED`,
    ],
  },
  {
    title: `Module 3 — The LMNOP method`,
    vimeoId: '1200811378',
    description: `The strategic acquisition system that organises Modules 4–8. Five letters in a specific order: Locate, Market, Narrate, Optimise, Position. A short overview module that names the system, explains why the order matters, and sets up the deep dives that follow.`,
    topics: [
      `The five letters of LMNOP`,
      `Why P (Position) comes last for a reason`,
      `How LMNOP combines with the Holograms framework`,
      `The cyclical nature of all five — you'll come back to them many times`,
    ],
  },
  {
    title: `Module 4 — L — Locate: finding the right niche, for the right people`,
    vimeoId: '1200811376',
    description: `Picking a niche label is the beginner's version. Locating the specific person inside the niche is the full version. The five-question L audit takes your niche from a category to a magnet, and the language test confirms whether your current profile is speaking to your specific student — or to nobody in particular. Plus an honest section for multi-niche tutors.`,
    topics: [
      `The five-question L audit`,
      `The language test — would your specific person feel spoken to?`,
      `Multi-niche tutors: primary + mention, stacked, or split`,
      `Niche × Hologram mapping`,
    ],
  },
  {
    title: `Module 5 — M — Market: where your students actually are`,
    vimeoId: '1200813770',
    description: `Online teaching is around 70% marketing — and the tutors who fill their calendars work all five sources of students. This module covers the channels that match each niche, the content principle that decides whether you grow, the realistic cadence to hit, and the foundational research from Cialdini that gives every piece of marketing a stronger backbone than instinct.`,
    topics: [
      `The five sources of students`,
      `Channels × niches (TikTok, Instagram, LinkedIn, YouTube, Facebook)`,
      `"Don't post about you. Post about them."`,
      `Cialdini's six principles of influence (Cialdini, 1984)`,
      `The minimum weekly cadence + batching system`,
    ],
  },
  {
    title: `Module 6 — N — Narrate: telling your story across every channel`,
    vimeoId: '1200813918',
    description: `Once you're visible across multiple channels, every touchpoint is another opportunity to narrate your story — and every one should be speaking to the specific person you located in Module 4. This module covers the five narration touchpoints, the consistency check, and the Mere Exposure Effect that makes patient, repeated showing-up more powerful than going viral.`,
    topics: [
      `"One you. Three channels. Three angles on the same story."`,
      `The five narration touchpoints (bio, content, first message, intro video, first 30 seconds of trial)`,
      `The consistency check`,
      `The Mere Exposure Effect (Zajonc, 1968) — why familiarity converts`,
    ],
  },
  {
    title: `Module 7 — O — Optimise: the practical work that gets you found`,
    vimeoId: '1200815317',
    description: `Algorithms aren't magic — they're rules, and once you know them, you can play the game properly. This module covers the Preply ranking factors in detail, plus shorter rules for italki and Cambly, the warm-lead workflow most tutors miss completely, and the protocol for handling the bad review that will eventually arrive. Grounded in the Halo Effect — every touchpoint might be a first impression.`,
    topics: [
      `Preply ranking factors (in order of weight)`,
      `The Super Tutor badge — what it actually measures`,
      `The profile-saved warm-lead workflow`,
      `The Halo Effect (Thorndike, 1920) — no second-string content`,
      `The five-step bad-review damage-control protocol`,
      `Equivalent rules for private tutors (Google, testimonials, response speed)`,
    ],
  },
  {
    title: `Module 8 — P — Position: standing out as the premium choice`,
    vimeoId: '1200816644',
    description: `The final letter of LMNOP, and the one that ties everything else together. Two strategic positions — Premium or Value — and how every other decision (rates, language, availability, intro video) has to match the one you pick. The mistake most tutors make is being stuck in the middle. This module makes you pick a side and commit.`,
    topics: [
      `The two positioning strategies — Premium vs Value`,
      `How rate, language, availability, and intro video each shift with your position`,
      `The mistake of being stuck in the middle`,
      `Why underpricing makes students trust you less, not more`,
    ],
  },
  {
    title: `Module 9 — The trial lesson framework: your 50-minute timeline`,
    vimeoId: '1200817671',
    description: `Everything in the first eight modules gets a stranger to the moment of the trial lesson. This module is where we cover the framework that converts trial lessons into long-term students. Five phases, in a specific order, anchored in one principle: a trial lesson isn't about selling — it's about connection. By the end, you'll have the complete structure; the next two modules walk through each phase in detail.`,
    topics: [
      `The principle: connection, not selling`,
      `The five-phase timeline (pre-trial / 0–10 / 10–25 / 25–40 / 40–50 + after)`,
      `Why the order matters`,
      `The trial-day don'ts and always-do's`,
    ],
  },
  {
    title: `Module 10 — The trial in practice: rapport, needs & reading your student (0–40 min)`,
    vimeoId: '1200818758',
    description: `The first four phases of the trial in detail. The pre-trial message that almost nobody sends but which measurably boosts conversion. The small-talk phase that lowers Krashen's affective filter so the student's real ability surfaces. The four things to listen for in the first ten minutes. And the demo lesson that has to match your real teaching style — not a flashy version of it.`,
    topics: [
      `The two pre-trial messages (within 1 hour of booking, day-before reminder)`,
      `Krashen's Affective Filter (Krashen, 1982) — why Phase 2 exists`,
      `The 0–10 minute question bank`,
      `The four signals to read in the first 10 minutes`,
      `The 10–25 minute needs questions + the mid-trial breather`,
      `Tuning the Phase 4 demo to the student you've identified`,
    ],
  },
  {
    title: `Module 11 — The trial in practice: soft close, follow-up & vocab list (40–50 + after)`,
    vimeoId: '1200820892',
    description: `The last 10 minutes of the trial and the 24 hours after are where the booking is actually won or lost. The soft close that opens the door without pushing through it, the next-lesson seed-planting tuned to who you've understood the student to be, and the follow-up message + vocab list that turn a warm trial into a long-term student.`,
    topics: [
      `The soft-close principle: "space to think and decide"`,
      `The three soft-close questions (how often / what days / what times)`,
      `Tuning the close to different student types`,
      `The 24-hour follow-up message templates`,
      `Why the vocab list is the secret weapon`,
    ],
  },
  {
    title: `Module 12 — Why trials don't convert + referrals + filling your calendar long-term`,
    vimeoId: '1200821252',
    description: `You'll do everything right and some trials still won't convert. That's normal. This module covers the diagnostic for why trials sometimes fail, the referral system that turns one happy student into a chain of bookings, and the three long-term levers that fill calendars for years. Plus the bridge into Course 3 — what do you actually teach them in lesson two, five, and twenty?`,
    topics: [
      `The six reasons trials don't convert`,
      `The referral message template (and what happens when you send it)`,
      `The three long-term levers: Retention, Reputation, Visibility`,
      `The bridge to STAY BOOKED — what comes after the booking`,
    ],
  },
]

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: GET_BOOKED_SLUG } })
  if (!course) throw new Error(`${GET_BOOKED_SLUG} not found — create it in the admin UI first`)

  const lessons = GET_BOOKED_MODULES.map((m, i) => {
    const order = i + 1
    const topicLines = m.topics.map((t) => `• ${t}`).join('\n')
    return {
      order,
      title: m.title,
      description: `${m.description}\n\nWhat's inside:\n${topicLines}`,
      vimeoId: m.vimeoId,
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
    console.log(`  ✓ ${GET_BOOKED_SLUG} / module ${lesson.order} → vimeo:${lesson.vimeoId}`)
  }

  console.log('GET BOOKED modules seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
