// Renders the post-trial follow-up email, and optionally sends one copy.
//
//   node scripts/preview-trial-followup.mjs                        # write the HTML to a file
//   node scripts/preview-trial-followup.mjs --to you@example.com   # ...and email it
//   node scripts/preview-trial-followup.mjs --to you@example.com --name Johny
//
// For looking at the thing in a real inbox before it goes to a real student.
// It builds the same HTML the cron does, through the same sendBrandedMail path,
// so what arrives is what a student would get — with one difference: the
// unsubscribe link is omitted, because there is no User row behind a preview
// and a link that 404s is worse than no link.
//
// Nothing here touches the database. Scheduling is the Cal webhook's job
// (src/lib/email/trialFollowUpRunner.ts); this only renders and sends.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// SMTP lives in .env; .env.local carries the rest and wins where they overlap.
dotenv.config({ path: path.join(root, '.env') })
dotenv.config({ path: path.join(root, '.env.local'), override: true })

const arg = (flag) => {
  const i = process.argv.indexOf(flag)
  return i === -1 ? null : process.argv[i + 1] ?? null
}

const to = arg('--to')
const name = arg('--name')

// The email modules are TypeScript and use the `@/` alias, so they are loaded
// through jiti rather than imported directly.
const { createJiti } = await import('jiti')
const jiti = createJiti(import.meta.url, {
  alias: { '@': path.join(root, 'src') },
})

const { buildTrialFollowUp } = await jiti.import('../src/lib/email/messages/trialFollowUp.ts')

const { subject, html } = buildTrialFollowUp({
  name: name ?? null,
  email: to ?? 'preview@example.com',
  unsubscribeUrl: null,
})

const out = path.join(root, 'trial-followup-preview.html')
writeFileSync(out, html, 'utf8')
console.log('Subject:', subject)
console.log('Wrote:  ', out)

if (!to) {
  console.log('\nNo --to given, so nothing was sent.')
  process.exit(0)
}

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.error('\nSMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASSWORD to send.')
  process.exit(1)
}

const { sendBrandedMail } = await jiti.import('../src/lib/email/send.ts')

await sendBrandedMail({ to, subject, html, unsubscribeUrl: null })
console.log('Sent to:', to)
process.exit(0)
