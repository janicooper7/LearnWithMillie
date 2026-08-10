import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CHANNELS, FUNNEL_KEYS } from '@/lib/tracking'

export const runtime = 'nodejs'

// Public, unauthenticated ingest for first-party analytics. Everything is
// validated and clamped here because the body arrives straight from a browser
// and nothing in it can be trusted.

const MAX_LEN = 200

function clean(value: unknown, max = MAX_LEN): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const visitorId = clean(body.visitorId, 64)
  const sessionId = clean(body.sessionId, 64)
  const step = clean(body.step, 40)
  const path = clean(body.path, 300)

  if (!visitorId || !sessionId || !step || !path) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Unknown funnels and channels are dropped rather than stored, so the report
  // can never be polluted by a typo or a crafted request.
  const rawFunnel = clean(body.funnel, 40)
  const funnel = rawFunnel && (FUNNEL_KEYS as string[]).includes(rawFunnel) ? rawFunnel : null

  const rawChannel = clean(body.channel, 20)
  const channel =
    rawChannel && (CHANNELS as readonly string[]).includes(rawChannel) ? rawChannel : 'direct'

  const rawValue = Number(body.value)
  const value = Number.isFinite(rawValue) && rawValue >= 0 ? Math.min(rawValue, 100000) : null

  try {
    await prisma.trackedEvent.create({
      data: {
        visitorId,
        sessionId,
        funnel,
        step,
        path,
        channel,
        source: clean(body.source, 100),
        medium: clean(body.medium, 100),
        campaign: clean(body.campaign, 100),
        value,
      },
    })
  } catch (err: any) {
    // Never surface a tracking failure to the visitor's browser.
    console.error('Track error:', err.message)
  }

  return new NextResponse(null, { status: 204 })
}
