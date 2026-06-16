// Sales-page copy for the course detail pages (/teachers/courses/[slug]).
// Kept separate from the DB lesson descriptions: these are the tighter,
// tease-led blurbs used to sell, while /learn shows the full lesson copy.
// Source: "BOOKED — Sales Page Copy (v2)", Millie Cooper, June 2026.

export type SalesModule = {
  title: string
  teaser: string
  anchor?: string // e.g. "Clance & Imes (1978) on imposter syndrome"
}

export type CourseSales = {
  slug: string
  courseNumber: string // "Course 1"
  label: string // "GET READY"
  tagline: string // punchy one-line headline
  intro: string
  price: number // one-time price in USD
  meta: string[] // short stat chips for the hero
  modules: SalesModule[]
}

export const courseSales: Record<string, CourseSales> = {
  'get-ready': {
    slug: 'get-ready',
    courseNumber: 'Course 1',
    label: 'GET READY',
    tagline: 'Set up a teaching business that students take seriously.',
    intro:
      'The foundations course. Eleven modules that take you from “thinking about it” to live, accepted, and ready to teach. By the end you’ll have a profile that converts, an intro video that books, rates set with confidence, and a clear plan for where your first five students will actually come from.',
    price: 49,
    meta: ['11 modules', '~110–125 min of video', 'Worksheets, templates & tools'],
    modules: [
      {
        title: 'Welcome + the kind of tutor you want to be',
        teaser:
          'The three non-negotiable traits that decide who quits in month two — and who doesn’t.',
        anchor: 'Clance & Imes (1978) on imposter syndrome',
      },
      {
        title: 'Do you actually need a TEFL?',
        teaser:
          'The honest answer, the five reasons it matters, and exactly which TEFL is worth your money.',
      },
      {
        title: 'Choosing your route: platform, private, or hybrid',
        teaser:
          'Platform, private, or hybrid — and exactly what to do if you get rejected from the one you wanted.',
      },
      {
        title: 'Tech setup that doesn’t cost a fortune',
        teaser:
          'Five things that decide whether students stay on your video. Most are free. None cost more than £30.',
      },
      {
        title: 'Your essential software stack',
        teaser: 'Six tools every online tutor uses. Five are free. One costs £15 a month.',
      },
      {
        title: 'Setting your rates with confidence',
        teaser:
          'Why undercharging signals inexperience — and the actual rate progression that took me from $8 to $40.',
        anchor: 'Tversky & Kahneman (1974) on anchoring bias',
      },
      {
        title: 'Building a tutor profile that gets clicked',
        teaser:
          'The six-step structure that turns a generic profile into one students actually choose.',
      },
      {
        title: 'The intro video that makes them book',
        teaser:
          'Six seconds. That’s how long a student takes to decide. Here’s what to put in them.',
        anchor: 'Ambady & Rosenthal (1992) on thin-slicing',
      },
      {
        title: 'Pricing structures: trial pricing, packages, and when to raise',
        teaser:
          'Trial pricing, packages, and the five signals that mean it’s time to raise your rates.',
      },
      {
        title: 'Invoicing, taxes & freelance admin',
        teaser: 'The unsexy module that protects everything else.',
      },
      {
        title: 'Where your first five students come from',
        teaser: 'Five sources. Only one is the platform.',
      },
    ],
  },

  'get-booked': {
    slug: 'get-booked',
    courseNumber: 'Course 2',
    label: 'GET BOOKED',
    tagline: 'Turn your presence into a calendar full of trial lessons.',
    intro:
      'The marketing engine. Twelve modules that take you from “profile is live but the calendar is empty” to a steady stream of trial bookings that convert. Built on real conversion research — Cialdini’s six principles, the Mere Exposure Effect, the Halo Effect, and the Affective Filter.',
    price: 79,
    meta: ['12 modules', '~110–130 min of video', 'Templates, scripts & frameworks'],
    modules: [
      {
        title: 'The self-perception gap',
        teaser:
          'The Dunning-Kruger flip — and the five-question audit that shows you where the evidence actually places you.',
        anchor: 'Kruger & Dunning (1999)',
      },
      {
        title: 'The Holograms framework',
        teaser:
          'Ten distinct types of student. Once you can recognise them, your conversion changes permanently.',
        anchor: 'Adapted from Klarić’s neuromarketing research',
      },
      {
        title: 'The LMNOP method',
        teaser: 'Five letters. The strategic backbone of getting students online.',
      },
      {
        title: 'L — Locate: finding the right niche, for the right people',
        teaser:
          'Picking a niche label is the beginner version. Locating the specific person inside is the full one.',
      },
      {
        title: 'M — Market: where your students actually are',
        teaser:
          'Where your students actually are — and the six principles of influence that make your content land.',
        anchor: 'Cialdini’s Influence (1984)',
      },
      {
        title: 'N — Narrate: telling your story across every channel',
        teaser:
          'One you. Three channels. Three angles on the same story — and why familiarity converts harder than virality.',
        anchor: 'Zajonc (1968) on the Mere Exposure Effect',
      },
      {
        title: 'O — Optimise: the practical work that gets you found',
        teaser:
          'Algorithms aren’t magic — they’re rules. Once you know them, you can play the game properly.',
        anchor: 'Thorndike (1920) on the Halo Effect',
      },
      {
        title: 'P — Position: standing out as the premium choice',
        teaser:
          'Premium or Value. Stuck in the middle costs you more students than any other mistake.',
      },
      {
        title: 'The trial lesson framework: your 50-minute timeline',
        teaser:
          'Five phases. One principle. The framework that took my conversion from 50% to over 80%.',
      },
      {
        title: 'The trial in practice: rapport, needs & reading your student (0–40 min)',
        teaser:
          'What to send before the trial. What to listen for in the first ten minutes. What to do in the demo.',
        anchor: 'Krashen’s Affective Filter Hypothesis (1982)',
      },
      {
        title: 'The trial in practice: soft close, follow-up & vocab list (40–50 + after)',
        teaser:
          'The last 10 minutes of the trial — and the 24 hours after — are where the booking is won or lost.',
      },
      {
        title: 'Why trials don’t convert + referrals + filling your calendar long-term',
        teaser:
          'Six honest reasons trials don’t convert — and the three long-term levers that fill calendars for years.',
      },
    ],
  },

  'stay-booked': {
    slug: 'stay-booked',
    courseNumber: 'Course 3',
    label: 'STAY BOOKED',
    tagline: 'Keep students for months — and build recurring income.',
    intro:
      'The career-building course. Twelve modules that take you from “someone who tutors online” to “a Career Tutor with a real, scalable practice.” Built around the SCALE framework — the diagnostic system you’ll use for the rest of your career.',
    price: 59,
    meta: ['12 modules', '~130–150 min of video', 'The deepest course in the trilogy'],
    modules: [
      {
        title: 'Welcome + the Career Tutor identity + the SCALE framework',
        teaser: 'The framework you’ll use for the rest of your career, introduced in one module.',
        anchor: 'Rosenthal & Jacobson (1968) — the Pygmalion Effect',
      },
      {
        title: 'S — The 50-minute lesson structure that works',
        teaser:
          'Five phases. Specific order. Refined across 4,000 lessons. Plus the four official TEFL frameworks for context.',
      },
      {
        title: 'S — Building a personalised learning journey: what to actually teach',
        teaser:
          'What to actually teach in lesson two, five, and twenty — and the technique that makes it stick.',
        anchor: 'Roediger & Karpicke (2006) on retrieval under varied contexts',
      },
      {
        title: 'S — Sourcing real materials: articles, videos, conversation prompts',
        teaser:
          'Five free sources. One paid subscription worth the money. And the AI workflow that takes prep from 20 minutes to 4.',
      },
      {
        title: 'S — Conversation that flows: starters, follow-ups, and graceful redirecting',
        teaser:
          'Three skills that make any lesson feel natural — including the silence rule that separates okay tutors from great ones.',
      },
      {
        title: 'S — Teaching across levels: A1, A2, B1, B2, C1, C2',
        teaser: 'Same tutor. Same fifty minutes. Completely different lesson at each level.',
      },
      {
        title: 'S — Correcting without embarrassing them',
        teaser:
          'The skill nobody trains you on — and the one that decides whether students feel safe with you.',
        anchor: 'Dweck (2006) on the growth mindset',
      },
      {
        title: 'C — Vocab lists + the retention system that keeps students for years',
        teaser:
          'The single highest-leverage thing I do. It’s the reason my students stay 2+ years on average.',
        anchor: 'Ebbinghaus’s Forgetting Curve',
      },
      {
        title: 'A — AI for the modern tutor (and what AI could never do)',
        teaser:
          'Five workflows that give you back 5–8 hours a week — and the four things AI could never do.',
      },
      {
        title: 'L — Longevity: energy, sustainability, and the students who drain you',
        teaser: 'Most tutors burn out by month 18. The five practices that prevent it.',
        anchor: 'Maslach (2001) on the three dimensions of burnout',
      },
      {
        title: 'E — Earnings: the Career Tutor’s economics',
        teaser: 'How you go from $8 an hour to $40 — without working more hours.',
        anchor: 'Cal Newport’s research on career capital',
      },
      {
        title: 'Becoming the Career Tutor: the SCALE self-audit and the trilogy close',
        teaser: 'Score yourself out of 50. Find your weakest letter. Know exactly what to focus on next.',
      },
    ],
  },
}

// Order the bundle curriculum follows.
export const trilogyOrder = ['get-ready', 'get-booked', 'stay-booked'] as const

export const bundleSales = {
  slug: 'course-full',
  label: 'The BOOKED Trilogy',
  tagline: 'Everything. All three. Built to work together.',
  pricing: {
    // Each course's individual price, so it's clear what the total is made of.
    breakdown: 'GET READY $49 + GET BOOKED $79 + STAY BOOKED $59',
    separateTotal: '$187',
    bundlePrice: '$149',
    save: 'Buy all three together and save $38 — and unlock the full system.',
  },
  intro: [
    'Most online tutoring courses solve one problem. BOOKED is built around the truth that there isn’t one problem — there are three, in a specific order. GET READY sets you up. GET BOOKED gets you students. STAY BOOKED turns it into a career. Each course finishes exactly where the next one begins. The handovers between them are designed.',
    'You can buy them separately. But you’ll learn faster, build momentum sooner, and get the full system if you take them together. Most tutors who buy GET READY come back for the other two within the first month anyway. The bundle saves you that decision — and $38.',
  ],
  whatYouGet: [
    'All 35 modules across all three courses — approximately 350 minutes of video content',
    'Every worksheet, template, and downloadable across the trilogy — including the Platform-Match Excel, the rate calculator, every message template I’ve ever written, the SCALE self-audit, the Holograms reference cards, and the niche-finder workbook',
    'The full SCALE diagnostic — the framework you’ll come back to for the rest of your career',
    'Lifetime access — every module, every update, every addition',
    'Linked resources page — every tool, book, and platform mentioned, all in one place',
    'Founding-member price — early-bird pricing applies this week only',
  ],
  whyTitle: 'Most courses give you frameworks. BOOKED gives you a career.',
  why: [
    'GET READY answers “how do I start?” — but starting without a marketing plan is how 70% of new tutors quit in month two. GET BOOKED answers “how do I get students?” — but getting students without a retention system is how tutors burn out at year two. STAY BOOKED answers “how does this become my actual life?” — but it only works if you’ve done the first two properly.',
    'The trilogy is built so each course solves the problem the next one assumes you’ve already handled.',
  ],
  whoFor: [
    'Stay-at-home parents looking for flexible, real income from a laptop',
    'Career changers who want a career that fits a life, not the other way around',
    'Existing tutors with a few students who want to scale to a full calendar',
    'Anyone who’s tried teaching online and quit — and is ready to come back with a system',
  ],
  whoNotFor: [
    'Tutors who already make $40+/hour and have 2-year-average retention (you’ve already figured it out)',
    'Anyone hoping for get-rich-quick — this is a multi-month build, honestly handled',
  ],
  riskReversal: [
    'If BOOKED isn’t right for you in the first seven days, you get every penny back. No questions. No emails to write. No hoops.',
    'I built this because I genuinely wish someone had handed it to me on day one. If it isn’t that for you, you shouldn’t have paid for it.',
  ],
  closing: '🤍 BOOKED is live. Early-bird pricing all week.',
  byline:
    'By Millie Cooper — TEFL-certified, UCL Master’s, four years, 4,000+ lessons, 300+ students from 30+ countries. The trilogy I wish I’d had on day one.',
}
