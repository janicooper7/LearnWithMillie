import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildCustomerReport } from '@/lib/customerReport'
import { CHANNEL_LABELS, type Channel } from '@/lib/tracking'
import { RANGE_KEYS, isRangeKey, resolveRange } from '@/lib/reportRange'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Customer Report' }

// Channel accents — paid channels share the red used for sale messaging so ad
// traffic is findable at a glance; everything else stays in the brand greens.
const CHANNEL_COLOR: Record<Channel, string> = {
  paid_social: '#C0392B',
  paid_search: '#D9704A',
  organic: '#1F3A34',
  direct: '#3E6B60',
  referral: '#C2AA6A',
  email: '#8A7B4F',
  other: '#A9A29B',
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 md:p-7 ${className}`}
      style={{ border: '1px solid #EDE4D8' }}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px w-8" style={{ backgroundColor: '#C2AA6A' }} />
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: 'rgba(31,58,52,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {children}
      </span>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-3xl font-bold"
        style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        {value}
      </p>
      {hint && (
        <p
          className="mt-1 text-xs"
          style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {hint}
        </p>
      )}
    </Card>
  )
}

export default async function AdminReportPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const { range: rangeParam } = await searchParams
  const range = resolveRange(isRangeKey(rangeParam) ? rangeParam : '30')

  const report = await buildCustomerReport(range)
  const font = { fontFamily: 'var(--font-inter), sans-serif' }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4EDE4' }}>
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
              style={{ color: 'rgba(31,58,52,0.6)', ...font }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Admin
            </Link>
            <h1
              className="text-3xl font-bold"
              style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Customer Report
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: 'rgba(31,58,52,0.55)', ...font }}>
              {range.description}
              <span className="ml-2" style={{ color: 'rgba(31,58,52,0.35)' }}>
                London time
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {RANGE_KEYS.map((key) => {
              const r = resolveRange(key)
              const active = key === range.key
              return (
                <Link
                  key={key}
                  href={`/admin/report?range=${key}`}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: active ? '#1F3A34' : 'white',
                    color: active ? 'white' : '#1F3A34',
                    border: '1px solid #1F3A34',
                    ...font,
                  }}
                >
                  {r.label}
                </Link>
              )
            })}
          </div>
        </div>

        {!report.hasData && (
          <Card className="mb-8">
            <p className="text-base font-semibold" style={{ color: '#1F3A34', ...font }}>
              No data yet
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.65)', ...font }}>
              Tracking starts collecting the moment this deploys — there&apos;s no history
              from before then. Visit the site in a normal browser (admin pages
              aren&apos;t tracked) and the first sessions will show up here within seconds.
            </p>
          </Card>
        )}

        {/* Headline numbers */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Visitors" value={report.totalVisitors.toLocaleString()} hint={range.label} />
          <Stat label="Sessions" value={report.totalSessions.toLocaleString()} hint="30-min visit window" />
          <Stat label="Purchases" value={report.purchases.toLocaleString()} hint="Confirmed by Stripe" />
          <Stat
            label="Revenue"
            value={`$${report.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            hint="Before Stripe fees"
          />
        </div>

        {/* Traffic by channel */}
        <section className="mb-10">
          <Eyebrow>Where traffic came from</Eyebrow>
          <Card>
            {report.channels.length === 0 ? (
              <p className="text-sm" style={{ color: 'rgba(31,58,52,0.5)', ...font }}>
                No sessions in this window.
              </p>
            ) : (
              <div className="space-y-4">
                {report.channels.map((c) => (
                  <div key={c.channel}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-4">
                      <span className="text-sm font-semibold" style={{ color: '#1F3A34', ...font }}>
                        {CHANNEL_LABELS[c.channel]}
                      </span>
                      <span className="text-sm tabular-nums" style={{ color: 'rgba(31,58,52,0.6)', ...font }}>
                        {c.sessions.toLocaleString()}
                        <span className="ml-2" style={{ color: 'rgba(31,58,52,0.4)' }}>
                          {c.share}%
                        </span>
                      </span>
                    </div>
                    <div
                      className="h-2.5 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.max(c.share, 1)}%`, backgroundColor: CHANNEL_COLOR[c.channel] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Funnels */}
        <section className="mb-10">
          <Eyebrow>Funnels &amp; drop-off</Eyebrow>
          <div className="grid gap-5 lg:grid-cols-2">
            {report.funnels.map((f) => {
              const top = f.steps[0]?.sessions ?? 0
              return (
                <Card key={f.key}>
                  <div className="mb-5 flex items-baseline justify-between gap-3">
                    <h2 className="text-lg font-bold" style={{ color: '#1F3A34', ...font }}>
                      {f.label}
                    </h2>
                    {f.revenue > 0 && (
                      <span className="text-sm font-semibold tabular-nums" style={{ color: '#C0392B', ...font }}>
                        ${f.revenue.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {top === 0 ? (
                    <p className="text-sm" style={{ color: 'rgba(31,58,52,0.45)', ...font }}>
                      No visits to this funnel yet.
                    </p>
                  ) : (
                    <div className="space-y-3.5">
                      {f.steps.map((s) => (
                        <div key={s.key}>
                          <div className="mb-1 flex items-baseline justify-between gap-3">
                            <span className="text-sm" style={{ color: 'rgba(31,58,52,0.8)', ...font }}>
                              {s.label}
                            </span>
                            <span className="text-sm font-semibold tabular-nums" style={{ color: '#1F3A34', ...font }}>
                              {s.sessions.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="h-2 w-full overflow-hidden rounded-full"
                            style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${Math.max(s.ofTop, s.sessions > 0 ? 1 : 0)}%`, backgroundColor: '#1F3A34' }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs" style={font}>
                            <span style={{ color: 'rgba(31,58,52,0.4)' }}>{s.ofTop}% of all who landed</span>
                            {s.dropOff !== null && (
                              <span style={{ color: s.dropOff >= 50 ? '#C0392B' : 'rgba(31,58,52,0.45)' }}>
                                {s.dropOff}% dropped here
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </section>

        {/* Campaigns */}
        <section>
          <Eyebrow>Top campaigns</Eyebrow>
          <Card>
            {report.campaigns.length === 0 ? (
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(31,58,52,0.5)', ...font }}>
                Nothing tagged yet. Campaigns appear here once visitors arrive on a URL
                carrying <code>utm_campaign</code>.
              </p>
            ) : (
              <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm" style={font}>
                  <thead>
                    <tr style={{ color: 'rgba(31,58,52,0.45)' }}>
                      <th className="px-2 pb-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Campaign</th>
                      <th className="px-2 pb-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">Source</th>
                      <th className="px-2 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]">Sessions</th>
                      <th className="px-2 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]">Sales</th>
                      <th className="px-2 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.campaigns.map((c) => (
                      <tr key={c.campaign} style={{ borderTop: '1px solid #EDE4D8' }}>
                        <td className="px-2 py-3 font-semibold" style={{ color: '#1F3A34' }}>{c.campaign}</td>
                        <td className="px-2 py-3" style={{ color: 'rgba(31,58,52,0.6)' }}>{c.source ?? '—'}</td>
                        <td className="px-2 py-3 text-right tabular-nums" style={{ color: 'rgba(31,58,52,0.8)' }}>{c.sessions}</td>
                        <td className="px-2 py-3 text-right tabular-nums" style={{ color: 'rgba(31,58,52,0.8)' }}>{c.purchases}</td>
                        <td className="px-2 py-3 text-right font-semibold tabular-nums" style={{ color: c.revenue > 0 ? '#C0392B' : 'rgba(31,58,52,0.4)' }}>
                          ${c.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  )
}
