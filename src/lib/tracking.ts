// Shared vocabulary for the first-party analytics used by the admin report.
// Imported by the client tracker, the /api/track route and the report page, so
// funnel names and step order are defined exactly once.

export const CHANNELS = [
  'direct',
  'organic',
  'paid_social',
  'paid_search',
  'referral',
  'email',
  'other',
] as const

export type Channel = (typeof CHANNELS)[number]

export const CHANNEL_LABELS: Record<Channel, string> = {
  direct: 'Direct',
  organic: 'Organic search',
  paid_social: 'Paid social',
  paid_search: 'Paid search',
  referral: 'Referral',
  email: 'Email',
  other: 'Other',
}

/**
 * Funnels tracked across the site. `steps` are in order — the report reads
 * drop-off by walking this list, so the order here IS the funnel definition.
 */
export const FUNNELS = {
  courses: {
    label: 'Courses (BOOKED trilogy)',
    steps: [
      { key: 'landed', label: 'Landed on courses page' },
      { key: 'enrol_click', label: 'Clicked enrol' },
      { key: 'checkout_start', label: 'Reached Stripe checkout' },
      { key: 'purchased', label: 'Purchased' },
    ],
  },
  'platform-finder': {
    label: 'Platform Finder',
    steps: [
      { key: 'landed', label: 'Landed on finder' },
      { key: 'quiz_start', label: 'Started the quiz' },
      { key: 'quiz_complete', label: 'Finished all questions' },
      { key: 'checkout_start', label: 'Reached Stripe checkout' },
      { key: 'purchased', label: 'Purchased' },
    ],
  },
  lessons: {
    label: '1:1 lessons & trial',
    steps: [
      { key: 'landed', label: 'Landed on students page' },
      { key: 'checkout_start', label: 'Reached Stripe checkout' },
      { key: 'purchased', label: 'Purchased' },
    ],
  },
  debate: {
    label: 'Debate Generator',
    steps: [
      { key: 'landed', label: 'Landed on generator' },
      { key: 'checkout_start', label: 'Reached Stripe checkout' },
      { key: 'purchased', label: 'Purchased' },
    ],
  },
} as const

export type FunnelKey = keyof typeof FUNNELS

export const FUNNEL_KEYS = Object.keys(FUNNELS) as FunnelKey[]

/** Which funnel (if any) a path belongs to, for automatic 'landed' events. */
export function funnelForPath(path: string): FunnelKey | null {
  if (path.startsWith('/teachers/platform-finder')) return 'platform-finder'
  if (path.startsWith('/teachers/debategenerator')) return 'debate'
  if (path.startsWith('/teachers/courses')) return 'courses'
  if (path.startsWith('/students')) return 'lessons'
  return null
}

const SEARCH_ENGINES = ['google.', 'bing.', 'duckduckgo.', 'yahoo.', 'ecosia.', 'brave.']
const SOCIAL_HOSTS = [
  'facebook.',
  'instagram.',
  'tiktok.',
  'youtube.',
  'linkedin.',
  'pinterest.',
  't.co',
  'twitter.',
  'x.com',
  'reddit.',
]

/**
 * Bucket a visit into a channel from its UTM tags and referrer.
 *
 * Paid beats organic: a `utm_medium` of cpc/paid_* wins even when the referrer
 * is a search engine, because that's exactly what a Google/Meta ad click looks
 * like. Everything runs on lowercased input since GA-style tags are famously
 * inconsistent about case.
 */
export function deriveChannel(opts: {
  source?: string | null
  medium?: string | null
  referrer?: string | null
  hasClickId?: boolean
}): Channel {
  const source = opts.source?.toLowerCase().trim() ?? ''
  const medium = opts.medium?.toLowerCase().trim() ?? ''
  const referrer = opts.referrer?.toLowerCase().trim() ?? ''

  const isPaidMedium =
    medium.includes('cpc') ||
    medium.includes('ppc') ||
    medium.startsWith('paid') ||
    medium === 'retargeting'

  if (isPaidMedium || opts.hasClickId) {
    const socialSource = SOCIAL_HOSTS.some((h) => source.includes(h.replace('.', '')))
    if (medium.includes('social') || socialSource) return 'paid_social'
    return 'paid_search'
  }

  if (medium === 'email' || source === 'newsletter' || source === 'email') return 'email'

  // Tagged but not paid — trust the tag over the referrer.
  if (medium === 'organic') return 'organic'
  if (source || medium) return 'referral'

  if (!referrer) return 'direct'
  if (SEARCH_ENGINES.some((e) => referrer.includes(e))) return 'organic'
  if (SOCIAL_HOSTS.some((h) => referrer.includes(h))) return 'referral'
  return 'referral'
}
