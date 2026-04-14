'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, GraduationCap, MessageCircle } from 'lucide-react'
import CreditAdjuster from './CreditAdjuster'
import ChatModal from './ChatModal'

type FilterType = 'ALL' | 'STUDENT' | 'TEACHER' | 'MESSAGES'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  allowance: number
  createdAt: Date
}

interface Conversation {
  id: string
  name: string | null
  email: string
  role: string
  lastMessage: { content: string; fromAdmin: boolean; createdAt: string } | null
  unreadCount: number
}

interface AdminUsersTableProps {
  users: User[]
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null)

  const studentCount = users.filter((u) => u.role === 'STUDENT').length
  const teacherCount = users.filter((u) => u.role === 'TEACHER').length
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const fetchConversations = useCallback(async () => {
    const res = await fetch('/api/admin/messages', { cache: 'no-store' })
    if (res.ok) setConversations(await res.json())
  }, [])

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [fetchConversations])

  const filtered = filter === 'ALL' ? users : users.filter((u) => u.role === filter)

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const isToday = d.toDateString() === new Date().toDateString()
    return isToday
      ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const tabs: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'ALL', count: users.length },
    { label: 'Students', value: 'STUDENT', count: studentCount },
    { label: 'Teachers', value: 'TEACHER', count: teacherCount },
    { label: 'Messages', value: 'MESSAGES', count: totalUnread },
  ]

  return (
    <>
      {selectedUser && (
        <ChatModal
          userId={selectedUser.id}
          userName={selectedUser.name}
          isAdmin={true}
          onClose={() => {
            setSelectedUser(null)
            fetchConversations()
          }}
        />
      )}

      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8'>
        <div>
          <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            Admin Portal
          </p>
          <h1 className='text-3xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {filter === 'MESSAGES' ? 'Messages' : 'Users'}
          </h1>
        </div>

        {/* Stat cards — hidden on messages tab */}
        {filter !== 'MESSAGES' && (
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-3 px-5 py-3 rounded-xl bg-white' style={{ border: '1px solid #EDE4D8' }}>
              <Users className='w-4 h-4' style={{ color: '#1F3A34' }} />
              <div>
                <p className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>Students</p>
                <p className='text-xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{studentCount}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 px-5 py-3 rounded-xl bg-white' style={{ border: '1px solid #EDE4D8' }}>
              <GraduationCap className='w-4 h-4' style={{ color: '#C2AA6A' }} />
              <div>
                <p className='text-[10px] uppercase tracking-[0.12em]' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>Teachers</p>
                <p className='text-xl font-bold leading-none' style={{ color: '#C2AA6A', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{teacherCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className='flex items-center gap-1 p-1 rounded-xl mb-6 w-fit' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
        {tabs.map((tab) => {
          const active = filter === tab.value
          const isMessages = tab.value === 'MESSAGES'
          const isTeacher = tab.value === 'TEACHER'
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
              {isMessages && <MessageCircle className='w-3.5 h-3.5' />}
              {tab.label}
              {/* Only show count badge if there's something to show */}
              {(tab.count > 0 || isMessages) && (
                <span
                  className='text-[10px] font-semibold px-1.5 py-0.5 rounded-full'
                  style={{
                    backgroundColor: active
                      ? isMessages ? 'rgba(194,170,106,0.15)'
                      : isTeacher ? 'rgba(194,170,106,0.15)'
                      : 'rgba(31,58,52,0.08)'
                      : isMessages && tab.count > 0 ? 'rgba(194,170,106,0.2)' : 'transparent',
                    color: active
                      ? isMessages || isTeacher ? '#C2AA6A' : '#1F3A34'
                      : isMessages && tab.count > 0 ? '#C2AA6A' : 'rgba(31,58,52,0.4)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Messages panel */}
      {filter === 'MESSAGES' && (
        <div className='bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
          {conversations.length === 0 ? (
            <div className='flex flex-col items-center gap-3 py-12'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
                <MessageCircle className='w-5 h-5' style={{ color: 'rgba(31,58,52,0.3)' }} />
              </div>
              <p className='text-sm' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
                No messages yet.
              </p>
            </div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={conv.id}
                onClick={() => setSelectedUser({ id: conv.id, name: conv.name ?? conv.email })}
                className='w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-150'
                style={{
                  borderBottom: i < conversations.length - 1 ? '1px solid #EDE4D8' : 'none',
                  backgroundColor: conv.unreadCount > 0 ? 'rgba(194,170,106,0.04)' : 'white',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FAFAF8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = conv.unreadCount > 0 ? 'rgba(194,170,106,0.04)' : 'white' }}
              >
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                  style={{ backgroundColor: conv.role === 'TEACHER' ? '#C2AA6A' : '#1F3A34' }}
                >
                  {(conv.name ?? conv.email)[0].toUpperCase()}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-0.5'>
                    <p className='text-sm font-semibold truncate' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {conv.name ?? conv.email}
                    </p>
                    <span
                      className='text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 rounded-full flex-shrink-0'
                      style={{
                        backgroundColor: conv.role === 'TEACHER' ? 'rgba(194,170,106,0.15)' : 'rgba(31,58,52,0.07)',
                        color: conv.role === 'TEACHER' ? '#C2AA6A' : '#1F3A34',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {conv.role}
                    </span>
                  </div>
                  {conv.lastMessage && (
                    <p
                      className='text-xs truncate'
                      style={{
                        color: 'rgba(31,58,52,0.5)',
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontWeight: conv.unreadCount > 0 ? 500 : 400,
                      }}
                    >
                      {conv.lastMessage.fromAdmin ? 'You: ' : ''}{conv.lastMessage.content}
                    </p>
                  )}
                </div>

                <div className='flex-shrink-0 flex flex-col items-end gap-1.5'>
                  {conv.lastMessage && (
                    <p className='text-[11px]' style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {formatTime(conv.lastMessage.createdAt)}
                    </p>
                  )}
                  {conv.unreadCount > 0 ? (
                    <span className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white' style={{ backgroundColor: '#C2AA6A' }}>
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <span className='w-5 h-5' />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Users table */}
      {filter !== 'MESSAGES' && (
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
                <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #EDE4D8' : 'none' }}>
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
                    <span className='text-sm' style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}>{user.email}</span>
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
      )}
    </>
  )
}
