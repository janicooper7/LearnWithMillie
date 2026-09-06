import { discountCode, greeting, p, renderEmail, signOff, siteUrl, softLink } from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 2, and the last thing this track sends about the mentorship.
 *
 * The objection it answers is not the price — it's "I wouldn't know what to
 * ask", which is what actually stops people booking time with a person rather
 * than buying a video. So it argues for the smallest yes, the single $50
 * session, and does not re-pitch the packages: the reader has had that email
 * and a second copy of it would only be noise.
 */
export function buildMentorshipLastCall(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()
  const href = `${site}/teachers/mentorship`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Last one about the mentorship, then I'll leave it.`)}
    ${p(`When someone reads that page and doesn't book, the reason usually isn't the $50. It's <em>I wouldn't know what to ask her.</em>`)}
    ${p(`You don't need a list of questions. Bring the thing you keep putting off &mdash; the rate you know is too low, the student you dread on a Tuesday, the profile you've rewritten four times, the intro video you still haven't recorded. That's the session. Working out which of those is actually the problem is usually the first twenty minutes of it, and it's the part you can't do on your own, because from the inside they all look equally urgent.`)}
    ${p(`<strong style="color:#1F3A34;">So start with one.</strong> $50, a single 50-minute session, paid once. If it's worth doing again there's a two for $95 and a three for $140, but there's no reason at all to decide that now.`)}
    ${softLink(href, 'Book a single session — $50')}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `${SIGNUP_OFFER_LABEL} your first order, in the promo box at checkout. It doesn't expire.`,
    })}
    ${p(`And if what you actually need is the ground covered properly from the start rather than an hour on one problem, that's the courses, and I'd rather you spent the money there &mdash; <a href="${site}/teachers/courses/get-ready" style="color:#1F3A34;font-weight:600;">GET READY is $49</a>. The free lesson plans are at <a href="${site}/teacher-materials" style="color:#1F3A34;font-weight:600;">learnwithmillie.com/teacher-materials</a> either way, and I'll still be here when the timing's better.`)}
    ${signOff()}`

  return {
    subject: `"I wouldn't know what to ask you"`,
    html: renderEmail({
      eyebrow: 'Mentorship',
      headline: `Bring the thing you keep avoiding`,
      preheader: `You don't need a list of questions. One 50-minute session is $50, paid once.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
