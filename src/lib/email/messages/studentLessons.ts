import {
  button,
  greeting,
  note,
  p,
  planTable,
  renderEmail,
  signOff,
  siteUrl,
} from '@/lib/email/shell'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'
import { STUDENT_PLANS, TRIAL_PRICE, monthlyTotal } from '@/lib/studentPricing'

/**
 * Email 2 of the student journey, one day after signup.
 *
 * This is the one that asks for something, so it earns the gold button that
 * the welcome email deliberately didn't have. Every figure comes from
 * src/lib/studentPricing.ts, so a price rise reaches the email without anyone
 * having to remember it.
 *
 * The trial is paid, not free. It is a real Stripe charge
 * (STRIPE_TRIAL_PRICE_ID) and the T&Cs make it non-refundable, so it must
 * never be described as free in an email.
 */

/** Only the sales line is written here — the numbers come from the plans. */
const BLURBS: Record<string, string> = {
  Standard: 'ideal if you want flexibility',
  Advanced: 'steady, consistent progress',
  Pro: 'best if you are working to a deadline',
}

export function buildStudentLessons(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Yesterday was just a hello. Today, the practical bit — what lessons actually look like, and what they cost, so you're not hunting around the site for it.`)}
    ${p(`Every lesson is 50 minutes, one to one, online over Google Meet. I write the plan around you rather than working through a course book, materials are included, and you can email me between lessons if something comes up.`)}
    ${note(`<strong style="color:#1F3A34;">The easiest place to start is a trial.</strong> It's 20 minutes for $${TRIAL_PRICE} — we talk through what you're aiming for, I get a sense of where you're at, and you find out whether you actually like learning with me. No commitment either way, and it's one per account so there's nothing to think about.`)}
    ${button(`${site}/#pricing`, 'Book a trial lesson')}
    ${p(`If you'd rather go straight to regular lessons, the monthly plans are:`)}
    ${planTable(
      STUDENT_PLANS.map((plan) => ({
        name: plan.name,
        price: `$${monthlyTotal(plan)}`,
        per: 'per month',
        detail: `${plan.lessons} lessons a month · $${plan.price} per lesson · ${BLURBS[plan.name] ?? plan.description}`,
        featured: plan.featured,
      }))
    )}
    ${p(`Every plan includes personalised lesson plans, progress tracking, materials, priority scheduling and email support between lessons — the more lessons you take, the less each one costs. You can cancel any time from your dashboard, and you'll keep the lessons you've already paid for until the end of the billing period.`)}
    ${p(`Not ready yet? That's completely fine — nothing here expires, and I'll keep sending you useful things either way.`)}
    ${signOff()}`

  return {
    subject: `How lessons work (and what they cost)`,
    html: renderEmail({
      eyebrow: 'Lessons',
      headline: `What learning with me looks like`,
      preheader: `50 minutes, one to one, built around your goals. Plus the plans, and where to start.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
