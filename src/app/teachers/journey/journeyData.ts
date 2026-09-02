// Content for the online-teacher roadmap at /teachers/journey.
//
// The roadmap is the sales page that sits *above* the individual product
// pages: it puts the three BOOKED courses and the two tools on a single
// timeline, so a teacher can see where they are and buy only the next step.
// Prices mirror courseSalesContent.ts and the Stripe checkout routes —
// update them here if those change.

import {
  Award,
  Banknote,
  Bot,
  Brain,
  CalendarCheck,
  Compass,
  Eye,
  Filter,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Laptop,
  Layers,
  Lightbulb,
  MessageSquare,
  Megaphone,
  Mic,
  Package,
  PenLine,
  Puzzle,
  Repeat,
  Rocket,
  Route,
  Search,
  Send,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  Wallet,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

export type JourneyProduct = {
  /** Short kind label shown above the name. */
  eyebrow: string
  name: string
  price: string
  /** One line on what it does for this particular stage. */
  blurb: string
  meta: string[]
  href: string
  cta: string
  icon: LucideIcon
  /** Tools are styled lighter than the paid courses. */
  tone: 'course' | 'tool'
}

/* ------------------------------------------------------------------ */
/* Products — named once, then referenced by both the stages and the   */
/* recommendations, so a price only ever changes in one place.         */
/* ------------------------------------------------------------------ */

export const platformFinder: JourneyProduct = {
  eyebrow: 'Teaching tool',
  name: 'Platform Finder',
  price: '$5',
  blurb:
    'Seven questions about your situation, then a ranked list of the platforms that hire teachers like you — sorted by pay and fit.',
  meta: ['33 platforms', '2-minute quiz', 'Ranked report'],
  href: '/teachers/platform-finder',
  cta: 'Find your platform',
  icon: Compass,
  tone: 'tool',
}

export const getReady: JourneyProduct = {
  eyebrow: 'Course 1 · GET READY',
  name: 'Set up a teaching business students take seriously',
  price: '$49',
  blurb:
    'The foundations course. Eleven modules that take you from “thinking about it” to live, accepted, and ready to teach.',
  meta: ['11 modules', '~110–125 min', 'Worksheets & templates'],
  href: '/teachers/courses/get-ready',
  cta: 'See GET READY',
  icon: Rocket,
  tone: 'course',
}

export const getBooked: JourneyProduct = {
  eyebrow: 'Course 2 · GET BOOKED',
  name: 'Turn your presence into a calendar full of trials',
  price: '$79',
  blurb:
    'Marketing and trial-lesson mastery. The framework that took trial conversion from 50% to over 80%.',
  meta: ['12 modules', '~110–130 min', 'Scripts & templates'],
  href: '/teachers/courses/get-booked',
  cta: 'See GET BOOKED',
  icon: Megaphone,
  tone: 'course',
}

export const stayBooked: JourneyProduct = {
  eyebrow: 'Course 3 · STAY BOOKED',
  name: 'Lesson craft, retention, and the SCALE framework',
  price: '$59',
  blurb:
    'The deepest course in the trilogy. Lesson structure, materials, correction, AI workflows, and the retention system behind it all.',
  meta: ['12 modules', '~130–150 min', 'Reference cards & audits'],
  href: '/teachers/courses/stay-booked',
  cta: 'See STAY BOOKED',
  icon: GraduationCap,
  tone: 'course',
}

export const debateGenerator: JourneyProduct = {
  eyebrow: 'Teaching tool',
  name: 'Debate Generator',
  price: '$7',
  blurb:
    'The one you’ll open mid-lesson. Thought-provoking ESL debate topics with key vocabulary, generated in seconds when a B2 lesson runs dry.',
  meta: ['Endless topics', 'Key vocabulary', 'Lifetime access'],
  href: '/teachers/debategenerator',
  cta: 'Try the generator',
  icon: Mic,
  tone: 'tool',
}

export const mentorship: JourneyProduct = {
  eyebrow: 'One-to-one',
  name: 'Mentorship with Millie',
  price: 'From $50',
  blurb:
    'Where a course can’t answer it. Bring your calendar, your rates, or a student you’re stuck with, and work through it live.',
  meta: ['1:1 sessions', 'Your situation', 'Built around you'],
  href: '/teachers/mentorship',
  cta: 'Browse mentorship',
  icon: Users,
  tone: 'tool',
}

export const trilogy: JourneyProduct = {
  eyebrow: 'All three courses',
  name: 'The BOOKED Trilogy',
  price: '$149',
  blurb:
    'GET READY, GET BOOKED and STAY BOOKED together — 35 modules with the handovers between them designed, and $38 off buying separately.',
  meta: ['35 modules', '~350 min', 'Lifetime access'],
  href: '/teachers/courses#pricing',
  cta: 'Get the trilogy',
  icon: Package,
  tone: 'course',
}

/* ------------------------------------------------------------------ */
/* The five stages                                                     */
/* ------------------------------------------------------------------ */

export type JourneyStage = {
  id: string
  number: string
  phase: string
  timeframe: string
  effort: string
  icon: LucideIcon
  title: string
  /** The honest description of where a teacher is standing at this point. */
  where: string
  does: { icon: LucideIcon; text: string }[]
  products: JourneyProduct[]
}

export const stages: JourneyStage[] = [
  {
    id: 'choose-your-route',
    number: '01',
    phase: 'Choose your route',
    timeframe: 'Week 1',
    effort: 'One evening',
    icon: Compass,
    title: 'Decide where you’ll actually teach',
    where:
      'You know you want to teach English online. What you don’t know is whether to apply to a platform, go private, or do both — and every “best platform” list you’ve read was written by someone who has never taught a lesson.',
    does: [
      {
        icon: Filter,
        text: 'Get honest about the four things platforms really filter on: passport, degree, TEFL, and availability',
      },
      {
        icon: Search,
        text: 'See which of 33 platforms will genuinely consider a teacher with your profile',
      },
      {
        icon: Banknote,
        text: 'Compare what they actually pay — not what their marketing page claims',
      },
      {
        icon: XCircle,
        text: 'Rule out the platforms that would have eaten three weeks of applications',
      },
      {
        icon: Route,
        text: 'Commit to one route: platform, private, or hybrid',
      },
    ],
    products: [platformFinder],
  },
  {
    id: 'get-ready',
    number: '02',
    phase: 'Get ready',
    timeframe: 'Weeks 1–4',
    effort: '11 modules · ~2 hours',
    icon: Rocket,
    title: 'Build a setup students take seriously',
    where:
      'You’ve been accepted, or you’re about to apply. Now there’s a profile to write, an intro video to film, and a rate to set — plus the quiet worry that you’re not qualified enough to charge anyone for this.',
    does: [
      {
        icon: Award,
        text: 'Settle the TEFL question: whether you need one, and which is worth the money',
      },
      {
        icon: Laptop,
        text: 'Set up tech that makes you look professional — most of it free, none of it over $40',
      },
      {
        icon: Wallet,
        text: 'Set a rate you can say out loud without flinching, and know when to raise it',
      },
      {
        icon: PenLine,
        text: 'Write a profile using the six-step structure that gets clicked instead of scrolled past',
      },
      {
        icon: Video,
        text: 'Film the intro video that wins the six seconds a student gives you',
      },
      {
        icon: UserPlus,
        text: 'Map exactly where your first five students are coming from',
      },
    ],
    products: [getReady],
  },
  {
    id: 'get-booked',
    number: '03',
    phase: 'Get booked',
    timeframe: 'Months 2–3',
    effort: '12 modules · ~2 hours',
    icon: Megaphone,
    title: 'Fill a calendar that’s still mostly empty',
    where:
      'The profile is live and nothing is happening. Or trials are coming in and half of them never book again. This is the stage where roughly seven in ten new tutors quietly give up — not because they teach badly, but because nobody knows they exist.',
    does: [
      {
        icon: Target,
        text: 'Locate a niche narrow enough that the right students recognise themselves in it',
      },
      {
        icon: Globe,
        text: 'Market across the five channels working tutors actually use — the LMNOP method',
      },
      {
        icon: Sparkles,
        text: 'Tell your story consistently with the 10 Holograms framework',
      },
      {
        icon: Eye,
        text: 'Optimise the practical things that get you found and clicked',
      },
      {
        icon: Timer,
        text: 'Run the 5-phase, 50-minute trial lesson framework, minute by minute',
      },
      {
        icon: Send,
        text: 'Close softly, follow up properly, and turn happy students into referrals',
      },
    ],
    products: [getBooked],
  },
  {
    id: 'teach-well',
    number: '04',
    phase: 'Teach lessons they remember',
    timeframe: 'Months 3–6',
    effort: '12 modules · ~2.5 hours',
    icon: GraduationCap,
    title: 'Make the lesson itself the reason they stay',
    where:
      'Students are booking. Now the pressure moves inside the lesson: what do you teach in week seven, how do you correct someone without embarrassing them, and how do you stop losing your Sunday to lesson prep?',
    does: [
      {
        icon: Layers,
        text: 'Run the 50-minute lesson structure that works at every level from A1 to C2',
      },
      {
        icon: CalendarCheck,
        text: 'Build a personalised learning journey so week seven is never improvised',
      },
      {
        icon: Puzzle,
        text: 'Source real materials — articles, videos, prompts — without starting from a blank page',
      },
      {
        icon: MessageSquare,
        text: 'Keep conversation flowing with starters, follow-ups, and graceful redirects',
      },
      {
        icon: Heart,
        text: 'Correct in a way that builds confidence instead of shutting it down',
      },
      {
        icon: Bot,
        text: 'Use AI workflows for planning and vocab lists that give you back 5–8 hours a week',
      },
    ],
    products: [stayBooked, debateGenerator],
  },
  {
    id: 'build-a-career',
    number: '05',
    phase: 'Build a career',
    timeframe: 'Month 6 and beyond',
    effort: 'Ongoing',
    icon: TrendingUp,
    title: 'Turn a full calendar into a career that lasts',
    where:
      'You’re booked. The risk is no longer finding students — it’s burning out on the wrong ones, staying stuck at a rate you set when you were nervous, and having nobody to ask when something stops working.',
    does: [
      {
        icon: SlidersHorizontal,
        text: 'Run the SCALE self-audit and see which of the five levers is actually holding you back',
      },
      {
        icon: Repeat,
        text: 'Keep students for years with a retention system, not good intentions',
      },
      {
        icon: Shield,
        text: 'Protect your energy — and recognise the students quietly draining it',
      },
      {
        icon: Brain,
        text: 'Price like a career tutor: packages, raises, and the economics that make it sustainable',
      },
      {
        icon: Handshake,
        text: 'Bring the hard cases to someone who has taught 4,000 lessons and seen them before',
      },
      {
        icon: Lightbulb,
        text: 'Decide what comes next — a niche, a waitlist, your own materials, your own students’ referrals',
      },
    ],
    products: [mentorship],
  },
]

/* ------------------------------------------------------------------ */
/* The picker: a situation, the stage it maps to, and what to buy      */
/* ------------------------------------------------------------------ */

export type Recommendation = {
  /** Rank label — the first one in each list is the actual next step. */
  badge: string
  /** Why this product, for someone in this specific situation. */
  why: string
  product: JourneyProduct
}

export type FinderOption = {
  label: string
  detail: string
  stageIndex: number
  icon: LucideIcon
  /** The line that names the real problem, shown above the picks. */
  verdict: string
  picks: Recommendation[]
}

export const finderOptions: FinderOption[] = [
  {
    label: 'I haven’t started',
    detail: 'No platform, no profile, no idea where to apply.',
    stageIndex: 0,
    icon: Compass,
    verdict:
      'Two moves get you from nothing to teaching. Find out where you can actually get hired — that’s one evening — then walk in ready, instead of learning it on your first five students.',
    picks: [
      {
        badge: 'Step 1',
        why: 'Two minutes of honesty about your passport, degree and TEFL, and you’ll have a ranked shortlist of the platforms that will genuinely take you — instead of three weeks of applications that were never going to land.',
        product: platformFinder,
      },
      {
        badge: 'Step 2 · Best value',
        why: 'Now set up to win the job. All 35 modules — TEFL, tech, rates, profile, intro video, marketing, the trial framework, and the retention system — in the order you’ll actually need them, for $38 less than buying the three separately.',
        product: trilogy,
      },
      {
        badge: 'Or start smaller',
        why: 'If the trilogy is more than you want to spend this month, GET READY on its own takes you from “thinking about it” to live and accepted — and it’s the first third of the bundle either way.',
        product: getReady,
      },
    ],
  },
  {
    label: 'I’m setting up',
    detail: 'Applying, writing a profile, or working out what to charge.',
    stageIndex: 1,
    icon: Rocket,
    verdict:
      'You’re at stage 02. GET READY covers exactly this week — but the calendar doesn’t fill on its own once you’re live, so plan for stage 03 now.',
    picks: [
      {
        badge: 'Start here',
        why: 'Eleven modules on precisely what’s in front of you: the TEFL decision, tech under $40, rates, a profile that converts, and the intro video.',
        product: getReady,
      },
      {
        badge: 'Worth doing first',
        why: 'If you’re not certain you’re applying to the right places, check before you spend a fortnight on applications.',
        product: platformFinder,
      },
      {
        badge: 'Best value',
        why: 'GET READY gets you live. It won’t fill the calendar — that’s GET BOOKED, and it’s already inside the bundle.',
        product: trilogy,
      },
    ],
  },
  {
    label: 'I’m live but empty',
    detail: 'The profile exists. The calendar doesn’t fill.',
    stageIndex: 2,
    icon: Megaphone,
    verdict:
      'This is the stage most new tutors quit at — and it’s a marketing problem, not a teaching one. Fix visibility and trial conversion first.',
    picks: [
      {
        badge: 'Start here',
        why: 'Marketing across the five channels working tutors actually use, plus the 5-phase trial framework that took conversion from 50% to over 80%.',
        product: getBooked,
      },
      {
        badge: 'Rule this out',
        why: 'An empty calendar is sometimes the wrong platform rather than the wrong profile. Two minutes tells you which.',
        product: platformFinder,
      },
      {
        badge: 'Best value',
        why: 'GET BOOKED is $79 of the $149. The other two courses cost $70 more — including the retention system you’ll need the week students start arriving.',
        product: trilogy,
      },
    ],
  },
  {
    label: 'I have students, no system',
    detail: 'Lessons happen. Sundays disappear. Some students drift away.',
    stageIndex: 3,
    icon: GraduationCap,
    verdict:
      'The bottleneck has moved inside the lesson. Structure and prep workflows buy back your week; retention stops the quiet drop-offs.',
    picks: [
      {
        badge: 'Start here',
        why: 'The 50-minute structure, personalised learning journeys, correction that builds confidence, and AI workflows worth 5–8 hours a week.',
        product: stayBooked,
      },
      {
        badge: 'Add this',
        why: 'You’ll open this one mid-lesson every week a B2 conversation runs dry.',
        product: debateGenerator,
      },
      {
        badge: 'Best value',
        why: 'If students drift away as fast as they arrive, the gap is usually back in GET BOOKED. All three courses for $149.',
        product: trilogy,
      },
    ],
  },
  {
    label: 'I’m booked, and stuck',
    detail: 'Full calendar, flat rate, and no plan for year three.',
    stageIndex: 4,
    icon: TrendingUp,
    verdict:
      'Full isn’t the same as sustainable. Diagnose which lever is capping you, then get a second pair of eyes on the decisions a course can’t make for you.',
    picks: [
      {
        badge: 'Start here',
        why: 'The SCALE self-audit: five levers, one honest read on which of them is actually holding your earnings and energy down.',
        product: stayBooked,
      },
      {
        badge: 'Add this',
        why: 'For what a course can’t answer — your rates, your calendar, the student you’re stuck with. Bring it and work through it live.',
        product: mentorship,
      },
      {
        badge: 'Best value',
        why: 'Booked isn’t booked for years. If you built this by improvising, the full trilogy backfills the parts you skipped — for $38 less than separately.',
        product: trilogy,
      },
    ],
  },
]

export const bundle = {
  separateTotal: '$187',
  price: '$149',
  save: '$38',
  href: '/teachers/courses#pricing',
  points: [
    'All 35 modules across all three courses — around 350 minutes of video',
    'Every worksheet, template, script and download in the trilogy',
    'The full SCALE diagnostic you’ll come back to for years',
    'Lifetime access, including every future update',
    '7-day full refund — no questions, no hoops',
  ],
}
