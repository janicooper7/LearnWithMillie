'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { trackEvent } from '@/lib/analytics'
import { track, trackingContext } from '@/lib/trackClient'
import { fbTrack } from '@/lib/fbPixel'

// Shared enrol -> Stripe flow for the course CTAs.
//
// Every CTA has to fire the same three trackers with the same shape, and a
// signed-out click has to land on signup rather than dead-ending at checkout.
// `ctaLocation` is the one thing that differs between call sites, so which
// button earned the purchase stays visible in reporting.
export function useCourseCheckout() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  async function enrol({
    plan,
    planName,
    ctaLocation,
    price,
    next = '/teachers/courses',
  }: {
    plan: string
    planName: string
    ctaLocation: string
    /** What the customer actually pays, i.e. after the promo. */
    price: number
    next?: string
  }) {
    // Fired for every click, signed in or not — a signed-out click never
    // reaches Stripe, so the two need telling apart in reporting.
    trackEvent('enrol_click', {
      plan,
      plan_name: planName,
      cta_location: ctaLocation,
      signed_in: Boolean(session),
      value: price,
      currency: 'USD',
    })
    track('courses', 'enrol_click')

    if (!session) {
      window.location.href = `/auth/signup?type=teacher&next=${encodeURIComponent(next)}`
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, tracking: trackingContext() }),
      })
      const data = await res.json()
      if (data.url) {
        trackEvent('begin_checkout', {
          currency: 'USD',
          value: price,
          items: [{ item_id: plan, item_name: planName, price }],
        })
        track('courses', 'checkout_start', { value: price })
        fbTrack('InitiateCheckout', {
          value: price,
          currency: 'USD',
          content_name: planName,
          content_ids: [plan],
          content_type: 'product',
        })
        window.location.href = data.url
      } else setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  return { enrol, loading, signedIn: Boolean(session) }
}
