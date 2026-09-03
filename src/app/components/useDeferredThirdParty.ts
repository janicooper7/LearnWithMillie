'use client'

import { useEffect, useState } from 'react'

/**
 * Holds third-party tags back until the page has finished its own work.
 *
 * Between them GA, the Meta pixel and the TikTok pixel are ~250KB over the
 * wire and ~830KB of JavaScript to parse. On `afterInteractive` all of that
 * runs while React is still hydrating, so it competes with the site's own
 * code for the main thread at exactly the moment blocking time is measured.
 *
 * Whichever of these comes first releases them:
 *   - the visitor does anything at all (tap, key, scroll, wheel), or
 *   - RELEASE_AFTER_MS elapses.
 *
 * The trade is real: someone who leaves inside RELEASE_AFTER_MS without
 * touching the page is never counted. That slice is small and low-intent —
 * and largely already lost, since the tags used to load late enough to miss
 * a fast bounce anyway — but it is not zero. Raise or lower the one constant
 * below to move the line between analytics coverage and load speed.
 */

const RELEASE_AFTER_MS = 3500

/** Anything a real visitor does first. All passive; none block scrolling. */
const INTERACTION_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel']

export function useDeferredThirdParty(): boolean {
  const [released, setReleased] = useState(false)

  useEffect(() => {
    let done = false

    const release = () => {
      if (done) return
      done = true
      teardown()
      setReleased(true)
    }

    const teardown = () => {
      window.clearTimeout(timer)
      INTERACTION_EVENTS.forEach((name) =>
        window.removeEventListener(name, release)
      )
    }

    const timer = window.setTimeout(release, RELEASE_AFTER_MS)
    INTERACTION_EVENTS.forEach((name) =>
      window.addEventListener(name, release, { once: true, passive: true })
    )

    return teardown
  }, [])

  return released
}
