import {
  button,
  discountCode,
  greeting,
  note,
  p,
  renderEmail,
  signOff,
  siteUrl,
} from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 1 for people who joined the list on /teachers/platform-finder.
 *
 * The welcome email already listed the finder as one of five things. This one
 * does the opposite: a single product, the problem it solves, the price, and
 * the code. Somebody who gave their address on that page was reading about
 * that product, and the follow-up they are owed is a better version of the
 * page, not another menu.
 *
 * Numbers mirror PlatformFinder.tsx — 33 platforms, seven questions, $5 once.
 */
export function buildPlatformFinderFollowUp(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()
  const href = `${site}/teachers/platform-finder`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`You were on the Platform Finder page a couple of days ago, so let me tell you the thing that page is too polite to say plainly.`)}
    ${p(`There are <strong style="color:#1F3A34;">33 major platforms</strong> hiring online English teachers right now, and <strong style="color:#1F3A34;">most of them will never hire you</strong>. Not because of your teaching. Because of your passport, or the degree you don't have, or the timezone you're in, or the fact that they only take teachers who can cover 6am in Beijing. Every platform has its own rules and almost none of them put those rules anywhere you can find before you apply.`)}
    ${p(`So the usual way this goes is: you find a list of platforms on a blog, you apply to eight of them, you record a demo video, you wait, and three weeks later you have two rejections, five silences, and one offer paying $9 an hour. That's not bad luck. That's what applying without knowing the requirements looks like.`)}
    ${p(`The Platform Finder is the shortcut past all of it. Seven questions about your nationality, qualifications, availability and setup &mdash; about a minute &mdash; and you get back a report of every platform that will <em>actually</em> take someone with your profile, <strong style="color:#1F3A34;">ranked by what they pay</strong>, with the exact requirements and a direct sign-up link for each one. It's emailed to you, and it's yours to keep.`)}
    ${note(`<strong style="color:#1F3A34;">It costs $5, once.</strong> No subscription, nothing to cancel. That's less than one hour of the pay you're losing to the wrong platform, and about two weeks less applying.`)}
    ${p(`And because you're on my list, it's ${SIGNUP_OFFER_LABEL}:`)}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `Type it into the promo box at Stripe's checkout. Worth knowing: it's a first-order code, so it only comes off once &mdash; if the teacher courses are also on your list, it's worth more spent there than on a $5 report.`,
    })}
    ${button(href, 'Find my platforms')}
    ${p(`If you'd rather just ask me whether it's worth it for your situation, reply to this email and tell me your nationality and whether you have a degree. I'll tell you honestly &mdash; sometimes the answer is that you already qualify for the good ones and don't need the report.`)}
    ${signOff()}`

  return {
    subject: `Most of the 33 platforms will never hire you`,
    html: renderEmail({
      eyebrow: 'Platform Finder',
      headline: `Stop applying to platforms that were never going to say yes`,
      preheader: `Seven questions, a ranked shortlist of who will actually hire you, and $5 once — ${SIGNUP_OFFER.code} takes ${SIGNUP_OFFER.percentOff}% off.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
