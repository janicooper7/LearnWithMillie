// Date ranges for the admin customer report.
//
// Calendar ranges ("today", "this month") are resolved in London time, not the
// server's UTC. On a Netlify/Vercel box those differ for most of the year, and
// a report that called 1am BST "yesterday" would be quietly wrong every night.

const TZ = 'Europe/London'

export type RangeKey = 'today' | 'yesterday' | 'month' | '7' | '30' | '90'

export type ResolvedRange = {
  key: RangeKey
  label: string
  start: Date
  end: Date
  /** Human-readable span, e.g. "10 Aug 2026" or "1 – 10 Aug 2026". */
  description: string
}

export const RANGE_KEYS: RangeKey[] = ['today', 'yesterday', 'month', '7', '30', '90']

const RANGE_LABELS: Record<RangeKey, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  month: 'This month',
  '7': '7 days',
  '30': '30 days',
  '90': '90 days',
}

export function isRangeKey(value: unknown): value is RangeKey {
  return typeof value === 'string' && (RANGE_KEYS as string[]).includes(value)
}

/**
 * How far the given instant's wall clock in `TZ` is ahead of UTC, in ms.
 * Formatting the instant in the zone and re-reading it as if it were UTC is the
 * only way to get this without pulling in a date library.
 */
function zoneOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)

  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value

  const asIfUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second)
  )
  return asIfUtc - instant.getTime()
}

/** The wall-clock Y/M/D in `TZ` for a given instant. */
function zonedYmd(instant: Date): { year: number; month: number; day: number } {
  const offset = zoneOffsetMs(instant)
  const shifted = new Date(instant.getTime() + offset)
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  }
}

/**
 * The UTC instant at which a given London calendar day starts.
 *
 * Resolved twice because the offset on the day being targeted may differ from
 * the offset today — without the second pass, the range slips by an hour across
 * a DST boundary.
 */
function zonedDayStart(year: number, month: number, day: number): Date {
  const wallClock = Date.UTC(year, month - 1, day, 0, 0, 0)
  const firstGuess = new Date(wallClock - zoneOffsetMs(new Date(wallClock)))
  const corrected = wallClock - zoneOffsetMs(firstGuess)
  return new Date(corrected)
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatDay(instant: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(instant)
}

export function resolveRange(key: RangeKey, now = new Date()): ResolvedRange {
  const label = RANGE_LABELS[key]
  const today = zonedYmd(now)
  const todayStart = zonedDayStart(today.year, today.month, today.day)

  let start: Date
  let end: Date

  switch (key) {
    case 'today':
      start = todayStart
      end = now
      break

    case 'yesterday': {
      const y = zonedYmd(new Date(todayStart.getTime() - DAY_MS))
      start = zonedDayStart(y.year, y.month, y.day)
      end = todayStart
      break
    }

    case 'month':
      start = zonedDayStart(today.year, today.month, 1)
      end = now
      break

    default: {
      // Rolling windows include today, so "7 days" is the last 6 whole days
      // plus today so far — the same thing a person means by "this week".
      const days = Number(key)
      start = new Date(todayStart.getTime() - (days - 1) * DAY_MS)
      end = now
      break
    }
  }

  // Yesterday ends at midnight; every other range ends "now", so its last
  // displayed day is the day containing `end` minus a moment.
  const lastDay = key === 'yesterday' ? new Date(end.getTime() - 1) : end
  const startLabel = formatDay(start)
  const endLabel = formatDay(lastDay)
  const description = startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`

  return { key, label, start, end, description }
}
