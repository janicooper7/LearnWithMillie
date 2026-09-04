// Puts subscribers who joined the list *before* the follow-up tracks existed
// onto the track for the page they signed up on. Dry-run by default; --apply
// writes.
//
//   node scripts/backfill-followups.mjs                  # show who it would reach
//   node scripts/backfill-followups.mjs --apply          # enrol them
//   node scripts/backfill-followups.mjs --apply --now    # ...and send on the next cron run
//   node scripts/backfill-followups.mjs --apply --max-age-days 30
//
// New signups are enrolled automatically by /api/subscribe, so this is a
// one-shot for the people already on the list when the feature shipped. Running
// it twice is harmless: enrolment is guarded on `followUp` being null, so anyone
// already on a track is left exactly where they are.
//
// What it deliberately does NOT do is decide who deserves the email. Buyers are
// excluded by the runner immediately before each send (src/lib/email/purchases.ts)
// rather than here, because somebody can buy in the two days between this script
// running and the email going out — filtering here would miss exactly those
// people. Same for the account-journey frequency cap. This only schedules.
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
const { PrismaClient } = await import('@prisma/client')
const { PrismaPg } = await import('@prisma/adapter-pg')

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const APPLY = process.argv.includes('--apply')
/** Schedule the first email for the next cron run instead of signup + 2 days. */
const NOW = process.argv.includes('--now')

/**
 * Skip anyone who signed up longer ago than this.
 *
 * The copy says "you were on the Platform Finder page a couple of days ago",
 * which is true of a recent signup and a small lie to somebody who joined last
 * spring. Default is deliberately generous rather than unlimited — raise it
 * knowingly, and reword the openers first if you go far back.
 */
const maxAgeFlag = process.argv.indexOf('--max-age-days')
const MAX_AGE_DAYS = maxAgeFlag > -1 ? Number(process.argv[maxAgeFlag + 1]) : 30

const DAY_MS = 24 * 60 * 60 * 1000

// Mirrors SUBSCRIBER_JOURNEYS in src/lib/email/subscriberJourneys.ts. Kept as a
// literal rather than imported because that module is TypeScript behind a `@/`
// alias and this is a plain node script — if a track's sources or its first
// delayDays change there, change them here too.
const TRACKS = [
  { key: 'platform-finder', prefix: '/teachers/platform-finder', firstDelayDays: 2 },
  { key: 'courses', prefix: '/teachers/courses', firstDelayDays: 2 },
]

const cutoff = new Date(Date.now() - MAX_AGE_DAYS * DAY_MS)
const days = (d) => Math.round((Date.now() - d.getTime()) / DAY_MS)

console.log(
  `\n${APPLY ? 'ENROLLING' : 'DRY RUN'} — subscribers signed up within ${MAX_AGE_DAYS} days, not already on a track` +
    `\nFirst email: ${NOW ? 'next cron run' : 'signup + 2 days (so immediately, for anyone past that)'}\n`
)

let totalMatched = 0
let totalEnrolled = 0

for (const track of TRACKS) {
  const where = {
    followUp: null,
    unsubscribedAt: null,
    createdAt: { gte: cutoff },
    OR: [{ source: track.prefix }, { source: { startsWith: `${track.prefix}/` } }],
  }

  const people = await prisma.subscriber.findMany({
    where,
    select: { id: true, email: true, name: true, createdAt: true, source: true },
    orderBy: { createdAt: 'asc' },
  })

  totalMatched += people.length
  console.log(`${track.key}: ${people.length} to enrol`)

  for (const person of people) {
    const startedAt = new Date()
    // Anchored on the original signup so the offsets mean what they say, unless
    // --now, which restarts the clock and sends on the next run.
    const nextAt = NOW
      ? startedAt
      : new Date(
          Math.max(
            person.createdAt.getTime() + track.firstDelayDays * DAY_MS,
            Date.now()
          )
        )

    console.log(
      `  ${person.email.padEnd(34)} joined ${String(days(person.createdAt)).padStart(3)}d ago` +
        `  → first email ${nextAt <= new Date() ? 'next cron run' : nextAt.toISOString()}`
    )

    if (!APPLY) continue

    // Guarded the same way /api/subscribe's enrolment is, so a re-run and a
    // concurrent signup can't double-enrol anyone.
    const written = await prisma.subscriber.updateMany({
      where: { id: person.id, followUp: null, unsubscribedAt: null },
      data: {
        followUp: track.key,
        followUpStep: 0,
        followUpStartedAt: NOW ? startedAt : person.createdAt,
        followUpNextAt: nextAt,
        followUpAttempts: 0,
      },
    })
    totalEnrolled += written.count
  }
  console.log('')
}

console.log(
  APPLY
    ? `Enrolled ${totalEnrolled} of ${totalMatched}. They send on the next cron run of /api/cron/email-journey.`
    : `${totalMatched} would be enrolled. Re-run with --apply to write.`
)

await prisma.$disconnect()
