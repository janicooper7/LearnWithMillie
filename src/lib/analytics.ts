// GA4 event helper. The gtag scripts load after hydration, so a click that
// happens very early can find window.gtag undefined — guard rather than throw.
export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
