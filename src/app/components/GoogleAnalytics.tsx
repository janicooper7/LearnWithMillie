'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'
import { useDeferredThirdParty } from './useDeferredThirdParty'

// Replace with your Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string
        page_location?: string
        page_title?: string
        [key: string]: any
      }
    ) => void
  }
}

// Separate component for tracking
function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // gtag.js sends the page_view for the initial load itself, so only the
    // client-side route changes after it need to be tracked here.
    if (lastPathname.current === null) {
      lastPathname.current = pathname
      return
    }
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname

    // The gtag scripts load after hydration, so guard against an early effect
    if (typeof window.gtag !== 'function') return

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

export default function GoogleAnalytics() {
  // gtag.js is ~418KB of parsed JavaScript. It waits until the visitor has
  // done something, or until the deferral window closes.
  const released = useDeferredThirdParty()

  if (!GA_MEASUREMENT_ID || !released) return null

  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  )
}
