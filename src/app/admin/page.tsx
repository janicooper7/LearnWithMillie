import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Users } from 'lucide-react'
import CreditAdjuster from '@/app/components/CreditAdjuster'
import AdminMessagesPanel from '@/app/components/AdminMessagesPanel'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const students = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, allowance: true, createdAt: true, image: true },
  })

  const studentCount = students.filter((u) => u.role === 'STUDENT').length

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>

<main className='max-w-6xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-start justify-between mb-10'>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Admin Portal
            </p>
            <h1 className='text-3xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Students
            </h1>
          </div>
          <div
            className='flex items-center gap-3 px-5 py-3 rounded-xl bg-white'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <Users className='w-5 h-5' style={{ color: '#1F3A34' }} />
            <div>
              <p className='text-xs' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>Total Students</p>
              <p className='text-xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {studentCount}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
          <table className='w-full'>
            <thead>
              <tr style={{ borderBottom: '1px solid #EDE4D8' }}>
                <th className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Student
                </th>
                <th className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Email
                </th>
                <th className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Role
                </th>
                <th className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Lessons
                </th>
                <th className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr
                  key={student.id}
                  style={{ borderBottom: i < students.length - 1 ? '1px solid #EDE4D8' : 'none' }}
                >
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0'
                        style={{ backgroundColor: '#1F3A34' }}
                      >
                        {student.name?.[0]?.toUpperCase() ?? student.email[0].toUpperCase()}
                      </div>
                      <span className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {student.name ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {student.email}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full'
                      style={{
                        backgroundColor: student.role === 'ADMIN' ? 'rgba(194,170,106,0.15)' : 'rgba(31,58,52,0.07)',
                        color: student.role === 'ADMIN' ? '#C2AA6A' : '#1F3A34',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {student.role}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <CreditAdjuster userId={student.id} allowance={student.allowance} />
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {student.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-6 py-12 text-center text-sm' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    No students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Messages */}
        <AdminMessagesPanel />

      </main>
    </div>
  )
}
