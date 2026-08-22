/**
 * Netlify's scheduler for the onboarding drip.
 *
 * The work itself lives in the Next.js route (src/app/api/cron/email-journey),
 * which owns the DB and the SMTP transport; this function exists only to call
 * it on a schedule. Keeping the logic on the route means the endpoint stays
 * independently testable with a curl, and this file never needs Prisma bundled
 * into it.
 *
 * Note for anyone moving the site: `vercel.json` carries the same schedule for
 * Vercel, which ignores this file, and Netlify ignores that one. Whichever host
 * the site is on, exactly one of the two is live — change both or the drip
 * silently stops.
 */

/** Netlify injects URL as the site's primary address at runtime. */
function cronEndpoint(): string {
  const base = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
  return `${base.replace(/\/$/, '')}/api/cron/email-journey`
}

export default async () => {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // Same posture as the route: fail closed and say so, rather than calling it
    // unauthenticated and logging a 401 every hour.
    console.error('[netlify/email-journey] CRON_SECRET is not set — refusing to run')
    return new Response('Not configured', { status: 503 })
  }

  const res = await fetch(cronEndpoint(), {
    headers: { authorization: `Bearer ${secret}` },
  })
  const body = await res.text()

  if (!res.ok) {
    console.error('[netlify/email-journey]', res.status, body)
    return new Response(`Cron run failed: ${res.status}`, { status: 500 })
  }

  console.log('[netlify/email-journey]', body)
  return new Response(body, { status: 200 })
}

/**
 * Hourly, not daily.
 *
 * Steps are due at signup time + delayDays, so a daily run only sends a step
 * once the clock passes its offset *and* the next run comes round: somebody who
 * signs up at 10:00 with a one-day step is not due at the 09:00 run the
 * following morning, and waits until 09:00 the day after — 47 hours for an
 * email the sequence calls 24. Running hourly keeps every step within an hour
 * of its intended offset. The run is a single indexed query that returns
 * nothing in most hours.
 */
export const config = { schedule: '0 * * * *' }
