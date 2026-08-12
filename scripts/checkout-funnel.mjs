// Counts Stripe Checkout Sessions created in a window.
// One session created == one person sent to the checkout page.
import 'dotenv/config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const DAYS = Number(process.argv[2] ?? 30)
const since = Math.floor(Date.now() / 1000) - DAYS * 86400

const byStatus = {}
const byDay = {}
const byPrice = {}
let total = 0
let revenue = 0

for await (const s of stripe.checkout.sessions.list({
  created: { gte: since },
  limit: 100,
  expand: ['data.line_items'],
})) {
  total++
  byStatus[s.status] = (byStatus[s.status] ?? 0) + 1
  const day = new Date(s.created * 1000).toISOString().slice(0, 10)
  byDay[day] ??= { created: 0, complete: 0 }
  byDay[day].created++
  if (s.status === 'complete') {
    byDay[day].complete++
    revenue += (s.amount_total ?? 0) / 100
  }
  const item = s.line_items?.data?.[0]
  const name = item?.description ?? item?.price?.id ?? 'unknown'
  byPrice[name] ??= { reached: 0, paid: 0 }
  byPrice[name].reached++
  if (s.status === 'complete') byPrice[name].paid++
}

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—')

console.log(`\nCheckout sessions created in the last ${DAYS} days: ${total}`)
console.log(`  (= people who reached the Stripe checkout page)\n`)
console.log('By status:')
for (const [k, v] of Object.entries(byStatus)) {
  console.log(`  ${k.padEnd(10)} ${String(v).padStart(4)}  ${pct(v, total)}`)
}
console.log(`\nCompleted revenue: $${revenue.toFixed(2)}`)

console.log('\nBy product:')
for (const [k, v] of Object.entries(byPrice).sort((a, b) => b[1].reached - a[1].reached)) {
  console.log(`  ${k.slice(0, 40).padEnd(42)} reached ${String(v.reached).padStart(3)}  paid ${String(v.paid).padStart(3)}  ${pct(v.paid, v.reached)}`)
}

console.log('\nBy day (reached / paid):')
for (const [d, v] of Object.entries(byDay).sort()) {
  console.log(`  ${d}  ${String(v.created).padStart(3)} / ${String(v.complete).padStart(3)}`)
}
console.log()
