// Repairs channel labels on TrackedEvent rows recorded before two attribution
// fixes landed. Dry-run by default; pass --apply to write.
//
//   node scripts/backfill-channels.mjs           # show what would change
//   node scripts/backfill-channels.mjs --apply   # write it
//
// 1. Meta ads tagged `utm_medium=paid` with `utm_source=ig|fb` were bucketed as
//    paid search, because the old source matcher only knew full hostnames.
// 2. Sessions that started on a bounce back from checkout.stripe.com were
//    bucketed as referral traffic, inventing a source that earned nothing.
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
const { PrismaClient } = await import('@prisma/client')
const { PrismaPg } = await import('@prisma/adapter-pg')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
const APPLY = process.argv.includes('--apply')

const SOCIAL_SOURCES = ['ig', 'fb', 'meta', 'insta', 'instagram', 'facebook', 'messenger', 'tiktok', 'tt', 'yt', 'youtube', 'linkedin', 'li', 'pinterest', 'reddit', 'twitter', 'x']
const SELF_REFERRAL = ['checkout.stripe.com', 'pay.stripe.com', 'js.stripe.com', 'billing.stripe.com']

const misSocial = { channel: { not: 'paid_social' }, source: { in: SOCIAL_SOURCES } }
const selfRef = { source: { in: SELF_REFERRAL } }

const socialCount = await prisma.trackedEvent.count({ where: misSocial })
const selfRefCount = await prisma.trackedEvent.count({ where: selfRef })

console.log(`\nPaid-social rows mislabelled as another channel: ${socialCount}`)
console.log(`Rows attributed to a Stripe self-referral:         ${selfRefCount}`)

if (!APPLY) {
  const sample = await prisma.trackedEvent.findMany({
    where: { OR: [misSocial, selfRef] },
    take: 8,
    select: { createdAt: true, channel: true, source: true, medium: true, campaign: true },
  })
  console.log('\nSample of rows that would change:')
  for (const r of sample) {
    console.log(`  ${r.createdAt.toISOString()} ${r.channel} src=${r.source} med=${r.medium} camp=${r.campaign ?? '-'}`)
  }
  console.log('\nDry run — nothing written. Re-run with --apply to commit these changes.')
} else {
  const a = await prisma.trackedEvent.updateMany({ where: misSocial, data: { channel: 'paid_social' } })
  // Source is cleared too: the referrer was our own checkout, not a place the
  // visitor came from, so leaving it would keep polluting the sources table.
  const b = await prisma.trackedEvent.updateMany({ where: selfRef, data: { channel: 'direct', source: null } })
  console.log(`\nUpdated ${a.count} rows to paid_social.`)
  console.log(`Updated ${b.count} Stripe self-referral rows to direct.`)
}

await prisma.$disconnect()
