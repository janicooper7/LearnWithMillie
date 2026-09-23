'use client'

// Cookie consent (PECR regulation 6).
//
// Two categories, because they carry different legal weight:
//   - analytics: Google Analytics, plus the first-party funnel tracker.
//   - marketing: the Meta and TikTok pixels.
//
// Third-party tags need an opt-in before they load. The first-party tracker is
// treated differently: under the Data (Use and Access) Act 2025 exemption for
// statistical analytics it may run by default, provided it is explained in the
// cookie policy and stops the moment someone says no. So it runs unless
// analytics has been explicitly refused.
//
// The choice lives in localStorage and is announced on a window event, so the
// tags in <head>, the banner and the footer link all stay in step without
// sharing a React context.

export type ConsentChoice = {
  analytics: boolean
  marketing: boolean
  /** When the choice was made, ms since epoch. */
  at: number
  /** Bumped whenever the categories change, which re-asks everyone. */
  v: number
}

export const CONSENT_VERSION = 1
const STORAGE_KEY = 'lwm:consent'
const CHANGE_EVENT = 'lwm:consent-change'
const OPEN_EVENT = 'lwm:consent-open'

export function readConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentChoice
    return parsed.v === CONSENT_VERSION ? parsed : null
  } catch {
    return null
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }) {
  const value: ConsentChoice = { ...choice, at: Date.now(), v: CONSENT_VERSION }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Storage blocked — the choice still applies for this page view via the
    // event below, and the banner will ask again next time.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }))
}

/** Subscribe to consent changes. Returns the unsubscribe function. */
export function onConsentChange(listener: (choice: ConsentChoice) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<ConsentChoice>).detail)
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}

/** Re-opens the banner, e.g. from the "Cookie settings" footer link. */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onConsentOpen(listener: () => void): () => void {
  window.addEventListener(OPEN_EVENT, listener)
  return () => window.removeEventListener(OPEN_EVENT, listener)
}

/** Whether the first-party tracker may run: yes unless analytics was refused. */
export function firstPartyAnalyticsAllowed(): boolean {
  const choice = readConsent()
  return choice ? choice.analytics : true
}
