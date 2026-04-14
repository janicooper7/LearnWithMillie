'use client'

import { useState } from 'react'
import { Users, GraduationCap } from 'lucide-react'
import CreditAdjuster from './CreditAdjuster'

type FilterType = 'ALL' | 'STUDENT' | 'TEACHER'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  allowance: number
  createdAt: Date
}

interface AdminUsersTableProps {
  users: User[]
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [filter, setFilter] = useState<FilterType>('ALL')

  const studentCount = users.filter((u) => u.role === 'STUDENT').length
  const teacherCount = users.filter((u) => u.role === 'TEACHER').length

  const filtered = filter === 'ALL' ? users : users.filter((u) => u.role === filter)

  const tabs: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Students', value: 'STUDENT' },
    { label: 'Teachers', value: 'TEACHER' },
  ]

  return (
    <>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8'>
        <div>
          <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            Admin Portal
          </p>
          <h1 className='text-3xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Users
          </h1>
        </div>

        {/* Stat cards */}
        <div className='flex items-center gap-3'>
          <div
            className='flex items-center gap-3 px-5 py-3 rounded-xl bg-white'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <Users className='w-4 h-4' style={{ color: '#1F3A34' }} />
            <div>
              <p className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>Students</p>
              <p className='text-xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {studentCount}
              </p>
            </div>
          </div>

          <div
            className='flex items-center gap-3 px-5 py-3 rounded-xl bg-white'
            style={{ border: '1px solid #EDE4D8' }}
          >
            <GraduationCap className='w-4 h-4' style={{ color: '#C2AA6A' }} />
            <div>
              <p className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>Teachers</p>
              <p className='text-xl font-bold leading-none' style={{ color: '#C2AA6A', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {teacherCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className='flex items-center gap-1 p-1 rounded-xl mb-6 w-fit' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
        {tabs.map((tab) => {
          const active = filter === tab.value
          const count = tab.value === 'ALL' ? users.length : tab.value === 'STUDENT' ? studentCount : teacherCount
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200'
              style={{
                backgroundColor: active ? 'white' : 'transparent',
                color: active ? '#1F3A34' : 'rgba(31,58,52,0.5)',
                fontFamily: 'var(--font-inter), sans-serif',
                boxShadow: active ? '0 1px 4px rgba(31,58,52,0.1)' : 'none',
              }}
            >
              {tab.label}
              <span
                className='text-[10px] font-semibold px-1.5 py-0.5 rounded-full'
                style={{
                  backgroundColor: active
                    ? tab.value === 'TEACHER' ? 'rgba(194,170,106,0.15)' : 'rgba(31,58,52,0.08)'
                    : 'transparent',
                  color: active
                    ? tab.value === 'TEACHER' ? '#C2AA6A' : '#1F3A34'
                    : 'rgba(31,58,52,0.4)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
        <table className='w-full'>
          <thead>
            <tr style={{ borderBottom: '1px solid #EDE4D8' }}>
              {['User', 'Email', 'Role', filter === 'TEACHER' ? 'Sessions' : 'Lessons', 'Joined'].map((col) => (
                <th
                  key={col}
                  className='text-left px-6 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold'
                  style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr
                key={user.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #EDE4D8' : 'none' }}
              >
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0'
                      style={{ backgroundColor: user.role === 'TEACHER' ? '#C2AA6A' : '#1F3A34' }}
                    >
                      {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                    </div>
                    <span className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {user.name ?? '—'}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <span className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {user.email}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span
                    className='text-[10px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full'
                    style={{
                      backgroundColor: user.role === 'TEACHER' ? 'rgba(194,170,106,0.15)' : 'rgba(31,58,52,0.07)',
                      color: user.role === 'TEACHER' ? '#C2AA6A' : '#1F3A34',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <CreditAdjuster userId={user.id} allowance={user.allowance} />
                </td>
                <td className='px-6 py-4'>
                  <span className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className='px-6 py-12 text-center text-sm' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
                  No {filter === 'STUDENT' ? 'students' : filter === 'TEACHER' ? 'teachers' : 'users'} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
