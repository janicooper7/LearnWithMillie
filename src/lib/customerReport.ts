// Aggregation behind the admin customer report.
//
// Everything counts DISTINCT SESSIONS rather than raw rows: "how many people
// reached checkout" must not double from someone clicking twice. Session is the
// closest honest proxy for "a person on a visit" without identifying anyone.

import { prisma } from '@/lib/prisma'
import {
  CHANNELS,
  FUNNELS,
  FUNNEL_KEYS,
  type Channel,
  type FunnelKey,
} from '@/lib/tracking'
import type { ResolvedRange } from '@/lib/reportRange'

export type ChannelRow = {
  channel: Channel
  sessions: number
  share: number
}

export type FunnelStepRow = {
  key: string
  label: string
  sessions: number
  /** % of the funnel's first step. */
  ofTop: number
  /** % that made it here from the previous step. Null on the first step. */
  fromPrev: number | null
  /** % lost between the previous step and this one. Null on the first step. */
  dropOff: number | null
}

export type FunnelReport = {
  key: FunnelKey
  label: string
  steps: FunnelStepRow[]
  revenue: number
}

/**
 * One row of "where did this traffic come from". Tagged ad traffic groups by
 * campaign; everything else groups by channel + source, so organic, direct and
 * referral sit in the same table as the paid campaigns and can be compared
 * against them directly.
 */
export type SourceRow = {
  /** Stable react key — group identity, not for display. */
  key: string
  channel: Channel
  /** utm_campaign, or null for untagged traffic. */
  campaign: string | null
  /** utm_source, or the referring host for untagged traffic. */
  source: string | null
  sessions: number
  purchases: number
  revenue: number
}

export type CustomerReport = {
  range: ResolvedRange
  totalSessions: number
  totalVisitors: number
  channels: ChannelRow[]
  funnels: FunnelReport[]
  sources: SourceRow[]
  revenue: number
  purchases: number
  hasData: boolean
}

function pct(part: number, whole: number): number {
  if (!whole) return 0
  return Math.round((part / whole) * 1000) / 10
}

export async function buildCustomerReport(range: ResolvedRange): Promise<CustomerReport> {
  // One pass over the window. At this site's volume it's far cheaper to pull
  // the rows once and fold them in memory than to run a dozen grouped queries.
  const events = await prisma.trackedEvent.findMany({
    where: { createdAt: { gte: range.start, lt: range.end } },
    // Oldest first: a session's attribution is read off its FIRST event, so the
    // order here is load-bearing, not cosmetic.
    orderBy: { createdAt: 'asc' },
    select: {
      visitorId: true,
      sessionId: true,
      funnel: true,
      step: true,
      channel: true,
      source: true,
      campaign: true,
      value: true,
    },
  })

  type SessionAttribution = { channel: Channel; campaign: string | null; source: string | null }

  const visitors = new Set<string>()
  // Attribution per session, taken from that session's first event. The browser
  // freezes attribution for the life of a session, so the first event carries
  // the landing's channel even when later steps happened deep in the site.
  const sessionAttr = new Map<string, SessionAttribution>()
  // "funnel|step" -> distinct sessions
  const stepSessions = new Map<string, Set<string>>()
  // Sales are folded per session so they can be attributed with the session,
  // whichever group it ends up in.
  const sessionSales = new Map<string, { purchases: number; revenue: number }>()

  let revenue = 0
  let purchases = 0

  for (const e of events) {
    visitors.add(e.visitorId)
    if (!sessionAttr.has(e.sessionId)) {
      sessionAttr.set(e.sessionId, {
        channel: (CHANNELS as readonly string[]).includes(e.channel) ? (e.channel as Channel) : 'other',
        campaign: e.campaign,
        source: e.source,
      })
    }

    if (e.funnel && e.step) {
      const key = `${e.funnel}|${e.step}`
      if (!stepSessions.has(key)) stepSessions.set(key, new Set())
      stepSessions.get(key)!.add(e.sessionId)
    }

    if (e.step === 'purchased') {
      purchases += 1
      revenue += e.value ?? 0
      const sale = sessionSales.get(e.sessionId) ?? { purchases: 0, revenue: 0 }
      sale.purchases += 1
      sale.revenue += e.value ?? 0
      sessionSales.set(e.sessionId, sale)
    }
  }

  const channelCounts = new Map<string, number>()
  for (const attr of sessionAttr.values()) {
    channelCounts.set(attr.channel, (channelCounts.get(attr.channel) ?? 0) + 1)
  }

  const totalSessions = sessionAttr.size

  const channels: ChannelRow[] = CHANNELS.map((channel) => ({
    channel,
    sessions: channelCounts.get(channel) ?? 0,
    share: pct(channelCounts.get(channel) ?? 0, totalSessions),
  }))
    .filter((c) => c.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions)

  const funnels: FunnelReport[] = FUNNEL_KEYS.map((key) => {
    const def = FUNNELS[key]
    let top = 0
    let prev = 0
    let funnelRevenue = 0

    const steps: FunnelStepRow[] = def.steps.map((step, i) => {
      const count = stepSessions.get(`${key}|${step.key}`)?.size ?? 0
      if (i === 0) {
        top = count
        prev = count
        return { key: step.key, label: step.label, sessions: count, ofTop: 100, fromPrev: null, dropOff: null }
      }
      const fromPrev = pct(count, prev)
      const row: FunnelStepRow = {
        key: step.key,
        label: step.label,
        sessions: count,
        ofTop: pct(count, top),
        fromPrev,
        dropOff: Math.round((100 - fromPrev) * 10) / 10,
      }
      prev = count
      return row
    })

    for (const e of events) {
      if (e.funnel === key && e.step === 'purchased') funnelRevenue += e.value ?? 0
    }

    return { key, label: def.label, steps, revenue: funnelRevenue }
  })

  // Group every session by where it came from. Tagged traffic groups by
  // campaign + source, so one Meta campaign running on both Instagram and
  // Facebook shows as two comparable rows instead of silently taking whichever
  // source happened to be seen first. Untagged traffic groups by channel +
  // source: one row per search engine or referring site, one row for direct.
  const groups = new Map<string, SourceRow>()
  for (const [sessionId, attr] of sessionAttr) {
    const key = attr.campaign
      ? `campaign:${attr.campaign}|${attr.source ?? ''}`
      : `channel:${attr.channel}|${attr.source ?? ''}`

    let row = groups.get(key)
    if (!row) {
      row = {
        key,
        channel: attr.channel,
        campaign: attr.campaign,
        source: attr.source,
        sessions: 0,
        purchases: 0,
        revenue: 0,
      }
      groups.set(key, row)
    }

    row.sessions += 1
    const sale = sessionSales.get(sessionId)
    if (sale) {
      row.purchases += sale.purchases
      row.revenue += sale.revenue
    }
  }

  // Anything that made a sale sorts first — a source with one sale matters more
  // than a source with a hundred sessions and nothing to show for them.
  const sourceRows: SourceRow[] = [...groups.values()]
    .map((row) => ({ ...row, revenue: Math.round(row.revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue || b.sessions - a.sessions)
    .slice(0, 15)

  return {
    range,
    totalSessions,
    totalVisitors: visitors.size,
    channels,
    funnels,
    sources: sourceRows,
    revenue: Math.round(revenue * 100) / 100,
    purchases,
    hasData: events.length > 0,
  }
}
