import {
  discountCode,
  greeting,
  p,
  productCard,
  renderEmail,
  signOff,
  siteUrl,
  softLink,
} from '@/lib/email/shell'
import { INSTAGRAM_URL, SOCIAL_HANDLE, TIKTOK_URL } from '@/lib/email/copy'
import { SIGNUP_OFFER, SIGNUP_OFFER_HEADLINE, SIGNUP_OFFER_LABEL } from '@/lib/signupOffer'
import type { BuiltEmail, SubscriberContext } from '@/lib/email/types'

/**
 * The one email the signup popup promises: here is your code, here is what you
 * can spend it on.
 *
 * It goes out immediately rather than on a schedule, because the person is
 * still on the site waiting for it — a discount that arrives tomorrow is a
 * discount nobody uses. Everything else about them stays on the list for
 * whatever Millie broadcasts next.
 *
 * Teachers and students are sold entirely different things, so the middle of
 * this email is two separate emails; only the code and the sign-off are shared.
 * Prices mirror teacherProducts.ts and studentLessons.ts.
 */

function teacherBody(site: string): string {
  return `
    ${p(`You said you're a teacher, so here's what's on that side of the site &mdash; the code comes off whichever one you start with.`)}
    ${productCard({
      title: 'The course trilogy',
      price: '$149 for all three',
      blurb:
        'Setting up properly, filling your calendar with trials, and keeping the students who book. $49, $79 and $59 separately, or $149 together.',
      href: `${site}/teachers/courses`,
      cta: 'Browse the courses',
    })}
    ${productCard({
      title: 'Mentorship',
      price: 'From $50',
      blurb:
        'Fifty minutes, one to one with me. Bring whatever is actually in the way — your rates, a student you are stuck with, or where the next booking comes from.',
      href: `${site}/teachers/mentorship`,
      cta: 'Browse mentorship',
    })}
    ${productCard({
      title: 'Platform Finder',
      price: '$5',
      blurb:
        'Seven questions, then a ranked shortlist of which of 33 teaching platforms will actually hire someone with your nationality, qualifications and setup.',
      href: `${site}/teachers/platform-finder`,
      cta: 'Find your platform',
    })}
    ${productCard({
      title: 'Debate Generator',
      price: '$7 once',
      blurb:
        'Endless ESL debate topics with the key vocabulary already built out, ready to drop into a lesson. Good for the days when a student cancels and you have twenty minutes to fill. Lifetime access, no subscription.',
      href: `${site}/teachers/debategenerator`,
      cta: 'Try it',
    })}
    ${p(`And if you'd rather spend nothing at all today, the lesson plans are free and always will be:`)}
    ${softLink(`${site}/teacher-materials`, 'Grab the free lesson plans')}`
}

function studentBody(site: string): string {
  return `
    ${p(`You said you're learning English, so here's how that works &mdash; the code comes off whichever one you start with.`)}
    ${p(`Every lesson is 50 minutes, one to one, online. I write the plan around you rather than working through a course book, materials are included, and you can email me between lessons if something comes up.`)}
    ${productCard({
      title: 'A trial lesson',
      price: '$20',
      blurb:
        'Twenty minutes to talk through what you are aiming for and find out whether you like learning with me. One per account, no commitment either way.',
      href: `${site}/#pricing`,
      cta: 'Book a trial',
    })}
    ${productCard({
      title: 'Monthly lesson plans',
      price: 'From $140/month',
      blurb:
        'Four, eight or twelve lessons a month at $40, $38 or $35 each — the more you take, the less each one costs. Cancel any time from your dashboard.',
      href: `${site}/#pricing`,
      cta: 'See the plans',
    })}`
}

export function buildSubscriberWelcome(ctx: SubscriberContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Thank you for joining the family &mdash; I'm really glad you're here. As promised, here's your ${SIGNUP_OFFER_LABEL}:`)}
    ${discountCode({
      code: SIGNUP_OFFER.code,
      caption: `Type it into the promo box at checkout for ${SIGNUP_OFFER_HEADLINE}. It works on anything on the site, and there's no rush &mdash; it doesn't expire.`,
    })}
    ${ctx.audience === 'teacher' ? teacherBody(site) : studentBody(site)}
    ${p(`From here you'll hear from me now and then &mdash; what I'm building, what's actually working, and first access to anything new. Never more than you'd want, and one click gets you out at the bottom of every email.`)}
    ${p(`Come and find me on <a href="${TIKTOK_URL}" style="color:#1F3A34;font-weight:600;">TikTok</a> or <a href="${INSTAGRAM_URL}" style="color:#1F3A34;font-weight:600;">Instagram</a> too &mdash; I'm ${SOCIAL_HANDLE} on both, and I read every DM.`)}
    ${p(`If you have a question before you spend anything, just reply to this email. It comes straight to me.`)}
    ${signOff()}`

  return {
    subject: `Here's your ${SIGNUP_OFFER_LABEL} code`,
    html: renderEmail({
      eyebrow: 'Welcome',
      headline: `${SIGNUP_OFFER_LABEL}, as promised`,
      preheader: `Your code is ${SIGNUP_OFFER.code} — ${SIGNUP_OFFER_HEADLINE}, on anything on the site.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
      footerReason: 'you asked for a discount code at',
    }),
  }
}
