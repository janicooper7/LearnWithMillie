import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SIGNUP_OFFER } from '@/lib/signupOffer'

export const dynamic = 'force-dynamic'

/**
 * The marketing list from the signup popup.
 *
 * Read-only on purpose. Everything that changes a row happens elsewhere — the
 * popup adds them, the unsubscribe link removes them — so there is nothing to
 * edit here, only to look at and export.
 */

const PAGE_SIZE = 200

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminSubscribersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [subscribers, total, teachers, students, unsubscribed, unsent] = await Promise.all([
    prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
    }),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { audience: 'TEACHER', unsubscribedAt: null } }),
    prisma.subscriber.count({ where: { audience: 'STUDENT', unsubscribedAt: null } }),
    prisma.subscriber.count({ where: { unsubscribedAt: { not: null } } }),
    // Someone who was promised a code and never got the email. Should be zero;
    // anything else is an SMTP problem worth chasing.
    prisma.subscriber.count({ where: { welcomeSentAt: null } }),
  ])

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-[#1F3A34]'>Email list</h1>
            <p className='text-sm text-[#1F3A34]/60 mt-1'>
              Signups from the site popup, offered {SIGNUP_OFFER.percentOff}% off their first order
              with code <span className='font-mono font-semibold'>{SIGNUP_OFFER.code}</span>.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              href='/admin'
              className='bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'
            >
              Back to admin
            </Link>
            <a
              href='/api/admin/subscribers/export'
              className='bg-[#1F3A34] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/90 transition-colors'
            >
              Export CSV
            </a>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
          <Stat label='Teachers' value={teachers} />
          <Stat label='Students' value={students} />
          <Stat label='Unsubscribed' value={unsubscribed} />
          <Stat label='Welcome not sent' value={unsent} warn={unsent > 0} />
        </div>

        <div className='bg-white rounded-xl border border-[#EDE4D8] overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-[#F4EDE4] text-left text-xs uppercase tracking-wider text-[#1F3A34]/60'>
                  <th className='px-4 py-3 font-semibold'>Email</th>
                  <th className='px-4 py-3 font-semibold'>Name</th>
                  <th className='px-4 py-3 font-semibold'>Audience</th>
                  <th className='px-4 py-3 font-semibold'>Signed up</th>
                  <th className='px-4 py-3 font-semibold'>Source</th>
                  <th className='px-4 py-3 font-semibold'>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={6} className='px-4 py-10 text-center text-[#1F3A34]/50'>
                      Nobody has signed up yet.
                    </td>
                  </tr>
                )}
                {subscribers.map((sub) => (
                  <tr key={sub.id} className='border-t border-[#EDE4D8]'>
                    <td className='px-4 py-3 text-[#1F3A34]'>{sub.email}</td>
                    <td className='px-4 py-3 text-[#1F3A34]/70'>{sub.name || '—'}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          sub.audience === 'TEACHER'
                            ? 'bg-[#C2AA6A]/25 text-[#8a6f2e]'
                            : 'bg-[#1F3A34]/10 text-[#1F3A34]'
                        }`}
                      >
                        {sub.audience === 'TEACHER' ? 'Teacher' : 'Student'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-[#1F3A34]/70 whitespace-nowrap'>
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className='px-4 py-3 text-[#1F3A34]/50 max-w-[200px] truncate'>
                      {sub.source || '—'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      {sub.unsubscribedAt ? (
                        <span className='text-[#1F3A34]/40'>Unsubscribed</span>
                      ) : sub.welcomeSentAt ? (
                        <span className='text-green-700'>Subscribed</span>
                      ) : (
                        <span className='text-red-600'>Welcome failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {total > PAGE_SIZE && (
          <p className='mt-4 text-xs text-[#1F3A34]/50'>
            Showing the {PAGE_SIZE} most recent of {total}. The CSV export has all of them.
          </p>
        )}
      </main>
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className='bg-white rounded-xl border border-[#EDE4D8] px-4 py-3'>
      <div className='text-xs uppercase tracking-wider text-[#1F3A34]/50'>{label}</div>
      <div className={`text-2xl font-bold mt-0.5 ${warn ? 'text-red-600' : 'text-[#1F3A34]'}`}>
        {value}
      </div>
    </div>
  )
}
