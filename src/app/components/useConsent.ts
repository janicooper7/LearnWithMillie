'use client'

import { useEffect, useState } from 'react'
import { onConsentChange, readConsent, type ConsentChoice } from '@/lib/consent'

/**
 * The visitor's current cookie choice, or null if they haven't made one.
 * Starts null on every render pass until mounted, so nothing gated on it can
 * load during server rendering or hydration.
 */
export function useConsent(): ConsentChoice | null {
  const [choice, setChoice] = useState<ConsentChoice | null>(null)

  useEffect(() => {
    setChoice(readConsent())
    return onConsentChange(setChoice)
  }, [])

  return choice
}
