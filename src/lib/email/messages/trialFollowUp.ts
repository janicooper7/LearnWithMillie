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
import { STUDENT_PLANS, monthlyTotal } from '@/lib/studentPricing'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * The email that goes out a few hours after a student sits their trial lesson.
 *
 * The one moment in the whole funnel where the reader has actually met Millie,
 * so it is written as the end of that conversation rather than as a mailshot —
 * the warmth is the point, and the plans are the answer to the question the
 * trial has just raised ("do I carry on, and how?").
 *
 * Deliberately vague about what happened *in* the lesson: nothing in the
 * database records it, and a warm email that invents a detail the student
 * doesn't recognise is worse than one that doesn't try. What it can say
 * truthfully is what a trial is for and what changes if they continue.
 *
 * No time-of-day wording either ("this morning", "today"). The send is pinned
 * to the lesson's end, and a lesson late in the evening lands the email the
 * next day — see scheduleTrialFollowUp.
 */

/** One line per plan, in the voice the pricing section uses. */
const BLURBS: Record<string, string> = {
  Standard: 'roughly one lesson a week',
  Advanced: 'two a week — where most people settle',
  Pro: 'best if you are working to a deadline',
}

export function buildTrialFollowUp(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`It was lovely to meet you &mdash; thank you for that. I really enjoyed it, and I came away with a much clearer sense of what I'd want to do with you next than any placement test would have given me.`)}
    ${p(`That's the honest point of a trial. Twenty minutes isn't enough to teach anybody very much; it's enough for you to find out whether you like learning with me, and for me to hear where you actually are rather than where a level on a form says you are. If it felt right, here's what carrying on looks like.`)}
    ${p(`Proper lessons are <strong style="color:#1F3A34;">50 minutes, one to one, online over Google Meet</strong>. I write each plan around you between lessons rather than working through a course book, materials are included, and you can email me in between when something comes up at work or you get stuck on something.`)}
    ${p(`The plans are monthly, and the more lessons you take the less each one costs:`)}
    ${planTable(
      STUDENT_PLANS.map((plan) => ({
        name: plan.name,
        price: `$${monthlyTotal(plan)}`,
        per: 'per month',
        detail: `${plan.lessons} lessons a month · $${plan.price} per lesson · ${BLURBS[plan.name] ?? plan.description}`,
        featured: plan.featured,
      }))
    )}
    ${note(`Every plan includes personalised lesson plans, progress tracking, learning materials, priority scheduling and email support between lessons. Lessons land in your dashboard as credits and you book the times that suit you &mdash; you're not committing to a fixed slot every week.`)}
    ${button(`${site}/#pricing`, 'Pick a plan')}
    ${p(`You can cancel any time from your dashboard, and you keep every lesson you've already paid for until the end of the billing period. Nothing here traps you.`)}
    ${p(`If you're not sure which one to pick, just reply to this and tell me what you're aiming for and how much time you realistically have in a week &mdash; I'd rather put you on the right plan than the big one. And if the trial told you this isn't for you, that's a completely fine outcome and worth knowing after twenty minutes rather than after a month. Either way, it was good to meet you.`)}
    ${signOff()}`

  return {
    subject: `Lovely to meet you — here's where to go next`,
    html: renderEmail({
      eyebrow: 'Your trial lesson',
      headline: `It was lovely to meet you`,
      preheader: `Thank you for the trial. Here's what regular lessons look like, and the plans, if you'd like to carry on.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
