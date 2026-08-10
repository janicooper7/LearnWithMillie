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

export type CampaignRow = {
  campaign: string
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
  campaigns: CampaignRow[]
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

  const visitors = new Set<string>()
  const sessions = new Set<string>()
  // channel -> sessions, taken from each session's first event
  const sessionChannel = new Map<string, string>()
  // "funnel|step" -> distinct sessions
  const stepSessions = new Map<string, Set<string>>()
  const campaigns = new Map<string, { source: string | null; sessions: Set<string>; purchases: number; revenue: number }>()

  let revenue = 0
  let purchases = 0

  for (const e of events) {
    visitors.add(e.visitorId)
    sessions.add(e.sessionId)
    if (!sessionChannel.has(e.sessionId)) sessionChannel.set(e.sessionId, e.channel)

    if (e.funnel && e.step) {
      const key = `${e.funnel}|${e.step}`
      if (!stepSessions.has(key)) stepSessions.set(key, new Set())
      stepSessions.get(key)!.add(e.sessionId)
    }

    if (e.campaign) {
      if (!campaigns.has(e.campaign)) {
        campaigns.set(e.campaign, { source: e.source, sessions: new Set(), purchases: 0, revenue: 0 })
      }
      const row = campaigns.get(e.campaign)!
      row.sessions.add(e.sessionId)
      if (e.step === 'purchased') {
        row.purchases += 1
        row.revenue += e.value ?? 0
      }
    }

    if (e.step === 'purchased') {
      purchases += 1
      revenue += e.value ?? 0
    }
  }

  const channelCounts = new Map<string, number>()
  for (const channel of sessionChannel.values()) {
    channelCounts.set(channel, (channelCounts.get(channel) ?? 0) + 1)
  }

  const totalSessions = sessions.size

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

  const campaignRows: CampaignRow[] = [...campaigns.entries()]
    .map(([campaign, row]) => ({
      campaign,
      source: row.source,
      sessions: row.sessions.size,
      purchases: row.purchases,
      revenue: row.revenue,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)

  return {
    range,
    totalSessions,
    totalVisitors: visitors.size,
    channels,
    funnels,
    campaigns: campaignRows,
    revenue: Math.round(revenue * 100) / 100,
    purchases,
    hasData: events.length > 0,
  }
}
