import { STUDENT_PLANS, monthlyTotal } from '@/lib/studentPricing'

export type MockSubscription = {
  status: string
  cancel_at_period_end: boolean
  current_period_end: number
  start_date: number
  items: { data: { price: { id: string; unit_amount: number; currency: string } }[] }
}

const DAY = 24 * 60 * 60 * 1000

// Amounts come from the real plans, in cents, so the mocked card can't show a
// figure the pricing page has moved past.
const PRICE_ENV: Record<string, string> = {
  four: 'STRIPE_FOURLESSONS_PRICE_ID',
  eight: 'STRIPE_EIGHTLESSONS_PRICE_ID',
  twelve: 'STRIPE_TWELVELESSONS_PRICE_ID',
}

const PLANS: Record<string, { priceEnv: string; amount: number }> = Object.fromEntries(
  STUDENT_PLANS.map((plan) => [
    plan.planKey,
    { priceEnv: PRICE_ENV[plan.planKey], amount: monthlyTotal(plan) * 100 },
  ])
)

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
    // A subscription set to cancel at period end is still 'active' to Stripe.
    status: 'active',
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
