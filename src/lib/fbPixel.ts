'use client'

// Meta pixel standard events.
//
// The base pixel is injected by <FacebookPixel /> with strategy 'afterInteractive',
// and ad blockers stop it outright for a fair share of visitors, so window.fbq is
// never assumed to exist — a missing pixel drops the event silently rather than
// throwing from inside a checkout handler.

export type FbEventParams = {
  value?: number
  currency?: string
  content_name?: string
  content_ids?: string[]
  content_type?: string
  num_items?: number
}

/**
 * `eventId` is Meta's deduplication key. Passing the Stripe session id means a
 * later Conversions API call can send the same id for the same sale and have
 * Meta count it once instead of twice.
 */
export function fbTrack(event: string, params?: FbEventParams, eventId?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return

  if (eventId) window.fbq('track', event, params ?? {}, { eventID: eventId })
  else window.fbq('track', event, params ?? {})
}

const ONCE_PREFIX = 'lwm:fbq:'

/**
 * Fire an event at most once per key on this browser, ever. Every purchase
 * confirmation here is reachable by refresh, back button or bookmarked link,
 * and each of those would otherwise report a fresh sale to Meta.
 */
export function fbTrackOnce(
  key: string,
  event: string,
  params?: FbEventParams,
  eventId?: string,
) {
  if (typeof window === 'undefined') return

  const storageKey = `${ONCE_PREFIX}${key}`
  try {
    if (localStorage.getItem(storageKey)) return
    localStorage.setItem(storageKey, '1')
  } catch {
    // Storage blocked — a possible duplicate beats losing the conversion.
  }

  fbTrack(event, params, eventId)
}
