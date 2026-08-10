'use client'

// Fires the automatic 'landed' step whenever the visitor arrives on a page that
// belongs to a funnel. Explicit later steps (clicked enrol, reached checkout)
// are fired by the components that own those actions.

import { Suspense, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/trackClient'
import { funnelForPath } from '@/lib/tracking'

function LandingTracker() {
  const pathname = usePathname()
  // A funnel is only entered once per session — re-landing on the courses page
  // after browsing away shouldn't inflate the top of the funnel.
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => {
    const funnel = funnelForPath(pathname)
    if (!funnel) return
    if (seen.current.has(funnel)) return
    seen.current.add(funnel)
    track(funnel, 'landed')
  }, [pathname])

  return null
}

export default function SiteTracking() {
  return (
    <Suspense fallback={null}>
      <LandingTracker />
    </Suspense>
  )
}
