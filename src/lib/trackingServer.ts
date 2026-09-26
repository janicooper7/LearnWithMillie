// Server helpers that bridge Stripe checkout and the first-party analytics.
//
// The browser knows which visit is buying; the Stripe webhook knows what was
// actually paid for. Stripe metadata is the only channel between them, so the
// visit's ids ride along on the checkout session and come back on the webhook.

import { prisma } from '@/lib/prisma'
import { UNTRACKED_CHANNEL, type FunnelKey } from '@/lib/tracking'

type TrackingInput = { visitorId?: unknown; sessionId?: unknown } | null | undefined

/** Stripe metadata keys carrying the visit. Values are strings — Stripe's rule. */
export function trackingMetadata(
  tracking: TrackingInput,
  funnel: FunnelKey
): Record<string, string> {
  const visitorId = typeof tracking?.visitorId === 'string' ? tracking.visitorId.slice(0, 64) : null
  const sessionId = typeof tracking?.sessionId === 'string' ? tracking.sessionId.slice(0, 64) : null
  if (!visitorId || !sessionId) return {}
  return { trackVisitorId: visitorId, trackSessionId: sessionId, trackFunnel: funnel }
}

/**
 * Record a completed purchase against the visit that started it.
 *
 * Attribution is copied from the session's earlier events rather than recomputed
 * — by the time Stripe calls back, the utm tags are long gone, and the channel
 * that earned the sale is the one from the landing, not from the return URL.
 */
export async function recordPurchase(
  checkoutSessionId: string,
  metadata: Record<string, string> | null | undefined,
  value: number
) {
  const visitorId = metadata?.trackVisitorId
  const sessionId = metadata?.trackSessionId
  const funnel = metadata?.trackFunnel
  if (!visitorId || !sessionId || !funnel) {
    await recordUntrackedPurchase(checkoutSessionId, metadata, value)
    return
  }

  try {
    const origin = await prisma.trackedEvent.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      select: { channel: true, source: true, medium: true, campaign: true, path: true },
    })

    await prisma.trackedEvent.create({
      data: {
        visitorId,
        sessionId,
        funnel,
        step: 'purchased',
        path: origin?.path ?? '/',
        channel: origin?.channel ?? 'direct',
        source: origin?.source ?? null,
        medium: origin?.medium ?? null,
        campaign: origin?.campaign ?? null,
        value,
      },
    })
  } catch (err: any) {
    // A purchase must never fail because analytics did.
    console.error('recordPurchase error:', err.message)
  }
}

/** Which funnel a sale belongs to, read off the checkout's own metadata. */
function funnelFromCheckout(metadata: Record<string, string> | null | undefined): FunnelKey {
  if (metadata?.kind === 'platform-finder') return 'platform-finder'
  if (metadata?.kind === 'debate-generator') return 'debate'
  if (metadata?.courseSlug || metadata?.kind === 'course-installment') return 'courses'
  return 'lessons'
}

/**
 * Record a sale whose buyer refused analytics, so report revenue matches Stripe.
 *
 * There's no visit to attach it to and none is invented: the ids are derived
 * from the Stripe checkout (which also makes a webhook retry a no-op) and the
 * channel says plainly that the source is unknown.
 */
async function recordUntrackedPurchase(
  checkoutSessionId: string,
  metadata: Record<string, string> | null | undefined,
  value: number
) {
  const id = `stripe:${checkoutSessionId}`
  try {
    const existing = await prisma.trackedEvent.findFirst({
      where: { sessionId: id, step: 'purchased' },
      select: { id: true },
    })
    if (existing) return

    await prisma.trackedEvent.create({
      data: {
        visitorId: id,
        sessionId: id,
        funnel: funnelFromCheckout(metadata),
        step: 'purchased',
        path: '/',
        channel: UNTRACKED_CHANNEL,
        value,
      },
    })
  } catch (err: any) {
    console.error('recordUntrackedPurchase error:', err.message)
  }
}
