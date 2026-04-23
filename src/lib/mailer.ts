import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('[mailer] SMTP not configured — email not sent to', options.to)
    return
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, ...options })
    console.log('[mailer] Email sent to', options.to, '|', options.subject)
  } catch (err) {
    console.error('[mailer] Failed to send email to', options.to, err)
    throw err
  }
}
