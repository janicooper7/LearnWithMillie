import { emailImage, firstName, p, renderEmail, signOff, siteUrl, socialLinks } from '@/lib/email/shell'
import {
  INSTAGRAM_URL,
  NEWSLETTER_MONTH,
  SOCIAL_HANDLE,
  TIKTOK_URL,
} from '@/lib/email/copy'
import type { BuiltEmail, JourneyContext } from '@/lib/email/types'

/**
 * Email 1 of the teacher journey — Millie's own copy, in her voice.
 *
 * It sells nothing: the whole job is the origin story and the newsletter
 * promise. The products come a day later in teacherProducts.ts.
 */

export function buildTeacherWelcome(ctx: JourneyContext): BuiltEmail {
  const site = siteUrl()
  const first = firstName(ctx.name)

  const body = `
    ${emailImage({
      src: `${site}/images/email-welcome-header.jpg`,
      alt: 'Millie Cooper, founder of Learn with Millie',
    })}
    ${p(first ? `Hi ${first}! &#129293;` : `Hi! &#129293;`)}
    ${p(`It's Millie &mdash; I'm the founder of Learn with Millie. A HUGE thank you for joining &mdash; it means so much that you're here!`)}
    ${p(`I'm so excited to let you know I'm launching my monthly newsletter this ${NEWSLETTER_MONTH}: the latest teaching news and research, my best tips and tricks, and any platform updates worth knowing about. Plus behind-the-scenes of what I'm building, new booklets, and first access to offers. All landing in your inbox once a month.`)}
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
    ${p(`And I've built a brand &mdash; Learn with Millie &mdash; to help other tutors do the same.`)}
    ${p(`I made every mistake possible on the way. Wrong platforms. Wrong rates. Wrong intro video. Wrong niche. Wrong everything, at some point.`)}
    ${p(`But slowly, all of that trial and error became something that actually worked. A career that fits around the school run instead of the other way around.`)}
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
    ${p(`DM me any time. Tell me your wins, tell me your struggles, tell me what you'd want more of. I read every single message. &#129293;`)}
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
