'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Search } from 'lucide-react'

export type ProposablePerson = {
  id: string
  name: string | null
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  allowance: number
  /** The session type this person would book themselves. Only a starting point. */
  defaultEventSlug: string
}

const EVENT_TYPES = [
  { slug: 'english-lessons-with-millie-cooper', label: 'English lesson', minutes: 50 },
  { slug: 'trial-lesson-with-millie-cooper', label: 'Trial lesson', minutes: 20 },
  { slug: 'mentorship-session-with-millie-cooper', label: 'Mentorship', minutes: 50 },
]

type SlotDay = { date: string; slots: string[] }

/**
 * Everything here is UK time — the calendar, the chips, the confirmation, and
 * the booking that gets made. See TEACHING_TZ in lib/sessionProposals for why
 * there is one clock rather than one per student.
 */
const ADMIN_TZ = 'Europe/London'

/**
 * How far ahead the arrows will go. Cal.com sets no booking window on these
 * event types, so without a stop the forward arrow would page into empty
 * months forever.
 */
const MAX_MONTHS_AHEAD = 12

/**
 * Today's month *in UK time*, which is not necessarily the browser's — the
 * whole page is pinned to Millie's clock, and a month boundary is exactly where
 * the two would disagree.
 */
function ukYearMonth(date = new Date()): { year: number; month: number } {
  const [year, month] = new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TZ,
    year: 'numeric',
    month: '2-digit',
  })
    .format(date)
    .split('-')
    .map(Number)
  // Month is 0-indexed to match Date, so it can be added to directly.
  return { year, month: month - 1 }
}

/** First instant of the month `offset` months from this one, and of the next. */
function monthWindow(offset: number): { start: Date; end: Date; key: string; label: string } {
  const base = ukYearMonth()
  const start = new Date(Date.UTC(base.year, base.month + offset, 1))
  const end = new Date(Date.UTC(base.year, base.month + offset + 1, 1))
  const key = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`
  const label = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(start)
  return { start, end, key, label }
}

export default function ProposeSession({ people }: { people: ProposablePerson[] }) {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [personId, setPersonId] = useState<string | null>(null)
  const [eventTypeSlug, setEventTypeSlug] = useState(EVENT_TYPES[0].slug)
  const [monthOffset, setMonthOffset] = useState(0)
  const [message, setMessage] = useState('')

  const [days, setDays] = useState<SlotDay[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotError, setSlotError] = useState<string | null>(null)

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<{ name: string; when: string; emailed: boolean } | null>(null)

  const person = useMemo(() => people.find((p) => p.id === personId) ?? null, [people, personId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return people
    return people.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    )
  }, [people, query])

  // Named from the offset rather than from the returned days, so a month with
  // nothing free still says which month it is.
  const view = useMemo(() => monthWindow(monthOffset), [monthOffset])

  const slotCount = useMemo(() => days.reduce((n, d) => n + d.slots.length, 0), [days])

  // Picking someone resets the form to what they'd book themselves, and clears
  // any slot chosen for the person before them — a time is only meaningful
  // against the person it was picked for.
  function choosePerson(next: ProposablePerson) {
    setPersonId(next.id)
    setEventTypeSlug(next.defaultEventSlug)
    setSelectedSlot(null)
    setMonthOffset(0)
    setError(null)
    setSent(null)
  }

  const loadSlots = useCallback(async () => {
    if (!person) return
    setLoadingSlots(true)
    setSlotError(null)

    const { start, end, key } = monthWindow(monthOffset)

    try {
      const params = new URLSearchParams({
        eventTypeSlug,
        start: start.toISOString(),
        end: end.toISOString(),
      })
      const res = await fetch(`/api/admin/proposals/slots?${params}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Could not read the calendar.')
      // The range is sent as instants, so an hour either side of a UK month
      // boundary can land in the neighbouring month. Keyed days make trimming
      // that exact rather than approximate.
      setDays((json.days ?? []).filter((d: SlotDay) => d.date.startsWith(key)))
    } catch (err) {
      setDays([])
      setSlotError(err instanceof Error ? err.message : 'Could not read the calendar.')
    } finally {
      setLoadingSlots(false)
    }
  }, [person, eventTypeSlug, monthOffset])

  useEffect(() => {
    void loadSlots()
  }, [loadSlots])

  // Changing the session type re-reads availability against a different length,
  // so the instant picked under the old one may no longer be free. Changing the
  // student's timezone does not — it relabels the same slots — so it leaves any
  // selection alone.
  useEffect(() => {
    setSelectedSlot(null)
  }, [eventTypeSlug])

  async function send() {
    if (!person || !selectedSlot) return
    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: person.id,
          eventTypeSlug,
          start: selectedSlot,
          message: message.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Could not propose that time.')

      setSent({
        name: person.name ?? person.email,
        when: `${formatSlot(selectedSlot, ADMIN_TZ, true)} UK time`,
        emailed: json.emailed !== false,
      })
      setSelectedSlot(null)
      setMessage('')
      await loadSlots()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not propose that time.')
    } finally {
      setSending(false)
    }
  }

  const noCredits = !!person && person.allowance < 1

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start'>
      {/* Who */}
      <div className='bg-white rounded-xl border border-[#EDE4D8] overflow-hidden'>
        <div className='px-4 py-3 border-b border-[#EDE4D8]'>
          <div className='relative'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1F3A34]/35' />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search students'
              className='w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#EDE4D8] bg-[#F4EDE4]/40 text-[#1F3A34] placeholder:text-[#1F3A34]/35 focus:outline-none focus:border-[#C2AA6A]'
            />
          </div>
        </div>

        <div className='max-h-[26rem] overflow-y-auto'>
          {filtered.length === 0 ? (
            <p className='px-4 py-8 text-sm text-center text-[#1F3A34]/45'>Nobody matches that.</p>
          ) : (
            filtered.map((p) => {
              const active = p.id === personId
              return (
                <button
                  key={p.id}
                  onClick={() => choosePerson(p)}
                  className={`w-full text-left px-4 py-3 border-b border-[#EDE4D8] last:border-b-0 transition-colors ${
                    active ? 'bg-[#1F3A34]' : 'hover:bg-[#1F3A34]/5'
                  }`}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span
                      className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-[#1F3A34]'}`}
                    >
                      {p.name ?? p.email}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        p.allowance < 1
                          ? 'bg-[#c0392b]/10 text-[#c0392b]'
                          : active
                            ? 'bg-white/15 text-white'
                            : 'bg-[#7FD49A]/20 text-[#1E8449]'
                      }`}
                    >
                      {p.allowance}
                    </span>
                  </div>
                  <div className={`text-xs truncate mt-0.5 ${active ? 'text-white/55' : 'text-[#1F3A34]/45'}`}>
                    {p.role === 'TEACHER' ? 'Teacher · ' : ''}
                    {p.email}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* When */}
      <div className='bg-white rounded-xl border border-[#EDE4D8] p-5 sm:p-6'>
        {!person ? (
          <div className='py-16 text-center'>
            <CalendarDays className='w-8 h-8 mx-auto mb-3 text-[#1F3A34]/20' />
            <p className='text-sm text-[#1F3A34]/50'>Pick someone to see the times you could offer them.</p>
          </div>
        ) : (
          <>
            {sent && (
              <div className='mb-5 rounded-xl border border-[#7FD49A]/40 bg-[#7FD49A]/10 px-4 py-3'>
                <div className='flex items-start gap-2.5'>
                  <CheckCircle2 className='w-4 h-4 mt-0.5 flex-shrink-0 text-[#1E8449]' />
                  <div className='text-sm text-[#1F3A34]'>
                    <strong>{sent.when}</strong> is held for {sent.name}.{' '}
                    {sent.emailed
                      ? 'They’ve been emailed to confirm it.'
                      : 'The confirmation email failed to send — tell them another way.'}
                  </div>
                </div>
              </div>
            )}

            {noCredits && (
              <div className='mb-5 rounded-xl border border-[#c0392b]/25 bg-[#c0392b]/[0.06] px-4 py-3'>
                <div className='flex items-start gap-2.5'>
                  <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0 text-[#c0392b]' />
                  <div className='text-sm text-[#1F3A34]'>
                    {person.name ?? person.email} has no {person.role === 'TEACHER' ? 'sessions' : 'lessons'} left.
                    A booking made now would be cancelled automatically — add a credit on the admin
                    page first.
                  </div>
                </div>
              </div>
            )}

            <div className='mb-5 max-w-xs'>
              <label className='block'>
                <span className='text-xs uppercase tracking-wider font-semibold text-[#1F3A34]/50'>
                  Session type
                </span>
                <select
                  value={eventTypeSlug}
                  onChange={(e) => setEventTypeSlug(e.target.value)}
                  className='mt-1.5 w-full px-3 py-2 text-sm rounded-lg border border-[#EDE4D8] bg-white text-[#1F3A34] focus:outline-none focus:border-[#C2AA6A]'
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.label} · {t.minutes} min
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className='flex items-center justify-between gap-3 mb-3'>
              <div className='min-w-0'>
                <h2 className='text-base font-bold text-[#1F3A34] truncate'>{view.label}</h2>
                <span className='text-xs text-[#1F3A34]/45 truncate'>
                  UK time
                  {!loadingSlots && !slotError &&
                    (slotCount > 0
                      ? ` · ${slotCount} time${slotCount === 1 ? '' : 's'} across ${days.length} day${days.length === 1 ? '' : 's'}`
                      : ' · nothing free')}
                </span>
              </div>
              <div className='flex items-center gap-1 flex-shrink-0'>
                <button
                  onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
                  disabled={monthOffset === 0}
                  className='p-1.5 rounded-lg border border-[#EDE4D8] text-[#1F3A34] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1F3A34]/5 transition-colors'
                  aria-label={`Previous month${monthOffset === 0 ? ' (already on this month)' : ''}`}
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setMonthOffset((m) => Math.min(MAX_MONTHS_AHEAD, m + 1))}
                  disabled={monthOffset >= MAX_MONTHS_AHEAD}
                  className='p-1.5 rounded-lg border border-[#EDE4D8] text-[#1F3A34] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1F3A34]/5 transition-colors'
                  aria-label='Next month'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>

            {loadingSlots ? (
              <p className='py-10 text-sm text-center text-[#1F3A34]/45'>Reading the calendar…</p>
            ) : slotError ? (
              <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {slotError}
              </div>
            ) : days.length === 0 ? (
              <p className='py-10 text-sm text-center text-[#1F3A34]/45'>
                Nothing free in {view.label}. Use the arrow to try the next month.
              </p>
            ) : (
              <div className='space-y-3 max-h-[32rem] overflow-y-auto pr-1'>
                {days.map((day) => (
                  <div key={day.date}>
                    <div className='text-xs font-semibold text-[#1F3A34]/55 mb-1.5'>
                      {formatDayHeading(day.date, ADMIN_TZ)}
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {day.slots.map((slot) => {
                        const active = slot === selectedSlot
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(active ? null : slot)}
                            className={`px-3 py-1.5 text-sm rounded-lg border tabular-nums transition-colors ${
                              active
                                ? 'bg-[#1F3A34] border-[#1F3A34] text-white font-semibold'
                                : 'bg-white border-[#EDE4D8] text-[#1F3A34] hover:border-[#C2AA6A]'
                            }`}
                          >
                            {formatSlot(slot, ADMIN_TZ)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='mt-5 pt-5 border-t border-[#EDE4D8]'>
              <label className='block'>
                <span className='text-xs uppercase tracking-wider font-semibold text-[#1F3A34]/50'>
                  Note for them (optional)
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder='Why this time, or what to prepare.'
                  className='mt-1.5 w-full px-3 py-2 text-sm rounded-lg border border-[#EDE4D8] bg-white text-[#1F3A34] placeholder:text-[#1F3A34]/35 focus:outline-none focus:border-[#C2AA6A] resize-none'
                />
              </label>

              {error && (
                <div className='mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                  {error}
                </div>
              )}

              <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                <p className='text-sm text-[#1F3A34]/55'>
                  {selectedSlot
                    ? `Holding ${formatSlot(selectedSlot, ADMIN_TZ, true)} UK time for ${person.name ?? person.email}.`
                    : 'Pick a time above.'}
                </p>
                <button
                  onClick={send}
                  disabled={!selectedSlot || sending || noCredits}
                  className='px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-[#1F3A34] disabled:opacity-35 disabled:cursor-not-allowed hover:brightness-110 transition-all'
                >
                  {sending ? 'Holding the slot…' : 'Hold it and ask them'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function formatSlot(iso: string, timeZone: string, withDate = false): string {
  const d = new Date(iso)
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
  if (!withDate) return time

  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
  return `${date}, ${time}`
}

/**
 * Cal keys each group by the calendar date in the requested timezone, so the
 * heading is built from that string rather than from a slot instant — parsing
 * it as a plain date and formatting in UTC keeps it from sliding a day.
 */
function formatDayHeading(date: string, timeZone: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  const label = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date())
  return date === today ? `Today · ${label}` : label
}
