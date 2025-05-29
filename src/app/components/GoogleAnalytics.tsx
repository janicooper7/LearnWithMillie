'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, Suspense } from 'react'

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

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Track page views
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

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
              page_path: window.location.pathname,
              send_page_view: false
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
