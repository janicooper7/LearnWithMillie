import { emailImage, firstName, p, renderEmail, signOff, siteUrl, socialLinks } from '@/lib/email/shell'
import {
  INSTAGRAM_URL,
  NEWSLETTER_MONTH,
  SOCIAL_HANDLE,
  TIKTOK_URL,
} from '@/lib/email/copy'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * Email 1 of the student journey — the same origin story Millie tells teachers
 * in teacherWelcome.ts, turned to face a learner.
 *
 * The story is deliberately identical up to the point it pays off. For a tutor
 * it lands on "I built this and I can help you do the same"; for a student it
 * has to land on what four thousand lessons taught her about why people freeze
 * when they speak. Nobody receives both, so the shared middle costs nothing.
 *
 * Sells nothing — no price, no button. The plans come a day later in
 * studentLessons.ts.
 */
export function buildStudentWelcome(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()
  const first = firstName(ctx.name)

  const body = `
    ${emailImage({
      src: `${site}/images/email-welcome-header.jpg`,
      alt: 'Millie Cooper, founder of Learn with Millie',
    })}
    ${p(first ? `Hi ${first}! &#129293;` : `Hi! &#129293;`)}
    ${p(`It's Millie &mdash; I'm the founder of Learn with Millie. A HUGE thank you for joining &mdash; it means so much that you're here!`)}
    ${p(`I'm so excited to let you know I'm launching my monthly newsletter this ${NEWSLETTER_MONTH}: the words and phrases that actually come up in real conversations, the mistakes I hear most often and how to fix them, and pronunciation tips you can practise in five minutes. Plus behind-the-scenes of what I'm building, new booklets, and first access to offers. All landing in your inbox once a month.`)}
    ${p(`Since this is the first email I'm ever writing to you... I thought I'd tell you how any of this actually started.`)}
    ${p(`Four years ago I was a stay-at-home mum in London. I'd left a career in politics after having my two daughters &mdash; the work I used to do just didn't fit the life I now had.`)}
    ${p(`I'd been at home for two years and I loved parts of it, but I was completely lost in others. I'd started to feel like a version of myself I didn't quite recognise anymore.`)}
    ${p(`Then one evening after my daughters were in bed, I sat down at our dining room table, opened my laptop, and signed up for an online tutoring platform I'd barely heard of.`)}
    ${p(`I taught my first ever English lesson online for eight dollars an hour.`)}
    ${p(`I really, really did not think anything would come of it...`)}
    ${emailImage({
      src: `${site}/images/email-welcome-desk.jpg`,
      alt: 'Millie teaching from her dining room table',
      width: 436,
    })}
    ${p(`Four years later... I've taught over 4,000 lessons to 300+ students from 30+ countries. I run a full-time teaching career from home.`)}
    ${p(`And in all those lessons, the same thing has come up again and again. The students who improve fastest are almost never the ones with the best grammar. They're the ones willing to speak badly for a little while.`)}
    ${p(`Because what usually stands between someone and speaking freely isn't vocabulary, and it isn't tenses. It's the fear of getting it wrong in front of another person &mdash; of sounding less clever, less funny, less like yourself than you know you are.`)}
    ${p(`That feeling of not quite recognising yourself? I understand it more than you'd think. And getting you back to sounding like <em>you</em>, in English, is genuinely the whole job as far as I'm concerned.`)}
    ${p(`By the way &mdash; come and find me on the socials, I'd love to see you there:`)}
    ${socialLinks([
      {
        icon: '&#127925;',
        platform: 'TikTok',
        handle: SOCIAL_HANDLE,
        url: TIKTOK_URL,
        blurb: 'Teaching moments, quick tips, and behind-the-scenes.',
      },
      {
        icon: '&#128247;',
        platform: 'Instagram',
        handle: SOCIAL_HANDLE,
        url: INSTAGRAM_URL,
        blurb: "Honest thoughts, day-to-day, and what I'm building.",
      },
    ])}
    ${p(`And reply to this any time. Tell me what you're working towards, or what you find hardest about speaking. I read every single message. &#129293;`)}
    ${p(`That's all for now. I'll be back in your inbox soon.`)}
    ${signOff()}`

  return {
    subject: `Thank you for joining (and how this all started)`,
    html: renderEmail({
      eyebrow: 'Welcome',
      headline: `So glad you're here`,
      preheader: `Four years ago I taught my first lesson for eight dollars an hour. Here's what happened next.`,
      body,
      unsubscribeUrl: ctx.unsubscribeUrl ?? undefined,
    }),
  }
}
