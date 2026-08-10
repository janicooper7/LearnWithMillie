'use client'

// Browser side of the first-party analytics.
//
// Identity is deliberately minimal: a random visitor id kept in localStorage
// and a session id that expires after 30 idle minutes. No personal data, no
// cross-site identifiers — everything here is first-party and scoped to this
// domain, which is also why it needs no cookie banner.

import { deriveChannel, type FunnelKey } from '@/lib/tracking'

const VISITOR_KEY = 'lwm:vid'
const SESSION_KEY = 'lwm:sid'
const SESSION_TS_KEY = 'lwm:sid_ts'
const ATTRIBUTION_KEY = 'lwm:attr'
const SESSION_IDLE_MS = 30 * 60 * 1000

// Click ids appended by ad platforms — presence alone proves a paid click even
// when whoever built the ad forgot the utm tags.
const CLICK_IDS = ['gclid', 'fbclid', 'ttclid', 'msclkid']

export type Attribution = {
  channel: string
  source: string | null
  medium: string | null
  campaign: string | null
}

function randomId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

function readStore(store: Storage, key: string): string | null {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

function writeStore(store: Storage, key: string, value: string) {
  try {
    store.setItem(key, value)
  } catch {
    // Private mode or storage disabled — tracking degrades to per-request ids.
  }
}

function getVisitorId(): string {
  const existing = readStore(localStorage, VISITOR_KEY)
  if (existing) return existing
  const id = randomId()
  writeStore(localStorage, VISITOR_KEY, id)
  return id
}

/** Session id, rolled over after 30 minutes of inactivity. */
function getSessionId(): { id: string; isNew: boolean } {
  const now = Date.now()
  const existing = readStore(sessionStorage, SESSION_KEY)
  const lastSeen = Number(readStore(sessionStorage, SESSION_TS_KEY) ?? 0)

  if (existing && now - lastSeen < SESSION_IDLE_MS) {
    writeStore(sessionStorage, SESSION_TS_KEY, String(now))
    return { id: existing, isNew: false }
  }

  const id = randomId()
  writeStore(sessionStorage, SESSION_KEY, id)
  writeStore(sessionStorage, SESSION_TS_KEY, String(now))
  return { id, isNew: true }
}

/**
 * Attribution for the current session, captured from the landing URL the first
 * time it's needed and then frozen. Freezing matters: without it, an internal
 * navigation with no utm tags would relabel a paid visit as direct.
 */
function getAttribution(isNewSession: boolean): Attribution {
  if (!isNewSession) {
    const cached = readStore(sessionStorage, ATTRIBUTION_KEY)
    if (cached) {
      try {
        return JSON.parse(cached) as Attribution
      } catch {
        // Corrupt value — fall through and recompute from the current URL.
      }
    }
  }

  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')
  const hasClickId = CLICK_IDS.some((id) => params.has(id))

  // An internal referrer means this isn't really the session's entry point.
  let referrer = document.referrer || ''
  try {
    if (referrer && new URL(referrer).host === window.location.host) referrer = ''
  } catch {
    referrer = ''
  }

  const attribution: Attribution = {
    channel: deriveChannel({ source, medium, referrer, hasClickId }),
    source: source ?? (referrer ? safeHost(referrer) : null),
    medium: medium ?? null,
    campaign: campaign ?? null,
  }

  writeStore(sessionStorage, ATTRIBUTION_KEY, JSON.stringify(attribution))
  return attribution
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

/**
 * Record one funnel step. Fire-and-forget: analytics must never delay or break
 * the thing the visitor actually came to do, so every failure is swallowed.
 */
export function track(funnel: FunnelKey | null, step: string, extra?: { value?: number }) {
  if (typeof window === 'undefined') return

  try {
    const visitorId = getVisitorId()
    const { id: sessionId, isNew } = getSessionId()
    const attribution = getAttribution(isNew)

    const body = JSON.stringify({
      visitorId,
      sessionId,
      funnel,
      step,
      path: window.location.pathname,
      ...attribution,
      ...extra,
    })

    // keepalive lets the request outlive the page during a checkout redirect.
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Storage or network unavailable — drop the event silently.
  }
}

/**
 * Tracking ids for the current session, handed to the checkout APIs so the
 * Stripe webhook can attribute the eventual purchase back to this visit.
 */
export function trackingContext(): { visitorId: string; sessionId: string } | null {
  if (typeof window === 'undefined') return null
  try {
    return { visitorId: getVisitorId(), sessionId: getSessionId().id }
  } catch {
    return null
  }
}
