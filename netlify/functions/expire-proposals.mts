/**
 * Netlify's scheduler for releasing unanswered proposed times.
 *
 * Same shape as email-journey.mts: the work lives in the Next.js route
 * (src/app/api/cron/expire-proposals), and this only calls it on a schedule.
 *
 * Note for anyone moving the site: `vercel.json` carries the same schedule for
 * Vercel, which ignores this file, and Netlify ignores that one. Whichever host
 * the site is on, exactly one of the two is live — change both or held slots
 * are never given back.
 */

/** Netlify injects URL as the site's primary address at runtime. */
function cronEndpoint(): string {
  const base = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
  return `${base.replace(/\/$/, '')}/api/cron/expire-proposals`
}

export default async () => {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[netlify/expire-proposals] CRON_SECRET is not set — refusing to run')
    return new Response('Not configured', { status: 503 })
  }

  const res = await fetch(cronEndpoint(), {
    headers: { authorization: `Bearer ${secret}` },
  })
  const body = await res.text()

  if (!res.ok) {
    console.error('[netlify/expire-proposals]', res.status, body)
    return new Response(`Cron run failed: ${res.status}`, { status: 500 })
  }

  console.log('[netlify/expire-proposals]', body)
  return new Response(body, { status: 200 })
}

/**
 * Hourly, half past — offset from the drip cron on the hour so the two runs
 * don't overlap on a cold start.
 *
 * Hourly rather than daily because the thing being released is calendar time:
 * a proposal that lapsed at 10:00 should be bookable by someone else that
 * morning, not the following day. The run is a single indexed query that
 * returns nothing in most hours.
 */
export const config = { schedule: '30 * * * *' }
