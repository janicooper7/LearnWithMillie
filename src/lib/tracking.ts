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

// Areas that aren't marketing traffic: Millie's own admin tooling, the auth
// screens, and the two signed-in customer areas. Counting those as "visitors"
// would mean her own working sessions showed up as demand.
const UNTRACKED_PREFIXES = ['/admin', '/auth', '/dashboard', '/learn', '/api']

/** Whether a path counts towards site traffic at all. */
export function isTrackablePath(path: string): boolean {
  return !UNTRACKED_PREFIXES.some((prefix) => path.startsWith(prefix))
}

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

// What ad platforms actually put in utm_source. Meta's own URL builder writes
// `ig` and `fb`, which match none of the hostnames above — without these, a
// Meta ad tagged `utm_medium=paid` lands in paid search instead of paid social.
const SOCIAL_SOURCE_ALIASES = [
  'ig',
  'fb',
  'meta',
  'insta',
  'instagram',
  'facebook',
  'messenger',
  'tiktok',
  'tt',
  'yt',
  'youtube',
  'linkedin',
  'li',
  'pinterest',
  'reddit',
  'twitter',
  'x',
]

/**
 * Whether a utm_source names a social platform. Aliases match exactly (`ig` must
 * not match `bigcommerce`); hostnames match by containment so `facebook.com` and
 * `m.facebook.com` both count.
 */
function isSocialSource(source: string): boolean {
  if (!source) return false
  if (SOCIAL_SOURCE_ALIASES.includes(source)) return true
  return SOCIAL_HOSTS.some((host) => source.includes(host.replace(/\.$/, '')))
}

/**
 * Hosts that are part of our own checkout, not somewhere a visitor came from.
 * A person bouncing back from Stripe is the same visit continuing, so treating
 * that referrer as a traffic source would invent a "referral" channel that
 * earned nothing and quietly steal credit from whatever really brought them.
 */
const SELF_REFERRAL_HOSTS = [
  'checkout.stripe.com',
  'pay.stripe.com',
  'js.stripe.com',
  'billing.stripe.com',
]

/** Whether a referring host is really our own payment flow. */
export function isSelfReferralHost(host: string): boolean {
  const clean = host.toLowerCase().trim()
  return SELF_REFERRAL_HOSTS.includes(clean)
}

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
    if (medium.includes('social') || isSocialSource(source)) return 'paid_social'
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
