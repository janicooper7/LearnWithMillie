import {
  button,
  discountCode,
  greeting,
  note,
  p,
  planTable,
  renderEmail,
  signOff,
  siteUrl,
} from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 1 for people who joined the list on /teachers/mentorship.
 *
 * The argument, rather than the feature list: the courses cover everything
 * that generalises, so the only thing left worth paying for by the hour is the
 * half that doesn't — your rates, your student, your profile. Said plainly
 * because it is also the honest case against booking a session, and a teacher
 * whose problem *is* general is better served by a $49 course than by 50
 * minutes.
 *
 * Prices and session length mirror MentorshipPricing.tsx; the five things
 * teachers bring are the pillars in MentorshipProgram.tsx.
 */
export function buildMentorshipFollowUp(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()
  const href = `${site}/teachers/mentorship`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`You were reading about the mentorship a couple of days ago. Here's the part the page doesn't quite say, because it's an odd thing to put on your own sales page.`)}
    ${p(`Most of what stops a teacher is general. How to structure a lesson, what to charge, how to be found, how to get someone to stay past week three. That's general enough to be written down once and watched at midnight in your pyjamas &mdash; which is exactly what the courses are for, and why they cost $49 rather than $50 an hour.`)}
    ${p(`But some of it isn't general at all. It's <em>my rates were fine at $18 and the enquiries stopped the week I moved to $25.</em> Or <em>this student has been with me four months and I have genuinely run out of things to do with him.</em> Or <em>my profile gets views and no bookings and I've read it so many times I can't see it any more.</em> No course answers those, because the answer depends on your profile, your student, and the market you're actually teaching into.`)}
    ${p(`That's what a session is for. <strong style="color:#1F3A34;">50 minutes, one to one, live with me</strong> &mdash; you bring the thing that's actually in the way and we work on that, not on the syllabus. In practice it's usually one of five: a lesson that won't hold together, a student you've stopped knowing how to help, the tech and platforms, building an audience that turns into bookings, or how to give feedback that changes anything. Come with a half-formed version of the problem; that's normal, and sorting out which problem it really is tends to be the first twenty minutes.`)}
    ${planTable([
      {
        name: 'Single',
        price: '$50',
        per: 'one session',
        detail: 'One 50-minute session. Enough to unstick one specific thing.',
        featured: false,
      },
      {
        name: 'Double',
        price: '$95',
        per: 'two sessions',
        detail: 'A session, then a second one once you have tried the thing we decided on. Most people pick this.',
        featured: true,
      },
      {
        name: 'Triple',
        price: '$140',
        per: 'three sessions',
        detail: 'Room to work on something properly rather than fix one problem.',
        featured: false,
      },
    ])}
    ${note(`Paid once, no subscription, nothing to cancel. Sessions are yours to book when you want them &mdash; they don't expire at the end of a month.`)}
    ${p(`And your welcome code works on these:`)}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `${SIGNUP_OFFER_LABEL} your first order, typed into the promo box at checkout. On the three-session package that's about $14 back. It doesn't expire, but it only comes off once.`,
    })}
    ${button(href, 'See the mentorship packages')}
    ${p(`If you're not sure a session is even the right thing, reply to this and tell me where you're stuck. Sometimes the honest answer is that $49 of GET READY will do more for you than 50 minutes with me, and I'd rather say so than take the booking.`)}
    ${signOff()}`

  return {
    subject: `A course can't see your profile`,
    html: renderEmail({
      eyebrow: 'Mentorship',
      headline: `The half a course can't cover`,
      preheader: `50 minutes, one to one, on your actual rates, your actual student, your actual profile. From $50 — ${SIGNUP_OFFER.percentOff}% off with ${SIGNUP_OFFER.code}.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
