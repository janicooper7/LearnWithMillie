import { sendMail } from '@/lib/mailer'

/**
 * The one way marketing mail leaves this codebase — the drip journeys and the
 * one-off campaigns both go through here, so the sender name and the
 * unsubscribe headers can't be right in one path and missing in the other.
 */
export function fromAddress(): string | undefined {
  const address = process.env.SMTP_USER
  // A bare Gmail address as the sender looks like spam. Everything we send is
  // written in Millie's voice, so it should arrive from her.
  return address ? `Millie at LearnWithMillie <${address}>` : undefined
}

export async function sendBrandedMail(opts: {
  to: string
  subject: string
  html: string
  /** Null when AUTH_SECRET isn't set — the headers are then omitted. */
  unsubscribeUrl: string | null
}): Promise<void> {
  await sendMail({
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    from: fromAddress(),
    headers: opts.unsubscribeUrl
      ? {
          // Puts the unsubscribe control in the mail client's own chrome,
          // which is what keeps bulk sends like these out of the spam folder.
          'List-Unsubscribe': `<${opts.unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined,
  })
}
