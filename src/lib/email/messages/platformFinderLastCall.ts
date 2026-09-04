import { discountCode, greeting, p, renderEmail, signOff, siteUrl, softLink } from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 2, and the last thing this track sends about the Platform Finder.
 *
 * Deliberately short and built around the one objection that actually stops
 * this sale — "I could look this up myself" — because by now the reader has
 * had the full pitch and a second copy of it would only be noise. After this
 * they stay on the list and hear from Millie like everyone else.
 */
export function buildPlatformFinderLastCall(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()
  const href = `${site}/teachers/platform-finder`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Last one from me about the Platform Finder, and then I'll leave it.`)}
    ${p(`The honest objection to it is: <em>I could just look this up myself.</em> And you could. It's 33 platforms, one at a time, and the answer you need &mdash; will they hire someone with my nationality, without a degree, in my timezone &mdash; is usually not on the page. It's in a help-centre article from 2023, or a Reddit thread, or nowhere at all until you've applied and been told no. I know because building this is how I spent a fortnight.`)}
    ${p(`That fortnight is the product. Seven questions, under a minute, and you get back only the platforms that will take you, ranked by pay, with what each one requires and where to apply. <strong style="color:#1F3A34;">$5 once</strong>, no subscription, and it's emailed to you to keep.`)}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `${SIGNUP_OFFER_LABEL} your first order, in the promo box at checkout. It doesn't expire.`,
    })}
    ${softLink(href, 'Find my platforms')}
    ${p(`If it's not for you, that's genuinely fine &mdash; the free lesson plans are at <a href="${site}/teacher-materials" style="color:#1F3A34;font-weight:600;">learnwithmillie.com/teacher-materials</a> and you'll still hear from me now and then about what's actually working out there.`)}
    ${signOff()}`

  return {
    subject: `The bit you can't Google`,
    html: renderEmail({
      eyebrow: 'Platform Finder',
      headline: `You could look it up yourself`,
      preheader: `33 platforms, one at a time, and half the requirements aren't published. Or $5 and a minute.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
