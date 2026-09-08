// Queues the post-trial follow-up for trials that were booked before the
// feature existed. Dry-run by default; --apply writes.
//
//   node scripts/backfill-trial-followups.mjs                    # show what it would queue
//   node scripts/backfill-trial-followups.mjs --apply            # queue them for the cron
//   node scripts/backfill-trial-followups.mjs --apply --send-due # ...and send the ones already due
//   node scripts/backfill-trial-followups.mjs --days 14          # widen the window (default 7)
//
// New trials are queued automatically by the Cal webhook on BOOKING_CREATED,
// so this is a one-shot for bookings already in the calendar when the feature
// shipped. Running it twice is harmless: rows are keyed on the Cal booking uid,
// and an existing row is left exactly as it is.
//
// Cal is the source of truth for "who sat a trial and when". The database
// can't answer it — `User.trialUsed` is a flag with no date on it, and
// `updatedAt` moves for unrelated reasons — so the window is applied to the
// booking's own start time here.
//
// What it deliberately does NOT do is decide who deserves the email. The
// unsubscribe check and the "already subscribed" check live in the runner,
// immediately before each send, because somebody can subscribe in the hours
// between this script running and the email going out. This only schedules.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env'), quiet: true })
dotenv.config({ path: path.join(root, '.env.local'), override: true, quiet: true })

const APPLY = process.argv.includes('--apply')
/** Also deliver anything whose send time has already passed. */
const SEND_DUE = process.argv.includes('--send-due')

const daysArg = process.argv.indexOf('--days')
const DAYS = daysArg === -1 ? 7 : Number(process.argv[daysArg + 1] ?? 7)

const TRIAL_SLUG = 'trial-lesson-with-millie-cooper'

const { PrismaClient } = await import('@prisma/client')
const { PrismaPg } = await import('@prisma/adapter-pg')
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const { createJiti } = await import('jiti')
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(root, 'src') } })
const { trialFollowUpSendAt, deliverTrialFollowUp } = await jiti.import(
  '../src/lib/email/trialFollowUpRunner.ts'
)

/** Every trial booking Cal knows about, across the statuses that can matter. */
async function fetchTrials() {
  const key = process.env.CAL_API_KEY
  if (!key) throw new Error('CAL_API_KEY is not set')

  const out = []
  // `past` and `upcoming` only. Cancelled bookings are deliberately not
  // fetched: a trial that didn't happen gets no "lovely to meet you".
  for (const status of ['past', 'upcoming']) {
    for (let page = 0; page < 5; page++) {
      const url = new URL('https://api.cal.com/v2/bookings')
      url.searchParams.set('status', status)
      url.searchParams.set('take', '100')
      url.searchParams.set('skip', String(page * 100))
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${key}`, 'cal-api-version': '2024-08-13' },
      })
      if (!res.ok) throw new Error(`Cal returned ${res.status} listing ${status} bookings`)
      const data = await res.json()
      const batch = data?.data ?? data?.bookings ?? []
      out.push(...batch)
      if (batch.length < 100) break
    }
  }
  return out
}

const cutoff = new Date(Date.now() - DAYS * 864e5)
const now = new Date()

const trials = (await fetchTrials())
  .filter((b) => (b.eventType?.slug ?? b.eventTypeSlug ?? '') === TRIAL_SLUG)
  // Cal reports a rescheduled booking's old row as cancelled and issues a new
  // uid, so filtering the status here is what stops a moved trial being
  // followed up at the time it was originally going to happen.
  .filter((b) => String(b.status).toLowerCase() === 'accepted')
  .filter((b) => new Date(b.start) >= cutoff)
  .sort((a, b) => new Date(a.start) - new Date(b.start))

console.log(`${trials.length} accepted trial booking(s) in the last ${DAYS} days\n`)

let queued = 0
let sent = 0

for (const booking of trials) {
  const email = booking.attendees?.[0]?.email
  const timeZone = booking.attendees?.[0]?.timeZone ?? null
  const lessonEnd = new Date(booking.end)
  const sendAt = trialFollowUpSendAt(lessonEnd, timeZone)
  const label = `${new Date(booking.start).toISOString().slice(0, 16).replace('T', ' ')}  ${email}`

  if (!email) {
    console.log(`SKIP  ${label} — no attendee email`)
    continue
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { id: true, email: true, stripeSubscriptionId: true },
  })
  if (!user) {
    console.log(`SKIP  ${label} — no account`)
    continue
  }

  const existing = await prisma.trialFollowUp.findUnique({ where: { bookingUid: booking.uid } })
  if (existing) {
    console.log(`SKIP  ${label} — already ${existing.sentAt ? 'sent' : 'queued'}`)
    continue
  }

  // A lesson still in the future is queued at its real time and left to the
  // cron; only one already past its send time is a candidate for --send-due.
  const due = sendAt <= now
  const when = due ? 'due now' : `sends ${sendAt.toISOString().slice(0, 16).replace('T', ' ')}`
  console.log(`${APPLY ? 'QUEUE' : 'would'} ${label} — ${when}`)

  if (!APPLY) continue

  const row = await prisma.trialFollowUp.create({
    data: {
      userId: user.id,
      bookingUid: booking.uid,
      lessonEnd,
      // Anything already overdue goes on the next sweep rather than being
      // back-dated, so the ordering in the cron stays meaningful.
      sendAt: due ? now : sendAt,
    },
    select: { id: true },
  })
  queued += 1

  if (due && SEND_DUE) {
    const result = await deliverTrialFollowUp(row.id)
    console.log(`      -> ${result}`)
    if (result === 'sent') sent += 1
  }
}

console.log(
  APPLY
    ? `\nQueued ${queued}${SEND_DUE ? `, sent ${sent}` : ''}.`
    : '\nDry run — nothing written. Re-run with --apply.'
)

await prisma.$disconnect()
process.exit(0)
