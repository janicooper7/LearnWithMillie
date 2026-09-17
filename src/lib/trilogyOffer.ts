// Single source of truth for the "ends tonight" BOOKED Trilogy sale.
//
// There is no real end date: the strip counts down to the visitor's own
// midnight, and at midnight it simply starts again. The sale runs until
// `enabled` is flipped to false here and the site is redeployed — that one
// switch turns off the strip, the struck-through prices and the discount
// /api/checkout attaches, so they can never disagree.
//
// `code` must match an ACTIVE Stripe promotion code with the same percentage
// off that applies to the trilogy product. SAVE25 is 25% off and covers it.
// The discount is attached to trilogy ('course-full') checkouts only — single
// courses stay at list price.

export const TRILOGY_OFFER = {
  enabled: true,
  code: 'SAVE25',
  percentOff: 25,
  plan: 'course-full',
} as const

export const TRILOGY_LIST_PRICE = 149

/** What the trilogy costs right now, as a number (149 -> 111.75). */
export function trilogyPrice(): number {
  if (!TRILOGY_OFFER.enabled) return TRILOGY_LIST_PRICE
  return Math.round(TRILOGY_LIST_PRICE * (1 - TRILOGY_OFFER.percentOff / 100) * 100) / 100
}

// Pay-in-3 plan. The monthly amount is derived from `trilogyPrice()`, so the
// sale — including the moment it's switched off above — is reflected here too
// without a separate Stripe coupon to keep in sync.
export const TRILOGY_INSTALLMENT_PLAN = 'course-full-3mo'
export const TRILOGY_INSTALLMENTS = 3

/** What each of the 3 monthly charges is, right now (111.75 -> 37.25). */
export function trilogyInstallmentAmount(): number {
  return Math.round((trilogyPrice() / TRILOGY_INSTALLMENTS) * 100) / 100
}

/** Formats a dollar amount, keeping whole dollars clean ($149, $111.75). */
export function formatUsd(amount: number): string {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}
