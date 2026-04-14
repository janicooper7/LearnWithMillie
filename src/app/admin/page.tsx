import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminUsersTable from '@/app/components/AdminUsersTable'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, allowance: true, createdAt: true, image: true },
  })

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-6xl mx-auto px-6 py-12'>
        <AdminUsersTable users={users} />
      </main>
    </div>
  )
}
