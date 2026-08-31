/**
 * The standing discount offered for joining the email list.
 *
 * Single source of truth: the popup, the success screen and the welcome email
 * all read from here, so the site can never advertise one number and the email
 * quote another.
 *
 * `code` must match an ACTIVE promotion code in Stripe with the same percentage
 * off and no product restriction — the offer is 10% off whatever they start
 * with, and a coupon limited to a couple of products would honour it on some
 * pages and silently fail on others. Nothing attaches this code automatically:
 * /api/checkout already sets `allow_promotion_codes`, so the customer types it
 * into Stripe's own promo box.
 *
 * The copy promises a *first order*, so the Stripe promotion code must carry
 * the matching restriction (`restrictions.first_time_transaction`). Without it
 * the code keeps working on every subsequent order and the site is quietly
 * giving a standing 10% discount to everyone who ever signed up.
 *
 * It is one shared code rather than one per subscriber, which means it will
 * eventually leak. That is the accepted trade-off for having nothing to
 * generate or expire; if it ever shows up on a coupon site, retire it in
 * Stripe, put a fresh code here, and everyone who signs up after gets the new
 * one.
 */
export const SIGNUP_OFFER = {
  code: 'WELCOME10',
  percentOff: 10,
} as const

/** "10% off" — used in headlines and email copy so the wording can't drift. */
export const SIGNUP_OFFER_LABEL = `${SIGNUP_OFFER.percentOff}% off`

/** The offer stated in full. The "first order" half is a real limit enforced by
 *  the Stripe code, so it travels with the percentage wherever that is shown. */
export const SIGNUP_OFFER_HEADLINE = `${SIGNUP_OFFER_LABEL} your first order`
