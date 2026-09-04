import {
  button,
  discountCode,
  greeting,
  note,
  p,
  productCard,
  renderEmail,
  signOff,
  siteUrl,
} from '@/lib/email/shell'
import { SIGNUP_OFFER, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * Follow-up 1 for people who joined the list on /teachers/courses (or on one of
 * the course pages under it).
 *
 * The argument, rather than the feature list: there isn't one problem with
 * teaching online, there are three, and they arrive in a fixed order. That is
 * the whole reason the trilogy is three courses and not one, so it is the thing
 * worth saying to somebody who read the page and didn't buy.
 *
 * Prices and module counts mirror courseSalesContent.ts and the course pages.
 * Claims are kept to what those pages actually say — the refund line and the
 * early-bird deadline in `bundleSales` are not rendered on the site, so they
 * are deliberately not promised here either.
 */
export function buildCoursesFollowUp(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()
  const href = `${site}/teachers/courses`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`You were looking at the courses a couple of days ago. Here's the thinking behind them, which the sales page doesn't really have room for.`)}
    ${p(`Most courses about teaching online solve one problem. The trouble is there isn't one problem &mdash; there are three, and they turn up in a fixed order. Getting set up. Getting students. Keeping them. Each one is only solvable once you've handled the one before it, which is why teachers who skip straight to marketing end up with a full calendar of trials that don't convert, and teachers who never market end up with a beautiful profile nobody sees.`)}
    ${p(`So BOOKED is three courses, in that order. <strong style="color:#1F3A34;">35 modules</strong> in total, one-time payment, lifetime access, learn at whatever pace your week allows.`)}
    ${productCard({
      title: '1. GET READY',
      price: '$49',
      blurb:
        '11 modules. From "thinking about it" to live and accepted — TEFL or no TEFL, tech that does not cost a fortune, rates set with confidence, a profile that converts, an intro video that books, and where your first five students actually come from.',
      href: `${site}/teachers/courses/get-ready`,
      cta: 'See GET READY',
    })}
    ${productCard({
      title: '2. GET BOOKED',
      price: '$79',
      blurb:
        '12 modules. The marketing engine — the ten types of student and how each one decides, the LMNOP method, and the scripts and templates that turn a live profile into a calendar full of trials that convert.',
      href: `${site}/teachers/courses/get-booked`,
      cta: 'See GET BOOKED',
    })}
    ${productCard({
      title: '3. STAY BOOKED',
      price: '$59',
      blurb:
        'The deepest of the three. 12 modules built around the SCALE framework — how you keep students for months instead of weeks, and turn "someone who tutors online" into recurring income you can plan a life around.',
      href: `${site}/teachers/courses/stay-booked`,
      cta: 'See STAY BOOKED',
    })}
    ${note(`Separately that's $187. <strong style="color:#1F3A34;">All three together is $149</strong> &mdash; you save $38, and you get the handovers between them, which are the part that's designed.`)}
    ${p(`And your welcome code still works on it:`)}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `${SIGNUP_OFFER_LABEL} your first order, typed into the promo box at checkout. On the $149 trilogy that's about $15 back. It doesn't expire, but it only comes off once &mdash; so it's worth spending here rather than on one of the small tools.`,
    })}
    ${button(href, 'Look at the courses')}
    ${p(`If you're not sure which one you're actually at, reply and tell me where you're stuck &mdash; no students yet, students but no bookings, or bookings that don't come back. I'll tell you which course that is, or tell you that you don't need one.`)}
    ${signOff()}`

  return {
    subject: `There isn't one problem with teaching online — there are three`,
    html: renderEmail({
      eyebrow: 'The BOOKED trilogy',
      headline: `Three problems, in this order`,
      preheader: `Get set up, get students, keep them. $49, $79 and $59 — or $149 for all three, minus ${SIGNUP_OFFER.percentOff}% with ${SIGNUP_OFFER.code}.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
