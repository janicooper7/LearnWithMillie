import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminUsersTable from '@/app/components/AdminUsersTable'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, allowance: true, addonLessonsEnabled: true, trialPurchased: true, trialUsed: true, stripeSubscriptionId: true, upcomingLessons: true, createdAt: true, image: true },
  })

  // Admins can open any course player without buying it (see learn/[slug]/page.tsx).
  const courses = await prisma.course.findMany({
    where: { isBundle: false },
    orderBy: { order: 'asc' },
    select: { slug: true, title: true, published: true },
  })

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-end gap-3 mb-6'>
          <Link href='/admin/propose' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Propose a Time
          </Link>
          <Link href='/admin/sessions' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Upcoming Sessions
          </Link>
          <Link href='/admin/subscribers' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Email List
          </Link>
          <Link href='/admin/report' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Customer Report
          </Link>
        </div>
        {courses.length > 0 && (
          <div className='flex flex-wrap items-center gap-3 mb-6'>
            <span className='text-sm font-medium text-[#1F3A34]/60'>Preview courses:</span>
            {courses.map((c) => (
              <Link key={c.slug} href={`/learn/${c.slug}`} className='text-sm font-medium text-[#1F3A34] underline decoration-[#C2AA6A] underline-offset-2 hover:text-[#C2AA6A] transition-colors'>
                {c.title}{!c.published && ' (unpublished)'}
              </Link>
            ))}
          </div>
        )}
        <AdminUsersTable users={users} />
      </main>
    </div>
  )
}
