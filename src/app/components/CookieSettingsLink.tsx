'use client'

import { openConsentSettings } from '@/lib/consent'

/** Footer link that re-opens the cookie banner, so consent can be withdrawn
 *  as easily as it was given. */
export default function CookieSettingsLink({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <button type='button' onClick={openConsentSettings} className={className} style={style}>
      Cookie settings
    </button>
  )
}
