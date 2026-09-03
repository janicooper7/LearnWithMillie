'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'
import { useDeferredThirdParty } from './useDeferredThirdParty'

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

  if (!FB_PIXEL_ID) return null

  return (
    <>
      {released && (
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
      )}
      {/* Outside the gate: a visitor without JavaScript never releases it,
          and this tracking pixel is the only thing that reaches them. */}
      <noscript>
        <img
          height='1'
          width='1'
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=''
        />
      </noscript>
    </>
  )
}
