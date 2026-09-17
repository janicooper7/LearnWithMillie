// Stripe clamps day-of-month overruns when it advances a subscription's own
// billing cycle (Jan 31 -> Feb 28). Anything computing a date N months out to
// line up with a Stripe billing cycle (e.g. an installment plan's cancel_at)
// has to clamp the same way, or it can land a day short of — or past — the
// cycle boundary Stripe actually bills on.
export function addMonthsClamped(date: Date, months: number): Date {
  const day = date.getUTCDate()
  const d = new Date(date)
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const daysInTargetMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(day, daysInTargetMonth))
  return d
}
