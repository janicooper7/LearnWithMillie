// Per-module resource links shown beneath a module's content (separate from the
// Amazon "Course must-haves" in courseEssentials.ts). These are the external
// links referenced inside specific modules — exam bodies, material sources, AI
// tools, qualification providers. Some are affiliate links (marked below), some
// aren't; affiliate links render with rel="sponsored".
//
// Keyed by `${courseSlug}:${moduleOrder}` — moduleOrder matches the lesson's
// `order` (i.e. its module number). Only modules with links need an entry.

export type ResourceLink = {
  label: string
  url: string
  affiliate?: boolean
}

export type ResourceGroup = {
  heading?: string
  links: ResourceLink[]
}

// TEFL.org affiliate links all carry Millie's referral param (?fpr=millie24).
const COURSE_RESOURCES: Record<string, ResourceGroup[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // GET READY (Course 1)
  // ─────────────────────────────────────────────────────────────────────────

  // Module 2 — Do you actually need a TEFL? (the two TEFL routes to choose between)
  'get-ready:2': [
    {
      heading: 'TEFL courses',
      links: [
        {
          label: 'TEFL.org — 120-Hour TEFL Course',
          url: 'https://www.tefl.org/courses/combined/120-hour-tefl-course/?fpr=millie24',
          affiliate: true,
        },
        {
          label: 'TEFL.org — 270-Hour Level 5 TEFL Course (Diploma)',
          url: 'https://www.tefl.org/courses/level-5/270-hour-level-5-tefl-course/?fpr=millie24',
          affiliate: true,
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // STAY BOOKED (Course 3)
  // ─────────────────────────────────────────────────────────────────────────

  // Module 3 — Building a personalised learning journey (exam prep signposting)
  'stay-booked:3': [
    {
      heading: 'Exam prep — official bodies',
      links: [
        {
          label: 'Cambridge Assessment English — Teacher Development',
          url: 'https://www.cambridgeenglish.org/teaching-english/teaching-qualifications/',
        },
        {
          label: 'IDP IELTS — Teacher Training Program',
          url: 'https://ielts.idp.com/about/ielts-for-teachers/ielts-teacher-training-program',
        },
        {
          label: 'British Council — Teach IELTS',
          url: 'https://takeielts.britishcouncil.org/teach-ielts',
        },
      ],
    },
    {
      heading: 'Exam prep & specialism courses',
      links: [
        {
          label: 'TEFL.org — Teaching Exam Preparation (40-hour)',
          url: 'https://www.tefl.org/courses/advanced/40-hour-teaching-exam-preparation-classes/?fpr=millie24&fp_sid=course',
          affiliate: true,
        },
        {
          label: 'TEFL.org — Teaching English for Academic Purposes (40-hour)',
          url: 'https://www.tefl.org/courses/advanced/40-hour-teaching-english-for-academic-purposes/?fpr=millie24',
          affiliate: true,
        },
        {
          label: 'TEFL.org — Teaching Young Learners (30-hour)',
          url: 'https://www.tefl.org/courses/advanced/30-hour-teaching-young-learners/?fpr=millie24',
          affiliate: true,
        },
        {
          label: 'TEFL.org — Teaching Business English (30-hour)',
          url: 'https://www.tefl.org/courses/advanced/30-hour-teaching-business-english/?fpr=millie24',
          affiliate: true,
        },
        {
          label: 'TEFL.org — Using AI in the TEFL Classroom',
          url: 'https://www.tefl.org/courses/advanced/using-ai-in-the-tefl-classroom/?fpr=millie24',
          affiliate: true,
        },
      ],
    },
  ],

  // Module 4 — Sourcing real materials
  'stay-booked:4': [
    {
      heading: 'Free sources',
      links: [
        { label: 'Engoo — Daily News', url: 'https://engoo.com/app/daily-news' },
        { label: 'British Council — Take IELTS', url: 'https://takeielts.britishcouncil.org/' },
        { label: 'OnestopEnglish', url: 'https://www.onestopenglish.com/' },
        {
          label: 'Cambridge English — Learner resources',
          url: 'https://www.cambridgeenglish.org/learning-english/',
        },
        { label: 'Engexam.info', url: 'https://engexam.info/' },
      ],
    },
    {
      heading: 'Paid source',
      links: [
        { label: 'ESL Brains', url: 'https://eslbrains.com?partner=WMgASJktFkdi', affiliate: true },
      ],
    },
    {
      heading: 'AI tools',
      links: [
        { label: 'Claude (Anthropic)', url: 'https://claude.ai/' },
        { label: 'ChatGPT (OpenAI)', url: 'https://chat.openai.com/' },
        { label: 'iChalkie', url: 'https://www.ichalkie.com/' },
        { label: 'Topic to Lesson', url: 'https://topictolesson.com/' },
      ],
    },
  ],

  // Module 9 — AI for the modern tutor (same AI tools as Module 4, re-linked)
  'stay-booked:9': [
    {
      heading: 'AI tools',
      links: [
        { label: 'Claude (Anthropic)', url: 'https://claude.ai/' },
        { label: 'ChatGPT (OpenAI)', url: 'https://chat.openai.com/' },
        { label: 'iChalkie', url: 'https://www.ichalkie.com/' },
        { label: 'Topic to Lesson', url: 'https://topictolesson.com/' },
      ],
    },
  ],

  // Module 11 — Earnings: the qualification ladder
  'stay-booked:11': [
    {
      heading: 'The qualification ladder',
      links: [
        {
          label: 'CELTA — Cambridge English',
          url: 'https://www.cambridgeenglish.org/teaching-english/teaching-qualifications/celta/',
        },
        {
          label: 'Trinity College London — CertTESOL',
          url: 'https://www.trinitycollege.com/qualifications/teaching-english/certtesol',
        },
        {
          label: 'DELTA — Cambridge English',
          url: 'https://www.cambridgeenglish.org/teaching-english/teaching-qualifications/delta/',
        },
        {
          label: 'Trinity College London — DipTESOL',
          url: 'https://www.trinitycollege.com/qualifications/teaching-english/diptesol',
        },
      ],
    },
  ],
}

export function getModuleResources(courseSlug: string, order: number): ResourceGroup[] {
  return COURSE_RESOURCES[`${courseSlug}:${order}`] ?? []
}

// All of a course's module links, merged into one set of groups (deduped by
// group heading, then by link URL) — used to show every resource once below the
// course player, available throughout the course rather than per module.
export function getAllCourseResources(courseSlug: string): ResourceGroup[] {
  const prefix = `${courseSlug}:`
  const byHeading = new Map<string, ResourceGroup>()
  const order: string[] = []

  for (const [key, groups] of Object.entries(COURSE_RESOURCES)) {
    if (!key.startsWith(prefix)) continue
    for (const group of groups) {
      const headingKey = group.heading ?? ''
      let merged = byHeading.get(headingKey)
      if (!merged) {
        merged = { heading: group.heading, links: [] }
        byHeading.set(headingKey, merged)
        order.push(headingKey)
      }
      for (const link of group.links) {
        if (!merged.links.some((l) => l.url === link.url)) merged.links.push(link)
      }
    }
  }

  return order.map((k) => byHeading.get(k)!)
}
