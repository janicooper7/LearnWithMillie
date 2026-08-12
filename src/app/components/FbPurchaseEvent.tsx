'use client'

import { useEffect } from 'react'
import { fbTrackOnce } from '@/lib/fbPixel'

/**
 * Fires a Meta Purchase event once and renders nothing. For fixed-price products
 * whose confirmation is a server-rendered page rather than a redirect to
 * /thank-you — render it only when that page knows the visitor has just paid.
 *
 * `dedupeKey` must be stable and unique per sale: the same key is what stops a
 * refresh or a returning visit from reporting the purchase all over again.
 */
export default function FbPurchaseEvent({
  dedupeKey,
  value,
  contentName,
  currency = 'USD',
}: {
  dedupeKey: string
  value: number
  contentName: string
  currency?: string
}) {
  useEffect(() => {
    fbTrackOnce(
      `purchase:${dedupeKey}`,
      'Purchase',
      { value, currency, content_name: contentName },
      dedupeKey,
    )
  }, [dedupeKey, value, currency, contentName])

  return null
}
