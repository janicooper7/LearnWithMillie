// Maps a Stripe recurring price back to the plan the student picked, so the
// dashboard can name it. The prices themselves are the source of truth for the
// amount charged — only the label and lesson count live here.
const SUBSCRIPTION_PLANS: Record<string, { name: string; lessons: number }> = {
  [process.env.STRIPE_FOURLESSONS_PRICE_ID!]: { name: 'Standard', lessons: 4 },
  [process.env.STRIPE_EIGHTLESSONS_PRICE_ID!]: { name: 'Advanced', lessons: 8 },
  [process.env.STRIPE_TWELVELESSONS_PRICE_ID!]: { name: 'Pro', lessons: 12 },
}

export function subscriptionPlan(priceId?: string | null) {
  if (!priceId) return null
  return SUBSCRIPTION_PLANS[priceId] ?? null
}
