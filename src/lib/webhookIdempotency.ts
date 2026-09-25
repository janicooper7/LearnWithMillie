import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * At-most-once processing for inbound webhooks.
 *
 * Stripe and Cal.com both deliver at least once: a slow response (a Neon cold
 * start is enough) or a 5xx gets the same event sent again. Every handler here
 * moves credits with increment/decrement, so a second delivery would credit or
 * refund twice.
 *
 * `claimWebhook` inserts the key into ProcessedWebhook before any side effect.
 * The primary key makes the insert the lock: the first delivery wins, and any
 * copy, even one arriving concurrently, gets `false` and must acknowledge
 * without doing anything. If processing then fails, `releaseWebhook` removes
 * the claim so the sender's retry can run it properly.
 */
export async function claimWebhook(key: string): Promise<boolean> {
  try {
    await prisma.processedWebhook.create({ data: { id: key } })
    return true
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') return false
    throw err
  }
}

export async function releaseWebhook(key: string): Promise<void> {
  // A failed release only means the retry is treated as a duplicate; log it so
  // that case can be spotted and fulfilled by hand.
  await prisma.processedWebhook.deleteMany({ where: { id: key } }).catch((err) => {
    console.error('[webhook] Failed to release claim', key, err)
  })
}
