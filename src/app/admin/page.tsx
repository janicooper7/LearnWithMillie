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

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex items-center justify-end gap-3 mb-6'>
          <Link href='/admin/subscribers' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Email List
          </Link>
          <Link href='/admin/report' className='flex items-center gap-2 bg-white text-[#1F3A34] border border-[#1F3A34] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/5 transition-colors'>
            Customer Report
          </Link>
          <Link href='/admin/courses' className='flex items-center gap-2 bg-[#1F3A34] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F3A34]/90 transition-colors'>
            Manage Courses
          </Link>
        </div>
        <AdminUsersTable users={users} />
      </main>
    </div>
  )
}
