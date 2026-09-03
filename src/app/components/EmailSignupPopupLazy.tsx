'use client'

import dynamic from 'next/dynamic'

/**
 * The popup cannot appear for the first five seconds of a visit and never
 * renders anything on the server, so there is no reason for its code to be in
 * the first-load bundle. This wrapper exists only because `ssr: false` is not
 * allowed in a server component, and the root layout is one.
 */
const EmailSignupPopup = dynamic(() => import('./EmailSignupPopup'), {
  ssr: false,
})

export default function EmailSignupPopupLazy() {
  return <EmailSignupPopup />
}
