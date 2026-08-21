import {
  button,
  emailImage,
  greeting,
  note,
  p,
  planTable,
  renderEmail,
  signOff,
  siteUrl,
  softLink,
} from '@/lib/email/shell'
import { courseSales } from '@/lib/courseSalesContent'
import { PROMO, discountedPrice, isPromoActive } from '@/lib/promo'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * The September campaign — a one-off broadcast, not a journey step.
 *
 * Audience is teachers who signed up and haven't bought a course (see
 * src/lib/email/campaigns.ts), so it can lean on the sale without hedging:
 * everyone reading it is someone who looked at the courses and didn't buy.
 *
 * The whole argument is timing rather than discount. September is when
 * students come back, and a teacher who is ready in the last week of August
 * fills a calendar that stays full to Christmas — so the deadline in the copy
 * is the intake itself, which is real, rather than a countdown we invented.
 *
 * Prices are read from courseSalesContent.ts and src/lib/promo.ts, the same
 * two sources the course pages price from, so the email cannot advertise a
 * number that checkout then contradicts. It also degrades honestly: with the
 * promo off (`percentOff: 0`) every price falls back to list and the struck
 * "was" lines disappear rather than showing a fake saving.
 */

// Mirrors LIST_PRICE in TrilogyPurchaseCard.tsx — the bundle's own price isn't
// in courseSales, which holds the three courses individually.
const TRILOGY_PRICE = 149

export function buildTeacherSeptember(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()
  const coursesUrl = `${site}/teachers/courses`
  const onSale = isPromoActive()

  const price = (amount: number) => (onSale ? discountedPrice(amount) : `$${amount}`)
  const was = (amount: number) => (onSale ? `was $${amount}` : undefined)

  const courseRow = (slug: keyof typeof courseSales, detail: string) => {
    const course = courseSales[slug]
    return {
      name: course.label,
      price: price(course.price),
      per: was(course.price),
      detail,
    }
  }

  const body = `
    ${emailImage({
      src: `${site}/images/email-september-header.jpg`,
      alt: 'Learn with Millie — courses for online English teachers',
    })}
    ${p(greeting(ctx.name))}
    ${p(`Every year it goes the same way. August is quiet &mdash; students are away, parents stop booking, the calendar looks like nothing is ever going to happen again. Then the first week of September lands and it all arrives at once.`)}
    ${p(`Parents rebook for the school year. The adults who said they'd &ldquo;start properly in September&rdquo; actually start. Exam students work out that their date is a lot closer than they thought. Companies release the new training budget. For anyone teaching online, it is the single biggest intake of the year &mdash; nothing else on the calendar comes near it.`)}
    ${p(`Here's the part that catches people out: it goes to whoever is ready in the last week of August. Not whoever gets ready in October. The profiles that are already live, the intro videos that are already up, the trial slots that are already open &mdash; those are the ones that get filled, and the students who fill them stay booked through to Christmas.`)}
    ${p(`So this is the fortnight to get set up. That is exactly, and only, what the BOOKED Trilogy is built to do:`)}
    ${planTable([
      courseRow(
        'get-ready',
        'Profile, intro video, rates, tech and admin — live and accepted, with a plan for where your first five students come from.'
      ),
      courseRow(
        'get-booked',
        'The marketing engine. How to turn a live profile into a calendar of trial lessons, and how to convert them once they book.'
      ),
      courseRow(
        'stay-booked',
        'Retention. How a September student becomes a March student, and how that turns into income you can count on.'
      ),
      {
        name: 'The BOOKED Trilogy',
        price: price(TRILOGY_PRICE),
        per: was(TRILOGY_PRICE),
        detail:
          'All three, in the order they are meant to be taken. 35 modules, ~350 minutes of video, every worksheet and template, lifetime access.',
        featured: true,
      },
    ])}
    ${
      onSale
        ? p(`The whole trilogy is ${discountedPrice(TRILOGY_PRICE)} instead of $${TRILOGY_PRICE} for the September sale &mdash; ${PROMO.percentOff}% comes off by itself at checkout, so there's no code to remember and nothing to type.`)
        : p(`The whole trilogy is $${TRILOGY_PRICE}, paid once, with lifetime access.`)
    }
    ${button(coursesUrl, onSale ? `Get ${PROMO.percentOff}% off the trilogy` : 'See the trilogy')}
    ${note(`<strong>Seven days to change your mind.</strong> If it isn't right for you in the first week, email me and you get every penny back. No questions, no hoops. I'd rather that than have you keep something you don't want.`)}
    ${p(`And if you're not buying anything today, that's genuinely fine &mdash; the September rush is still coming and the free lesson plans are still yours:`)}
    ${softLink(`${site}/teacher-materials`, 'Grab the free lesson plans')}
    ${p(`If you're not sure which of the three you actually need, reply to this email and tell me where you're stuck. I'll tell you honestly &mdash; including if the answer is none of them.`)}
    ${signOff()}`

  return {
    subject: onSale
      ? `September is the biggest month of your year (${PROMO.percentOff}% off inside)`
      : `September is the biggest month of your year`,
    html: renderEmail({
      // renderEmail escapes the eyebrow, so this is plain text, not entities.
      eyebrow: onSale ? `September sale: ${PROMO.percentOff}% off` : 'September',
      headline: `The month everybody comes back`,
      preheader: `The biggest intake of the year goes to whoever is ready for it. Here's how to be ready.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
