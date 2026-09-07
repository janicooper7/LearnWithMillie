import { GREEN, CREAM, BORDER, button, esc, greeting, note, p, renderEmail, signOff } from '@/lib/email/shell'
import type { BuiltEmail } from '@/lib/email/types'

/**
 * The email that asks someone to confirm a time Millie picked for them.
 *
 * It has an awkward job. By the time it lands, Cal.com has already sent the
 * person an ordinary confirmation and a calendar invite, because the slot is
 * genuinely booked — that is the entire point, it is what stops somebody else
 * taking it. So this email cannot pretend the session is hypothetical. It says
 * the time is held, and offers the way out.
 *
 * Transactional, not marketing: no unsubscribe link, because someone who opted
 * out of emails still needs to be told about a lesson in their calendar.
 */

export type ProposalEmailContext = {
  name: string | null
  /** Rendered in the recipient's own timezone by the caller. */
  dateLabel: string
  timeLabel: string
  timeZoneLabel: string
  durationLabel: string
  /** 'lesson' or 'session', matching how the rest of the site talks to them. */
  noun: string
  message: string | null
  respondUrl: string
  /** Human-readable deadline, e.g. "Tuesday 9 September". */
  expiresLabel: string
}

/** The proposed time, set out as the one thing the email is about. */
function timeCard(ctx: ProposalEmailContext): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px 0;">
    <tr>
      <td align="center" style="background:${CREAM};border:1px solid ${BORDER};border-radius:14px;padding:22px 18px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;font-weight:700;color:#8a6f2e;margin-bottom:10px;">Held for you</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:700;color:${GREEN};line-height:1.35;">${esc(ctx.dateLabel)}</div>
        <div style="font-size:17px;font-weight:600;color:${GREEN};margin-top:6px;">${esc(ctx.timeLabel)}</div>
        <div style="font-size:13px;color:rgba(31,58,52,0.6);margin-top:8px;line-height:1.55;">${esc(ctx.durationLabel)} &middot; ${esc(ctx.timeZoneLabel)}</div>
      </td>
    </tr>
  </table>`
}

export function buildSessionProposal(ctx: ProposalEmailContext): BuiltEmail {
  const body = `
    ${p(greeting(ctx.name))}
    ${p(`I've put a ${esc(ctx.noun)} in for us. I've booked the slot so nobody else can take it while you decide &mdash; but it's yours only if it works, so have a look and let me know either way.`)}
    ${timeCard(ctx)}
    ${ctx.message ? note(`<strong style="color:${GREEN};">From Millie:</strong> ${esc(ctx.message)}`) : ''}
    ${button(ctx.respondUrl, 'Confirm or change this time')}
    ${p(`You'll have had a calendar invitation from Cal.com already &mdash; that's the slot being held, not a decision on your part. If the time doesn't suit you, decline on that page and I'll get the slot back on the calendar for someone else, with your ${esc(ctx.noun)} credited straight back to you. You can then pick any time that suits you from your dashboard.`)}
    ${p(`If I don't hear from you by <strong style="color:${GREEN};">${esc(ctx.expiresLabel)}</strong>, I'll assume it doesn't work and release the time &mdash; again, with your ${esc(ctx.noun)} back in your account.`)}
    ${signOff()}`

  return {
    subject: `I've held ${ctx.dateLabel} for you — does it work?`,
    html: renderEmail({
      eyebrow: 'A time for you',
      headline: `${ctx.dateLabel}, ${ctx.timeLabel}`,
      preheader: `I've held this ${ctx.noun} for you — confirm it or pick another time.`,
      body,
    }),
  }
}

/** What Millie gets when someone answers, so she doesn't have to watch the admin page. */
export function buildProposalResponseNotice(opts: {
  studentName: string
  studentEmail: string
  accepted: boolean
  dateLabel: string
  timeLabel: string
  noun: string
}): BuiltEmail {
  const verb = opts.accepted ? 'confirmed' : 'declined'
  const body = `
    ${p(`<strong style="color:${GREEN};">${esc(opts.studentName)}</strong> (${esc(opts.studentEmail)}) has ${verb} the ${esc(opts.noun)} you proposed for <strong style="color:${GREEN};">${esc(opts.dateLabel)} at ${esc(opts.timeLabel)}</strong>.`)}
    ${
      opts.accepted
        ? p(`Nothing to do &mdash; it's in the calendar and it was already booked.`)
        : note(`The slot has gone back on the calendar and their ${esc(opts.noun)} has been credited back. If you still want to see them that week, propose another time.`)
    }`

  return {
    subject: `${opts.studentName} ${verb} ${opts.dateLabel}`,
    html: renderEmail({
      eyebrow: opts.accepted ? 'Confirmed' : 'Declined',
      headline: `${opts.studentName} ${verb}`,
      preheader: `${opts.dateLabel} at ${opts.timeLabel} was ${verb}.`,
      body,
      footerReason: 'you are the administrator of',
    }),
  }
}
