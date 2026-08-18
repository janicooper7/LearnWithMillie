import { greeting, note, p, renderEmail, signOff, siteUrl, softLink } from '@/lib/email/shell'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * Email 1 of the student journey, sent the moment the account is created.
 *
 * Deliberately sells nothing: no price, no promo, no "book now" button. Someone
 * who has just signed up already knows where the booking page is — the job here
 * is to put a face to the brand and set the expectation that what follows is
 * worth opening.
 */
export function buildStudentWelcome(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()

  const body = `
    ${p(greeting(ctx.name))}
    ${p(`Thanks for creating an account — welcome to the family. I'm Millie, a certified TEFL teacher from London, and for the last four years I've taught English online to people all over the world.`)}
    ${p(`I started LearnWithMillie because of a pattern I kept seeing. Learner after learner could read English well, write it well, pass the tests — then freeze the moment they had to actually speak. A job interview. A meeting where they knew the answer. A conversation that mattered.`)}
    ${p(`That gap, between what you know and what you can say out loud under pressure, is the whole thing I work on. So lessons here are conversation-first: business English, interview practice, pronunciation, and the confidence to use all of it. There's no textbook you have to march through. We start from where you actually are and what you actually need.`)}
    ${note(`<strong style="color:#1F3A34;">Nothing to do right now.</strong> This one is just a hello. Over the next couple of weeks I'll send you a few things I think will genuinely help — how to practise between lessons, the mistakes I hear most often, and what a lesson with me is actually like. If it turns out not to be useful, one click takes you off the list and there are no hard feelings.`)}
    ${softLink(`${site}/about`, `Have a look around whenever you're ready`)}
    ${p(`And if you ever want to ask me something, just reply to this email. It comes straight to me.`)}
    ${signOff()}`

  return {
    subject: `Welcome to LearnWithMillie`,
    html: renderEmail({
      eyebrow: 'Welcome',
      headline: `I'm really glad you're here`,
      preheader: `A quick hello from me, and what LearnWithMillie is all about. No homework, I promise.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
