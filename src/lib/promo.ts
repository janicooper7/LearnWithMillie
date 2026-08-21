// Single source of truth for the current course discount.
//
// The sale strip and every price shown on the course pages read from here, so
// the sale can never say one thing in one place and something else in another.
// The `code` must match an ACTIVE promotion code in Stripe — /api/checkout
// attaches it to course checkout sessions itself, so the customer never has to
// type it and the Stripe page shows the same price the site advertised.
//
// The deadline is a real one: once `endsAt` passes, prices across the site
// revert to list and /api/checkout stops attaching the code. Set the same
// expiry on the Stripe promotion code so the two can't disagree at the border.

export const PROMO = {
  code: 'SEPTEMBER',
  percentOff: 30,
  // 23:59:59 on 31 August 2026 in Europe/London (BST, UTC+1). Stored as an
  // absolute instant so it means the same moment for every visitor, wherever
  // they are — the strip renders it in their own timezone.
  endsAt: new Date('2026-08-31T22:59:59Z'),
} as const

/** The timezone the deadline is set in — what the UK sees, and the SSR default. */
export const PROMO_TIMEZONE = 'Europe/London'

/** Locale used to render the deadline on the server and for non-English visitors. */
export const PROMO_LOCALE = 'en-GB'

/** Whether the sale is still running. Everything price-related goes through this. */
export function isPromoActive(now: Date = new Date()): boolean {
  return PROMO.percentOff > 0 && now.getTime() < PROMO.endsAt.getTime()
}

/** Price after the promo, as a number (e.g. 149 -> 111.75). List price once it ends. */
export function discountedAmount(price: number): number {
  if (!isPromoActive()) return price
  return Math.round(price * (1 - PROMO.percentOff / 100) * 100) / 100
}

/** Price after the promo, formatted for display (e.g. 149 -> "$111.75"). */
export function discountedPrice(price: number): string {
  const after = discountedAmount(price)
  // Whole dollars stay clean; anything with cents keeps exactly two decimals.
  return `$${Number.isInteger(after) ? after : after.toFixed(2)}`
}
