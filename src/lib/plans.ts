// Maps a Stripe recurring price back to the plan the student picked, so the
// dashboard can name it. The prices themselves are the source of truth for the
// amount charged — only the label and lesson count live here.
//
// Retired prices have to stay in the map. A Stripe price is immutable, so a
// price rise means a brand new price id in STRIPE_*_PRICE_ID, while everyone
// who subscribed before it stays billed on the old id until they are migrated.
// Drop the old id and their dashboard forgets which plan they are on. Each
// STRIPE_*_LEGACY_PRICE_IDS var takes a comma-separated list of retired ids for
// that tier; leave it unset until a tier has actually been repriced.
type Plan = { name: string; lessons: number }

const TIERS: { current?: string; legacy?: string; plan: Plan }[] = [
  {
    current: process.env.STRIPE_FOURLESSONS_PRICE_ID,
    legacy: process.env.STRIPE_FOURLESSONS_LEGACY_PRICE_IDS,
    plan: { name: 'Standard', lessons: 4 },
  },
  {
    current: process.env.STRIPE_EIGHTLESSONS_PRICE_ID,
    legacy: process.env.STRIPE_EIGHTLESSONS_LEGACY_PRICE_IDS,
    plan: { name: 'Advanced', lessons: 8 },
  },
  {
    current: process.env.STRIPE_TWELVELESSONS_PRICE_ID,
    legacy: process.env.STRIPE_TWELVELESSONS_LEGACY_PRICE_IDS,
    plan: { name: 'Pro', lessons: 12 },
  },
]

const SUBSCRIPTION_PLANS: Record<string, Plan> = {}
for (const tier of TIERS) {
  const ids = [tier.current, ...(tier.legacy?.split(',') ?? [])]
  for (const id of ids) {
    const trimmed = id?.trim()
    if (trimmed) SUBSCRIPTION_PLANS[trimmed] = tier.plan
  }
}

export function subscriptionPlan(priceId?: string | null) {
  if (!priceId) return null
  return SUBSCRIPTION_PLANS[priceId] ?? null
}

/**
 * Monthly lesson allowance for a subscription price, or 0 if the id isn't one
 * of ours. The Stripe webhook resets `allowance` from this on every renewal, so
 * a price id missing here means a paying subscriber silently stops being
 * credited their lessons — which is why retired ids must stay in the map.
 */
export function subscriptionLessons(priceId?: string | null) {
  return subscriptionPlan(priceId)?.lessons ?? 0
}
