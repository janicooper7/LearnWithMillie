import type { Role, SessionProposal } from '@prisma/client'
import { sendMail } from '@/lib/mailer'
import { fromAddress } from '@/lib/email/send'
import {
  buildProposalResponseNotice,
  buildSessionProposal,
} from '@/lib/email/messages/sessionProposal'
import { TEACHING_TZ, proposalUrl, sessionNoun } from '@/lib/sessionProposals'

/**
 * Turning a proposal into words, and getting those words to the people who
 * need them.
 *
 * Kept apart from sessionProposals.ts on purpose: that file owns the slot and
 * the credit, and must not fail because SMTP is down. A proposal whose email
 * never sent is still a held slot the student can see on their dashboard, so
 * every send here is best-effort and logged rather than thrown.
 */

/**
 * Every rendering of a proposed time uses the timezone stored on the row.
 *
 * That is the timezone the booking was made in, so this page, the email and
 * the calendar invite Cal sent all name the same wall-clock hour. Formatting
 * a proposal in the server's zone instead is how a student ends up being told
 * two different times for one lesson.
 */
export function formatProposal(proposal: Pick<SessionProposal, 'start' | 'end' | 'timeZone'>) {
  const tz = proposal.timeZone
  const start = new Date(proposal.start)
  const end = new Date(proposal.end)

  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(start)

  const time = (d: Date) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(d)

  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))

  return {
    dateLabel: date,
    timeLabel: `${time(start)} – ${time(end)}`,
    startLabel: time(start),
    // "UK time" rather than "Europe/London": this label is read by students in
    // an email, and an IANA identifier reads as a setting rather than a time.
    timeZoneLabel: tz === TEACHING_TZ ? 'UK time' : tz.replace(/_/g, ' '),
    durationLabel: `${minutes} minutes`,
    minutes,
  }
}

function deadlineLabel(expiresAt: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(expiresAt))
}

/**
 * SMTP being unconfigured is not an error in mailer.ts — it warns and returns,
 * which is right for a drip step nobody is watching. It is wrong here: the
 * admin page reports back whether the student was actually told, and a silent
 * no-op reported as "emailed" would leave Millie believing someone had been
 * asked to confirm a time they have never heard about.
 */
function smtpConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
}

/** The "I've held this for you" email. Never throws — see the note above. */
export async function sendProposalEmail(
  proposal: SessionProposal,
  user: { name: string | null; email: string; role: Role }
): Promise<boolean> {
  if (!smtpConfigured()) {
    console.warn('[proposals] SMTP is not configured — nobody was told about', proposal.id)
    return false
  }

  const parts = formatProposal(proposal)

  const email = buildSessionProposal({
    name: user.name,
    dateLabel: parts.dateLabel,
    timeLabel: parts.timeLabel,
    timeZoneLabel: parts.timeZoneLabel,
    durationLabel: parts.durationLabel,
    noun: sessionNoun(user.role),
    message: proposal.message,
    respondUrl: proposalUrl(proposal.id),
    expiresLabel: deadlineLabel(proposal.expiresAt, proposal.timeZone),
  })

  try {
    await sendMail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      from: fromAddress(),
    })
    return true
  } catch (err) {
    console.error('[proposals] Could not email proposal', proposal.id, err)
    return false
  }
}

/** Tells Millie an answer came in. Best-effort; the admin list is the real record. */
export async function sendProposalResponseNotice(
  proposal: SessionProposal,
  user: { name: string | null; email: string; role: Role },
  accepted: boolean
): Promise<void> {
  const to = process.env.RECIPIENT_EMAIL || process.env.SMTP_USER
  if (!to) return

  const parts = formatProposal(proposal)
  const email = buildProposalResponseNotice({
    studentName: user.name ?? user.email,
    studentEmail: user.email,
    accepted,
    dateLabel: parts.dateLabel,
    timeLabel: parts.timeLabel,
    noun: sessionNoun(user.role),
  })

  try {
    await sendMail({ to, subject: email.subject, html: email.html, from: fromAddress() })
  } catch (err) {
    console.error('[proposals] Could not notify admin about', proposal.id, err)
  }
}
