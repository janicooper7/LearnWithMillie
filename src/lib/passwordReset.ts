import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/prisma'

// Reset tokens live in the NextAuth VerificationToken table. `identifier` is
// namespaced so these rows can never be mistaken for an email-verification
// token, and only the SHA-256 of the token is stored — a leaked database dump
// therefore can't be replayed to take over an account.
const IDENTIFIER_PREFIX = 'password-reset:'
const TTL_MS = 60 * 60 * 1000 // 1 hour

const GREEN = '#1F3A34'
const GOLD = '#C2AA6A'
const CREAM = '#F4EDE4'
const BORDER = '#EDE4D8'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Issues a single-use reset link for `email`. Any earlier outstanding tokens
 * for that address are dropped first, so the most recent email is the only one
 * that works. Returns the absolute URL to send.
 */
export async function createResetLink(email: string): Promise<string> {
  const identifier = IDENTIFIER_PREFIX + email.toLowerCase()

  await prisma.verificationToken.deleteMany({ where: { identifier } })

  const token = randomBytes(32).toString('hex')
  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(token),
      expires: new Date(Date.now() + TTL_MS),
    },
  })

  return `${siteUrl()}/auth/reset-password?token=${token}`
}

/**
 * Verifies a token and, if it is valid and unexpired, sets the new password and
 * burns the token. Returns the user's email on success, or null on any failure
 * — expired, unknown, already used, or belonging to a deleted account.
 */
export async function consumeResetToken(
  token: string,
  newPassword: string
): Promise<string | null> {
  if (!token) return null

  const hashed = hashToken(token)
  const row = await prisma.verificationToken.findUnique({ where: { token: hashed } })
  if (!row || !row.identifier.startsWith(IDENTIFIER_PREFIX)) return null

  // Constant-time compare so a token that exists can't be distinguished from
  // one that doesn't by response timing.
  const a = Buffer.from(row.token)
  const b = Buffer.from(hashed)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  if (row.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({ where: { token: hashed } })
    return null
  }

  const email = row.identifier.slice(IDENTIFIER_PREFIX.length)
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    await prisma.verificationToken.deleteMany({ where: { token: hashed } })
    return null
  }

  const { hash } = await import('bcryptjs')
  const password = await hash(newPassword, 12)

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { password } }),
    prisma.verificationToken.deleteMany({ where: { identifier: row.identifier } }),
    // Signing out everywhere is the point of a reset: if someone else got in,
    // their session dies with the old password.
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ])

  return email
}

export function buildResetEmail(resetUrl: string, name?: string | null): {
  subject: string
  html: string
} {
  const greeting = name ? `Hi ${esc(name.split(' ')[0])},` : 'Hi there,'

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${CREAM};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="background:${GREEN};border-radius:18px 18px 0 0;padding:32px 28px;text-align:center;">
                <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-weight:600;margin-bottom:10px;">Student portal</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.25;">
                  Reset your password
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:0 0 18px 18px;padding:28px 28px 30px 28px;">
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:rgba(31,58,52,0.8);">
                  ${greeting}
                </p>
                <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:rgba(31,58,52,0.8);">
                  We got a request to reset the password on your LearnWithMillie account. Click the button below to choose a new one — the link works once and expires in an hour.
                </p>
                <div style="text-align:center;margin:0 0 22px 0;">
                  <a href="${esc(resetUrl)}" style="display:inline-block;background:${GOLD};color:${GREEN};text-decoration:none;font-size:15px;font-weight:700;padding:13px 28px;border-radius:10px;">Choose a new password &rarr;</a>
                </div>
                <p style="margin:0 0 6px 0;font-size:12px;color:rgba(31,58,52,0.55);line-height:1.6;">
                  If the button doesn't work, paste this into your browser:
                </p>
                <p style="margin:0 0 22px 0;font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="${esc(resetUrl)}" style="color:${GREEN};">${esc(resetUrl)}</a>
                </p>
                <div style="font-size:13px;color:rgba(31,58,52,0.6);background:${CREAM};border:1px solid ${BORDER};border-radius:10px;padding:12px 14px;line-height:1.6;">
                  Didn't ask for this? You can ignore this email — your password stays as it is.
                </div>
                <p style="margin:20px 0 0 0;font-size:12px;color:rgba(31,58,52,0.5);line-height:1.6;text-align:center;">
                  Sent by LearnWithMillie
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return { subject: 'Reset your LearnWithMillie password', html }
}
