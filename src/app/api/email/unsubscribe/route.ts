import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifySubscriberUnsubscribeToken,
  verifyUnsubscribeToken,
} from '@/lib/email/unsubscribe'
import { BORDER, CREAM, GOLD, GREEN, siteUrl } from '@/lib/email/shell'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One-click unsubscribe for the onboarding sequences and the marketing list.
 *
 * GET is the link in the footer; POST is what a mail client fires for the
 * List-Unsubscribe-Post header. Neither asks the reader to confirm or log in —
 * an unsubscribe that takes more than one click gets reported as spam instead,
 * and that costs far more than the subscriber does.
 *
 * `u` is a registered user's journey; `s` is a popup subscriber with no
 * account. The two are separate tables with separately namespaced tokens, so a
 * link can only ever be *presented* by the list it was minted for — but the
 * person clicking it is one person, and they are opting out of hearing from
 * Millie, not out of one of two database tables they have never heard of. So
 * whichever link is used, the address comes off both.
 */

/**
 * Opts an email address out of every marketing list it appears on.
 *
 * Matched case-insensitively because the two tables normalise differently:
 * /api/subscribe lowercases before writing, while registration stores whatever
 * the person typed. A exact-match join would let "Sam@x.com" keep receiving
 * journey emails after "sam@x.com" unsubscribed, which is the whole failure
 * this function exists to prevent.
 */
async function unsubscribeEverywhere(email: string): Promise<void> {
  const match = { equals: email, mode: 'insensitive' as const }
  const now = new Date()

  // followUpNextAt cleared alongside the opt-out so the drip's "what is due"
  // query stops returning them at all, rather than picking them up every hour
  // and dropping them again on the unsubscribedAt check. The track and step
  // itself is kept, so a re-subscribe still knows where they got to.
  await prisma.subscriber.updateMany({
    where: { email: match, unsubscribedAt: null },
    data: { unsubscribedAt: now, followUpNextAt: null },
  })

  // Resolved to ids first rather than filtered through the relation, so the
  // case-insensitive match is applied by the same query planner path in both
  // halves of this function.
  const users = await prisma.user.findMany({ where: { email: match }, select: { id: true } })
  if (users.length === 0) return

  await prisma.emailJourney.updateMany({
    where: { userId: { in: users.map((u) => u.id) } },
    data: { unsubscribedAt: now, nextSendAt: null },
  })
}

async function unsubscribe(req: Request): Promise<boolean> {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('u')
  const subscriberId = searchParams.get('s')
  const token = searchParams.get('t')

  if (!token) return false

  if (subscriberId) {
    if (!verifySubscriberUnsubscribeToken(subscriberId, token)) return false

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
      select: { email: true },
    })

    // updateMany rather than update: an id that no longer exists (a row Millie
    // deleted) should still render the confirmation page, not a 500.
    await prisma.subscriber.updateMany({
      where: { id: subscriberId, unsubscribedAt: null },
      data: { unsubscribedAt: new Date(), followUpNextAt: null },
    })

    if (subscriber) await unsubscribeEverywhere(subscriber.email)

    return true
  }

  if (!userId || !verifyUnsubscribeToken(userId, token)) return false

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })

  // Marketing only. Password resets, booking confirmations and receipts are
  // transactional and keep sending.
  //
  // Done by id as well as by address so the link still works for a user row
  // that has since lost or changed its email.
  await prisma.emailJourney.updateMany({
    where: { userId },
    data: { unsubscribedAt: new Date(), nextSendAt: null },
  })

  if (user) await unsubscribeEverywhere(user.email)

  return true
}

function page(title: string, message: string, status: number): NextResponse {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${title} · LearnWithMillie</title>
  </head>
  <body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;">
      <div style="max-width:460px;width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:18px;padding:36px 32px;text-align:center;">
        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-weight:600;margin-bottom:12px;">LearnWithMillie</div>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;color:${GREEN};margin:0 0 14px 0;">${title}</h1>
        <p style="font-size:15px;line-height:1.65;color:rgba(31,58,52,0.75);margin:0 0 24px 0;">${message}</p>
        <a href="${siteUrl()}" style="display:inline-block;background:${GOLD};color:${GREEN};text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;border-radius:10px;">Back to the site</a>
      </div>
    </div>
  </body>
</html>`

  return new NextResponse(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export async function GET(req: Request) {
  try {
    const ok = await unsubscribe(req)
    return ok
      ? page(
          "You're unsubscribed",
          "You won't get any more onboarding emails from me. Anything to do with your account — password resets, booking confirmations, receipts — will still come through.",
          200
        )
      : page(
          'That link has expired',
          "We couldn't check this unsubscribe link. Reply to any of my emails and I'll take you off the list myself.",
          400
        )
  } catch (err) {
    console.error('[unsubscribe]', err)
    return page(
      'Something went wrong',
      "We couldn't process that just now. Reply to any of my emails and I'll take you off the list myself.",
      500
    )
  }
}

export async function POST(req: Request) {
  try {
    const ok = await unsubscribe(req)
    return new NextResponse(null, { status: ok ? 200 : 400 })
  } catch (err) {
    console.error('[unsubscribe]', err)
    return new NextResponse(null, { status: 500 })
  }
}
