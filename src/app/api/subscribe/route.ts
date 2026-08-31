import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBrandedMail } from '@/lib/email/send'
import { buildSubscriberWelcome } from '@/lib/email/messages/subscriberWelcome'
import { subscriberUnsubscribeUrl } from '@/lib/email/unsubscribe'
import { SIGNUP_OFFER } from '@/lib/signupOffer'
import type { Audience } from '@/lib/email/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The signup popup's endpoint: join the marketing list, get the discount code.
 *
 * Public and unauthenticated, because the whole point is to catch people
 * before they have an account. That makes it the one route on the site that
 * will send an email to any address a stranger types, so it is deliberately
 * boring: one message, no attachments, no caller-supplied copy, and a per-IP
 * cap on how often it will do it.
 */

// Deliberately generous on the local part — real addresses contain plus signs,
// dots and apostrophes, and the only test that actually proves an address
// works is the email arriving. This just catches typos and obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@,]+\.[a-z]{2,}$/i

const AUDIENCES: Audience[] = ['teacher', 'student']

/** Don't re-send the welcome to the same address more often than this. */
const RESEND_AFTER_MS = 24 * 60 * 60 * 1000

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 8 }

/**
 * Per-IP throttle.
 *
 * In-process, so it resets when the instance does and each instance counts
 * separately — it is not a real rate limiter and isn't trying to be. What it
 * stops is the cheap version of the attack: one script posting a hundred
 * addresses at Millie's SMTP quota from a single connection. Anything more
 * determined than that needs a shared store, which isn't worth standing up for
 * a signup box.
 */
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)

  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent)
    return true
  }

  recent.push(now)
  hits.set(ip, recent)

  // The map only ever grows otherwise: one entry per IP that has ever posted,
  // held for the life of the instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key)
    }
  }

  return false
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  // First entry is the client; the rest are proxies that appended themselves.
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const audience = body.audience as Audience
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) || null : null
  const source = typeof body.source === 'string' ? body.source.slice(0, 200) : null

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!AUDIENCES.includes(audience)) {
    return NextResponse.json({ error: 'Please tell us which one you are.' }, { status: 400 })
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many signups from here just now. Try again a bit later.' },
      { status: 429 }
    )
  }

  const dbAudience = audience === 'teacher' ? 'TEACHER' : 'STUDENT'

  try {
    const existing = await prisma.subscriber.findUnique({
      where: { email },
      select: { id: true, welcomeSentAt: true },
    })

    // Signing up again is fresh consent, so it clears an earlier unsubscribe —
    // and it moves them onto whichever audience they picked this time, since
    // the later answer is the more likely one to be right.
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      create: { email, name, audience: dbAudience, source },
      update: {
        audience: dbAudience,
        unsubscribedAt: null,
        ...(name ? { name } : {}),
      },
      select: { id: true, name: true },
    })

    // Re-sending is allowed — people lose the email — but only once a day, so
    // repeated submits of the same address can't be used to bury an inbox.
    const lastSent = existing?.welcomeSentAt?.getTime() ?? 0
    const shouldSend = Date.now() - lastSent > RESEND_AFTER_MS

    if (shouldSend) {
      const { subject, html } = buildSubscriberWelcome({
        name: subscriber.name,
        email,
        audience,
        unsubscribeUrl: subscriberUnsubscribeUrl(subscriber.id),
      })

      // Awaited rather than fired and forgotten: on a serverless host the
      // function stops the moment the response is returned, and a floating
      // promise would be killed mid-SMTP-handshake.
      await sendBrandedMail({
        to: email,
        subject,
        html,
        unsubscribeUrl: subscriberUnsubscribeUrl(subscriber.id),
      })

      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { welcomeSentAt: new Date() },
      })
    }

    return NextResponse.json({
      ok: true,
      code: SIGNUP_OFFER.code,
      percentOff: SIGNUP_OFFER.percentOff,
      alreadySubscribed: Boolean(existing),
    })
  } catch (err) {
    console.error('[subscribe]', err)
    // The row is written before the send, so a failure here means the address
    // is on the list but the email didn't go — welcomeSentAt stays null, which
    // is what makes those findable in the admin list.
    return NextResponse.json(
      { error: "Something went wrong on our end. Your code is " + SIGNUP_OFFER.code + '.' },
      { status: 500 }
    )
  }
}
