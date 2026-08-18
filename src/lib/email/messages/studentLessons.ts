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

/**
 * Email 2 of the student journey, one day after signup.
 *
 * This is the one that asks for something, so it earns the gold button that
 * the welcome email deliberately didn't have. Prices are duplicated from
 * src/app/sections/Pricing.tsx — if the plans change there, change them here.
 *
 * The trial is $20 for 20 minutes, not free. It is a real Stripe charge
 * (STRIPE_TRIAL_PRICE_ID) and the T&Cs make it non-refundable, so it must
 * never be described as free in an email.
 */
/**
 * Mirrors the `plans` array in src/app/sections/Pricing.tsx. The monthly total
 * is derived rather than typed out so the email can never quote a total that
 * doesn't match the per-lesson rate it shows beside it.
 */
const PLANS = [
  { name: 'Standard', perLesson: 40, lessons: 4, blurb: 'ideal if you want flexibility', featured: false },
  { name: 'Advanced', perLesson: 38, lessons: 8, blurb: 'steady, consistent progress', featured: true },
  { name: 'Pro', perLesson: 35, lessons: 12, blurb: 'best if you are working to a deadline', featured: false },
]

export function buildStudentLessons(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Yesterday was just a hello. Today, the practical bit — what lessons actually look like, and what they cost, so you're not hunting around the site for it.`)}
    ${p(`Every lesson is 50 minutes, one to one, online over Google Meet. I write the plan around you rather than working through a course book, materials are included, and you can email me between lessons if something comes up.`)}
    ${note(`<strong style="color:#1F3A34;">The easiest place to start is a trial.</strong> It's 20 minutes for $20 — we talk through what you're aiming for, I get a sense of where you're at, and you find out whether you actually like learning with me. No commitment either way, and it's one per account so there's nothing to think about.`)}
    ${button(`${site}/#pricing`, 'Book a trial lesson')}
    ${p(`If you'd rather go straight to regular lessons, the monthly plans are:`)}
    ${planTable(
      PLANS.map((plan) => ({
        name: plan.name,
        price: `$${plan.perLesson * plan.lessons}`,
        per: 'per month',
        detail: `${plan.lessons} lessons a month · $${plan.perLesson} per lesson · ${plan.blurb}`,
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
