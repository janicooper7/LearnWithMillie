// Single source of truth for the current course discount.
//
// The sale strip and every price shown on the course pages read from here, so
// the sale can never say one thing in one place and something else in another.
// The `code` must match an ACTIVE promotion code in Stripe — /api/checkout
// attaches it to course checkout sessions itself, so the customer never has to
// type it and the Stripe page shows the same price the site advertised.

export const PROMO = {
  code: 'SEPTEMBER',
  percentOff: 30,
} as const

/** Price after the promo, as a number (e.g. 149 -> 111.75). */
export function discountedAmount(price: number): number {
  return Math.round(price * (1 - PROMO.percentOff / 100) * 100) / 100
}

/** Price after the promo, formatted for display (e.g. 149 -> "$111.75"). */
export function discountedPrice(price: number): string {
  const after = discountedAmount(price)
  // Whole dollars stay clean; anything with cents keeps exactly two decimals.
  return `$${Number.isInteger(after) ? after : after.toFixed(2)}`
}
