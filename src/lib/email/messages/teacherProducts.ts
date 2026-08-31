import { greeting, p, productCard, renderEmail, signOff, siteUrl, softLink } from '@/lib/email/shell'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * Email 2 of the teacher journey, one day after signup.
 *
 * Four separate things at four different prices, so each gets its own card and
 * its own link rather than one shared call to action — a teacher who wants the
 * $7 tool shouldn't have to read past the $140 one to find it. They're ordered
 * cheapest last on purpose: the low-priced tools are the easy yes, and putting
 * them at the end leaves the reader with one.
 *
 * Prices mirror MentorshipPricing.tsx, courseSalesContent.ts and the two
 * checkout routes.
 */
export function buildTeacherProducts(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()

  const courseBlurb = `Three courses that take you from setting up properly, to a calendar full of trials, to students who stay for months. $49, $79 and $59 on their own, or $149 for all three.`

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Yesterday I said there was mentorship, courses and a few tools here. Rather than make you go digging, here's the whole lot in one place with what each one costs.`)}
    ${productCard({
      title: 'Mentorship',
      price: 'From $50',
      blurb:
        'One to one with me, 50 minutes a session. Bring whatever is actually in the way — rates, a student you are stuck with, a platform decision, or where the next booking comes from. One session $50, two $95, three $140, paid once.',
      href: `${site}/teachers/mentorship`,
      cta: 'Browse mentorship',
    })}
    ${productCard({
      title: 'The course trilogy',
      price: '$149 for all three',
      blurb: courseBlurb,
      href: `${site}/teachers/courses`,
      cta: 'Browse the courses',
    })}
    ${productCard({
      title: 'Platform Finder',
      price: '$5',
      blurb:
        'Seven quick questions, then a ranked shortlist of which of 33 online teaching platforms will actually hire someone with your nationality, qualifications and setup — sorted by pay and fit. It takes about two minutes and saves a fortnight of applying to places that were never going to take you.',
      href: `${site}/teachers/platform-finder`,
      cta: 'Find your platform',
    })}
    ${productCard({
      title: 'Debate Generator',
      price: '$7 once',
      blurb:
        'Endless ESL debate topics with the key vocabulary already built out, ready to drop into a lesson. Good for the days when a student cancels and you have twenty minutes to fill something. Lifetime access, no subscription.',
      href: `${site}/teachers/debategenerator`,
      cta: 'Try it',
    })}
    ${p(`If none of that is where you are right now, the lesson plans are still free and still yours:`)}
    ${softLink(`${site}/teacher-materials`, 'Grab the free lesson plans')}
    ${p(`And the offer from yesterday stands — if you'd rather just ask me something before spending anything, reply to this and I'll answer.`)}
    ${signOff()}`

  return {
    subject: `Everything on the teacher side, and what it costs`,
    html: renderEmail({
      eyebrow: 'For teachers',
      headline: `Four ways I can help`,
      preheader: `Mentorship, the courses, the platform finder and the debate generator — all in one place.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
