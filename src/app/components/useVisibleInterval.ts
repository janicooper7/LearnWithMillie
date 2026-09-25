'use client'

import { useEffect } from 'react'

/**
 * setInterval that only runs while the tab is visible.
 *
 * Every poll is a database query, and Neon only suspends the database after 5
 * idle minutes. A dashboard or admin tab left open in the background used to
 * poll forever and keep the database awake around the clock, which is billed
 * compute for nobody. Here polling stops when the tab is hidden, and resumes
 * with an immediate fetch when it comes back, so nothing shown is stale.
 *
 * Also calls `fn` on mount and whenever `fn` changes, so callers don't need
 * their own initial fetch. Pass a stable (useCallback) function.
 */
export function useVisibleInterval(fn: () => void, ms: number) {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null

    const start = () => {
      if (timer) return
      fn()
      timer = setInterval(fn, ms)
    }
    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [fn, ms])
}
