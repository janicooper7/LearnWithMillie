'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'
import { useDeferredThirdParty } from './useDeferredThirdParty'
import { useConsent } from './useConsent'

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

function FacebookPixelTracker() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    if (!FB_PIXEL_ID) return

    // The init snippet sends the PageView for the page it loads on, so only
    // the client-side route changes after it belong here. Without this the
    // first page is counted twice.
    if (lastPathname.current === null) {
      lastPathname.current = pathname
      return
    }
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname

    if (typeof window.fbq !== 'function') return
    window.fbq('track', 'PageView')
  }, [pathname])

  return null
}

export default function FacebookPixel() {
  // fbevents.js is ~402KB of parsed JavaScript. See useDeferredThirdParty.
  const released = useDeferredThirdParty()
  // Never loads without an advertising opt-in from the cookie banner. There is
  // deliberately no <noscript> fallback pixel: a visitor without JavaScript
  // can't see the banner, so they can never have consented.
  const consent = useConsent()

  if (!FB_PIXEL_ID || !released || !consent?.marketing) return null

  return (
    <>
      <Script
        id='facebook-pixel'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `,
        }}
      />
      <Suspense fallback={null}>
        <FacebookPixelTracker />
      </Suspense>
    </>
  )
}
