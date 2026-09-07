// Single source of truth for what a student pays.
//
// These numbers used to be retyped in the pricing section, the upgrade modal,
// the top-up banner and two journey emails, which meant a price rise had to be
// remembered in five places and the emails quietly drifted out of date. Import
// from here instead of writing a figure into copy.
//
// The amounts here are display copy only — Stripe is what actually charges, and
// the amount lives on the Price object behind each `STRIPE_*_PRICE_ID`. Change
// one of these and the matching Stripe price has to change with it, or the site
// will advertise a number the checkout doesn't honour.

export type StudentPlan = {
  name: string
  /** Price per lesson, in whole dollars. */
  price: number
  lessons: number
  description: string
  featured: boolean
  /** The `plan` value POSTed to /api/checkout. */
  planKey: string
}

/** The monthly subscriptions, in display order. */
export const STUDENT_PLANS: StudentPlan[] = [
  {
    name: 'Standard',
    price: 50,
    lessons: 4,
    description: 'Ideal for flexible learning',
    featured: false,
    planKey: 'four',
  },
  {
    name: 'Advanced',
    price: 48,
    lessons: 8,
    description: 'Perfect for steady progress',
    featured: true,
    planKey: 'eight',
  },
  {
    name: 'Pro',
    price: 45,
    lessons: 12,
    description: 'Best for intensive learning',
    featured: false,
    planKey: 'twelve',
  },
]

/** The 20-minute introductory lesson. Paid, one per account, non-refundable. */
export const TRIAL_PRICE = 25

/**
 * A single lesson bought outside a subscription, via the dashboard top-up
 * banner. Deliberately held at $40 through the 2026 price rise, so it now sits
 * below every per-lesson subscription rate: the banner is only shown to people
 * who already subscribe and have run out mid-month, not as an alternative to
 * subscribing. Don't quote it beside the plans as if it were one.
 */
export const ADDON_LESSON_PRICE = 40

/** What every plan includes, whatever the tier. */
export const STUDENT_PLAN_FEATURES = [
  'Personalised lesson plans',
  'Progress tracking',
  'Learning materials included',
  'Priority scheduling',
  'Email support between lessons',
]

/** Monthly total for a plan — never typed out, so it can't contradict the rate. */
export const monthlyTotal = (plan: StudentPlan) => plan.price * plan.lessons

/** The cheapest month across the plans, for "from $x" copy. */
export const cheapestMonthlyTotal = Math.min(...STUDENT_PLANS.map(monthlyTotal))
