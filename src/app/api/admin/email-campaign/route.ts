import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CAMPAIGNS, countRemaining, isCampaignKey, sendCampaign } from '@/lib/email/campaigns'
import { sendBrandedMail } from '@/lib/email/send'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function requireAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === 'ADMIN'
}

/**
 * Admin-only console for the one-off campaigns.
 *
 * GET  /api/admin/email-campaign                      — every campaign and how
 *                                                       many people it would
 *                                                       still reach
 * GET  /api/admin/email-campaign?key=…&preview=1      — the email itself,
 *                                                       rendered, so it can be
 *                                                       read before it is sent
 * POST /api/admin/email-campaign  { key, test: true } — one copy to your own
 *                                                       inbox, nobody else's
 * POST /api/admin/email-campaign  { key, limit }      — send one batch, for real
 *
 * The preview builds against a fake recipient rather than a real one, so
 * looking at an email can never be the thing that sends it. The test send has
 * no recipient parameter on purpose: it can only ever reach the address of the
 * admin who asked for it, so this can't be used as a relay.
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const key = req.nextUrl.searchParams.get('key')

  if (key) {
    if (!isCampaignKey(key)) {
      return NextResponse.json({ error: 'Unknown campaign' }, { status: 400 })
    }

    if (req.nextUrl.searchParams.get('preview')) {
      const { subject, html } = CAMPAIGNS[key].build({
        name: 'Sample Teacher',
        email: 'preview@example.com',
        unsubscribeUrl: null,
      })
      // Subject isn't visible in a rendered body, so it rides along in a header
      // where it can be read off the network tab without altering the HTML.
      return new NextResponse(html, {
        headers: { 'content-type': 'text/html; charset=utf-8', 'x-email-subject': subject },
      })
    }

    return NextResponse.json({
      key,
      description: CAMPAIGNS[key].description,
      remaining: await countRemaining(key),
    })
  }

  const campaigns = await Promise.all(
    Object.entries(CAMPAIGNS).map(async ([k, campaign]) => ({
      key: k,
      description: campaign.description,
      remaining: await countRemaining(k as never),
    }))
  )
  return NextResponse.json({ campaigns })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { key, limit, test } = await req.json().catch(() => ({}))
  if (typeof key !== 'string' || !isCampaignKey(key)) {
    return NextResponse.json({ error: 'Unknown campaign' }, { status: 400 })
  }

  // A single copy to the caller, to see how it actually lands in a mail client
  // rather than in a browser. It touches no campaign state at all, so a test
  // never marks anyone as sent and works before the migration has been run.
  if (test) {
    const to = session.user.email
    if (!to) return NextResponse.json({ error: 'No address on this account' }, { status: 400 })

    const { subject, html } = CAMPAIGNS[key].build({
      name: session.user.name ?? null,
      email: to,
      // No unsubscribe link on a test: the footer would offer to unsubscribe
      // the admin from their own sequence.
      unsubscribeUrl: null,
    })
    await sendBrandedMail({ to, subject, html, unsubscribeUrl: null })
    return NextResponse.json({ ok: true, test: true, to, subject })
  }

  // Capped well under what the function timeout allows for a slow SMTP hop;
  // the response says how many are left so the caller can post again.
  const size = Math.min(Math.max(Number(limit) || 40, 1), 100)

  try {
    return NextResponse.json({ ok: true, ...(await sendCampaign(key, { limit: size })) })
  } catch (err) {
    console.error('[admin/email-campaign]', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
