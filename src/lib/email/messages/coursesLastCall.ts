import { discountCode, greeting, p, renderEmail, signOff, siteUrl, softLink } from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 2, and the last thing this track sends about the courses.
 *
 * Answers the objection the $149 bundle actually raises — that it is a lot to
 * commit to a stranger on the internet — by pointing at the $49 entry instead
 * of arguing for the bundle again. A smaller yes beats a repeated pitch, and
 * the bundle page is still one click away for anyone who was already there.
 */
export function buildCoursesLastCall(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Last one about the courses, then I'll stop.`)}
    ${p(`If $149 feels like a lot to hand to someone you've only read a page about &mdash; fair. It is. So don't start there.`)}
    ${p(`<strong style="color:#1F3A34;">GET READY is $49 on its own.</strong> Eleven modules, and by the end of it you have a profile that converts, an intro video worth sending, your rates set at a number you can say out loud, and a real answer to where the first five students come from. That's the whole first problem solved, and it's the one that stops most people before they start. If it's not what you hoped, you've spent $49 and you still have the profile.`)}
    ${softLink(`${site}/teachers/courses/get-ready`, 'Start with GET READY — $49')}
    ${p(`The other two are there when you need them, and the trilogy is still $149 if you'd rather have the lot:`)}
    ${softLink(`${site}/teachers/courses`, 'See all three')}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `${SIGNUP_OFFER_LABEL} your first order, in the promo box at checkout. It doesn't expire.`,
    })}
    ${p(`And if the honest answer is "not this year" &mdash; that's completely fine. The free lesson plans are at <a href="${site}/teacher-materials" style="color:#1F3A34;font-weight:600;">learnwithmillie.com/teacher-materials</a>, and I'll still be here when it is this year.`)}
    ${signOff()}`

  return {
    subject: `Don't start with the $149 one`,
    html: renderEmail({
      eyebrow: 'The BOOKED trilogy',
      headline: `Start with one, not three`,
      preheader: `GET READY is $49 on its own — the first problem solved, without committing to the trilogy.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
