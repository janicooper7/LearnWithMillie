import nodemailer from 'nodemailer'
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

/**
 * A pooled transport for bulk sends.
 *
 * The shared transporter in mailer.ts is unpooled: every sendMail opens a
 * fresh SMTP connection and authenticates again. That is right for the one-off
 * transactional mail it was written for, and wrong for a campaign — Gmail caps
 * *login attempts*, not just messages, and starts answering
 * "454 4.7.0 Too many login attempts" after roughly a hundred of them in quick
 * succession. That is a rejection at authentication, before any message body is
 * transmitted, so nothing is delivered and nothing is duplicated; the send
 * simply stops part-way through the list.
 *
 * Pooling authenticates once and reuses the connection for every message, and
 * the rate limit spaces them out so a long run never looks like a burst.
 *
 * Call `close()` when the run finishes — an open pool keeps the process alive.
 * Deliberately not module-level state: a pooled connection held open across a
 * serverless invocation is its own kind of trouble, so a run creates one, uses
 * it, and disposes of it.
 */
export function createBulkTransport() {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    pool: true,
    // One connection, one message at a time. Bulk mail has no reason to be
    // fast, and concurrency here is what trips Gmail's per-connection limits.
    maxConnections: 1,
    maxMessages: Infinity,
    // At most one message per second.
    rateDelta: 1000,
    rateLimit: 1,
  })

  return {
    async send(opts: {
      to: string
      subject: string
      html: string
      unsubscribeUrl: string | null
    }): Promise<void> {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        throw new Error('SMTP is not configured')
      }
      await transport.sendMail({
        from: fromAddress() || process.env.SMTP_USER,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.unsubscribeUrl
          ? {
              headers: {
                'List-Unsubscribe': `<${opts.unsubscribeUrl}>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              },
            }
          : {}),
      })
    },
    close() {
      transport.close()
    },
  }
}
