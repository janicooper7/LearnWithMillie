import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The marketing list as a CSV, for importing into whatever Millie sends
 * broadcasts from.
 *
 * Unsubscribes are included with a column saying so rather than filtered out:
 * an export that quietly drops them would look like a shorter list, and any
 * mail tool worth using needs to be told who has opted out so it can suppress
 * them itself.
 *
 * `also_a_user` flags the addresses that are on this list *and* have an
 * account. They are the ones a broadcast reaches twice — once from this CSV and
 * once from the in-app campaign runner, which mails Users — so the column is
 * there to be filtered on before a send, not for interest.
 */

function cell(value: string | null | undefined): string {
  const text = value ?? ''
  // Spreadsheets execute a leading =, +, - or @ as a formula, and these values
  // are typed by strangers on a public form. The apostrophe is what Excel and
  // Sheets both read as "this is text".
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      email: true,
      name: true,
      audience: true,
      source: true,
      welcomeSentAt: true,
      unsubscribedAt: true,
      createdAt: true,
    },
  })

  // Every account address, lower-cased into a set, rather than a query per
  // subscriber. Registration stores whatever case was typed and /api/subscribe
  // lowercases, so the two lists only line up once both sides are folded.
  const accounts = await prisma.user.findMany({ select: { email: true } })
  const accountEmails = new Set(accounts.map((u) => u.email.toLowerCase()))

  const rows = [
    [
      'email',
      'name',
      'audience',
      'source',
      'signed_up',
      'welcome_sent',
      'unsubscribed',
      'also_a_user',
    ].join(','),
    ...subscribers.map((s) =>
      [
        cell(s.email),
        cell(s.name),
        cell(s.audience.toLowerCase()),
        cell(s.source),
        cell(s.createdAt.toISOString()),
        cell(s.welcomeSentAt?.toISOString() ?? ''),
        cell(s.unsubscribedAt?.toISOString() ?? ''),
        cell(accountEmails.has(s.email.toLowerCase()) ? 'yes' : 'no'),
      ].join(',')
    ),
  ].join('\r\n')

  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
