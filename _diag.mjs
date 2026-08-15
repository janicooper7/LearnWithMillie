import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
const { PrismaClient } = await import('@prisma/client')
const { PrismaPg } = await import('@prisma/adapter-pg')
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

const host = (process.env.DATABASE_URL || '').match(/@([^/?]+)/)?.[1] ?? 'unknown'
console.log('local .env.local DB host:', host)

const total = await prisma.trackedEvent.count()
console.log('TrackedEvent rows total:', total)

const rows = await prisma.trackedEvent.findMany({
  orderBy: { createdAt: 'desc' },
  take: 25,
  select: { visitorId: true, sessionId: true, funnel: true, step: true, path: true, channel: true, createdAt: true },
})
for (const r of rows) {
  console.log(` ${r.createdAt.toISOString()} | ${r.visitorId.slice(0, 10)} | ${String(r.funnel)}/${r.step} | ${r.path} | ${r.channel}`)
}

await prisma.$disconnect()
