// Single source of truth for the current course discount.
//
// The sale strip, the landing popup and any price maths all read from here, so
// the code can never say one thing in one place and something else in another.
// The `code` must match an ACTIVE promotion code in Stripe — Stripe checkout is
// created with `allow_promotion_codes`, so customers type it in themselves.

export const PROMO = {
  code: 'SAVE25',
  percentOff: 25,
} as const

/** Price after the promo, formatted for display (e.g. 149 -> "$111.75"). */
export function discountedPrice(price: number): string {
  const after = price * (1 - PROMO.percentOff / 100)
  // Whole dollars stay clean; anything with cents keeps exactly two decimals.
  return `$${Number.isInteger(after) ? after : after.toFixed(2)}`
}
