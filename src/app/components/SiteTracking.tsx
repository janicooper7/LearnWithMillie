'use client'

// Records a page view on every public page, plus the automatic 'landed' step
// when that page belongs to a funnel. Explicit later steps (clicked enrol,
// reached checkout) are fired by the components that own those actions.

import { Suspense, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/trackClient'
import { funnelForPath, isTrackablePath } from '@/lib/tracking'

function PageTracker() {
  const pathname = usePathname()
  // Deduped per session: revisiting a page while browsing is not a new visit,
  // and session counts must not depend on how much someone clicked around.
  const seenPaths = useRef<Set<string>>(new Set())
  const seenFunnels = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!pathname || !isTrackablePath(pathname)) return

    if (!seenPaths.current.has(pathname)) {
      seenPaths.current.add(pathname)
      track(null, 'page_view')
    }

    const funnel = funnelForPath(pathname)
    if (funnel && !seenFunnels.current.has(funnel)) {
      seenFunnels.current.add(funnel)
      track(funnel, 'landed')
    }
  }, [pathname])

  return null
}

export default function SiteTracking() {
  return (
    <Suspense fallback={null}>
      <PageTracker />
    </Suspense>
  )
}
