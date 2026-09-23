import { prisma } from '@/lib/prisma'
import { RETENTION } from '@/lib/retentionPolicy'

// Data retention (UK GDPR Article 5(1)(e), storage limitation).
//
// The periods live in src/lib/retentionPolicy.ts, which the privacy policy
// page reads too, so the promise and the behaviour can't drift apart.
//
// Run from the hourly email cron. Each query is a small indexed delete that
// usually matches nothing, so running it hourly costs next to nothing and means
// there is no second schedule to keep alive on two hosts.

const DAY_MS = 24 * 60 * 60 * 1000


function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS)
}

export async function runRetention(): Promise<Record<string, number>> {
  const [trackedEvents, unpaidReports, expiredTokens, minimisedSubscribers] = await Promise.all([
    prisma.trackedEvent.deleteMany({
      where: { createdAt: { lt: daysAgo(RETENTION.trackedEventDays) } },
    }),
    prisma.platformFinderResult.deleteMany({
      where: { paid: false, createdAt: { lt: daysAgo(RETENTION.unpaidPlatformFinderDays) } },
    }),
    prisma.verificationToken.deleteMany({ where: { expires: { lt: new Date() } } }),
    prisma.subscriber.updateMany({
      where: {
        unsubscribedAt: { lt: daysAgo(RETENTION.unsubscribedMinimiseDays) },
        OR: [{ name: { not: null } }, { source: { not: null } }],
      },
      data: { name: null, source: null },
    }),
  ])

  return {
    trackedEvents: trackedEvents.count,
    unpaidReports: unpaidReports.count,
    expiredTokens: expiredTokens.count,
    minimisedSubscribers: minimisedSubscribers.count,
  }
}
