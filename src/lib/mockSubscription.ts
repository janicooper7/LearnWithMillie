export type MockSubscription = {
  cancel_at_period_end: boolean
  current_period_end: number
  start_date: number
  items: { data: { price: { id: string; unit_amount: number; currency: string } }[] }
}

const DAY = 24 * 60 * 60 * 1000

// Amounts mirror the cards in UpgradePlanModal: price-per-lesson × lessons.
const PLANS: Record<string, { priceEnv: string; amount: number }> = {
  four: { priceEnv: 'STRIPE_FOURLESSONS_PRICE_ID', amount: 40 * 4 * 100 },
  eight: { priceEnv: 'STRIPE_EIGHTLESSONS_PRICE_ID', amount: 38 * 8 * 100 },
  twelve: { priceEnv: 'STRIPE_TWELVELESSONS_PRICE_ID', amount: 35 * 12 * 100 },
}

/**
 * Local-only stand-in for a Stripe subscription, so the dashboard's
 * subscription card can be worked on without a real recurring charge — the
 * Stripe key on this project is live, so there is no free way to make one.
 * Never returns anything unless MOCK_SUBSCRIPTION is set and we're off production.
 *
 *   MOCK_SUBSCRIPTION=four|eight|twelve   which plan to pretend the student is on
 *   MOCK_SUBSCRIPTION_CANCELLING=1        preview the "Cancelling / Access until" state
 */
export function mockSubscriptionEnabled(): boolean {
  const value = process.env.MOCK_SUBSCRIPTION
  return process.env.NODE_ENV !== 'production' && !!value && value !== '0'
}

export function getMockSubscription(now: Date = new Date()): MockSubscription {
  const plan = PLANS[process.env.MOCK_SUBSCRIPTION ?? ''] ?? PLANS.eight

  return {
    cancel_at_period_end: process.env.MOCK_SUBSCRIPTION_CANCELLING === '1',
    // Mid-cycle: signed up seven weeks ago, renews in a fortnight.
    start_date: Math.floor((now.getTime() - 47 * DAY) / 1000),
    current_period_end: Math.floor((now.getTime() + 13 * DAY) / 1000),
    items: {
      data: [
        {
          price: {
            // The real price id, so subscriptionPlan() resolves the plan name
            // through exactly the same lookup a live subscription goes through.
            id: process.env[plan.priceEnv] ?? '',
            unit_amount: plan.amount,
            currency: 'usd',
          },
        },
      ],
    },
  }
}
