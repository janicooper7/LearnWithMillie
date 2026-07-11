import nodemailer from 'nodemailer'
import {
  matchAll,
  studentAgeLabel,
  teflLabel,
  COUNTRY_LABELS,
  type Profile,
} from '@/app/teachers/platform-finder/platforms'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const GREEN = '#1F3A34'
const GOLD = '#C2AA6A'
const CREAM = '#F4EDE4'
const CARD_BG = '#FBF7F1'
const BORDER = '#EDE4D8'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function profileSummary(profile: Profile): string {
  const parts = [
    profile.nativeSpeaker ? 'Native speaker' : 'Non-native speaker',
    COUNTRY_LABELS[profile.country],
    profile.tefl ? 'TEFL/CELTA ✓' : 'No TEFL',
    profile.degree ? 'Degree ✓' : 'No degree',
  ]
  return parts.map(esc).join(' &nbsp;·&nbsp; ')
}

function platformRow(name: string, rate: string, meta: string, notes: string, url?: string): string {
  const visit = url
    ? `<a href="${esc(url)}" style="display:inline-block;margin-top:10px;background:${GREEN};color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;">Visit site &rarr;</a>`
    : ''
  return `
    <tr>
      <td style="padding:0 0 14px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD_BG};border:1px solid ${BORDER};border-radius:14px;">
          <tr>
            <td style="padding:18px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:${GREEN};">${esc(name)}</td>
                  <td align="right" style="font-size:16px;font-weight:700;color:${GREEN};white-space:nowrap;padding-left:12px;">${esc(rate)}</td>
                </tr>
              </table>
              <div style="font-size:13px;color:rgba(31,58,52,0.7);margin-top:8px;line-height:1.5;">${meta}</div>
              ${notes ? `<div style="font-size:13px;color:rgba(31,58,52,0.7);margin-top:8px;line-height:1.5;">${esc(notes)}</div>` : ''}
              ${visit}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export function buildPlatformFinderEmail(
  profile: Profile,
  resultUrl?: string
): { subject: string; html: string; matchCount: number } {
  const results = matchAll(profile)
  const matched = results.filter((r) => r.matches)

  const rows = matched
    .map((r) => {
      const p = r.platform
      const meta = [
        `TEFL: <strong style="color:${GREEN};">${esc(teflLabel(p.tefl))}</strong>`,
        `Students: <strong style="color:${GREEN};">${esc(studentAgeLabel(p.students))}</strong>`,
        `Min hrs/week: <strong style="color:${GREEN};">${p.minHoursPerWeek === 0 ? 'None' : `${p.minHoursPerWeek}`}</strong>`,
        `Experience: <strong style="color:${GREEN};">${p.minYearsExperience === 0 ? 'None' : `${p.minYearsExperience}+ yrs`}</strong>`,
      ].join(' &nbsp;·&nbsp; ')
      return platformRow(p.name, p.hourlyRate, meta, p.notes, p.signupUrl)
    })
    .join('')

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${CREAM};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <!-- Header -->
            <tr>
              <td style="background:${GREEN};border-radius:18px 18px 0 0;padding:32px 28px;text-align:center;">
                <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-weight:600;margin-bottom:10px;">Your platform matches</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.25;">
                  You match ${matched.length} platform${matched.length === 1 ? '' : 's'}
                </div>
              </td>
            </tr>
            <!-- Intro -->
            <tr>
              <td style="background:#ffffff;padding:26px 28px 8px 28px;">
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:rgba(31,58,52,0.8);">
                  Thanks for your purchase! Here are the online English teaching platforms that actually hire teachers with your profile — ranked by pay. Keep this email so you can apply whenever you're ready.
                </p>
                <div style="font-size:12px;color:rgba(31,58,52,0.6);background:${CREAM};border:1px solid ${BORDER};border-radius:10px;padding:12px 14px;line-height:1.6;">
                  ${profileSummary(profile)}
                </div>
                ${
                  resultUrl
                    ? `<div style="text-align:center;margin-top:18px;">
                        <a href="${esc(resultUrl)}" style="display:inline-block;background:${GOLD};color:${GREEN};text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;border-radius:10px;">View your results online &rarr;</a>
                        <div style="font-size:11px;color:rgba(31,58,52,0.5);margin-top:8px;">Bookmark this link — it's your private access to these results.</div>
                      </div>`
                    : ''
                }
              </td>
            </tr>
            <!-- Matches -->
            <tr>
              <td style="background:#ffffff;padding:20px 28px 8px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows || `<tr><td style="font-size:14px;color:rgba(31,58,52,0.7);padding-bottom:14px;">No exact matches this time — reply to this email and we'll help you find a fit.</td></tr>`}
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#ffffff;border-radius:0 0 18px 18px;padding:8px 28px 30px 28px;text-align:center;border-top:1px solid ${BORDER};">
                <p style="margin:18px 0 0 0;font-size:12px;color:rgba(31,58,52,0.5);line-height:1.6;">
                  Sent by LearnWithMillie · Based on data from leading online English teaching platforms.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return {
    subject: `Your ${matched.length} teaching-platform match${matched.length === 1 ? '' : 'es'} — LearnWithMillie`,
    html,
    matchCount: matched.length,
  }
}

export async function sendPlatformFinderResults(
  to: string,
  profile: Profile,
  resultUrl?: string
): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('Platform Finder email: SMTP not configured — skipping send')
    return
  }

  const { subject, html } = buildPlatformFinderEmail(profile, resultUrl)

  await transporter.sendMail({
    from: `LearnWithMillie <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}
