'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import ChatModal from './ChatModal'

interface Conversation {
  id: string
  name: string | null
  email: string
  role: string
  lastMessage: { content: string; fromAdmin: boolean; createdAt: string } | null
  unreadCount: number
}

export default function AdminMessagesPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    const res = await fetch('/api/admin/messages')
    if (res.ok) {
      setConversations(await res.json())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [fetchConversations])

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    return isToday
      ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <>
      {selected && (
        <ChatModal
          userId={selected.id}
          userName={selected.name}
          isAdmin={true}
          onClose={() => {
            setSelected(null)
            fetchConversations()
          }}
        />
      )}

      <div className='mt-12'>
        {/* Section header */}
        <div className='flex items-center gap-3 mb-6'>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] font-semibold mb-1' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
              Inbox
            </p>
            <h2 className='text-3xl font-bold flex items-center gap-3' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Messages
              {totalUnread > 0 && (
                <span
                  className='text-sm font-semibold px-3 py-1 rounded-full'
                  style={{ backgroundColor: '#C2AA6A', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {totalUnread} new
                </span>
              )}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className='bg-white rounded-2xl p-8 text-center' style={{ border: '1px solid #EDE4D8' }}>
            <p className='text-sm' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
              Loading…
            </p>
          </div>
        ) : conversations.length === 0 ? (
          <div className='bg-white rounded-2xl p-10 flex flex-col items-center gap-3' style={{ border: '1px solid #EDE4D8' }}>
            <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}>
              <MessageCircle className='w-5 h-5' style={{ color: 'rgba(31,58,52,0.3)' }} />
            </div>
            <p className='text-sm' style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}>
              No messages yet.
            </p>
          </div>
        ) : (
          <div className='bg-white rounded-2xl overflow-hidden' style={{ border: '1px solid #EDE4D8' }}>
            {conversations.map((conv, i) => (
              <button
                key={conv.id}
                onClick={() => setSelected({ id: conv.id, name: conv.name ?? conv.email })}
                className='w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-150'
                style={{
                  borderBottom: i < conversations.length - 1 ? '1px solid #EDE4D8' : 'none',
                  backgroundColor: conv.unreadCount > 0 ? 'rgba(194,170,106,0.04)' : 'white',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FAFAF8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = conv.unreadCount > 0 ? 'rgba(194,170,106,0.04)' : 'white' }}
              >
                {/* Avatar */}
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                  style={{ backgroundColor: '#1F3A34' }}
                >
                  {(conv.name ?? conv.email)[0].toUpperCase()}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-0.5'>
                    <p
                      className='text-sm font-semibold truncate'
                      style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
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
                      {conv.lastMessage.fromAdmin ? 'You: ' : ''}
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>

                {/* Right side — time + unread badge */}
                <div className='flex-shrink-0 flex flex-col items-end gap-1.5'>
                  {conv.lastMessage && (
                    <p
                      className='text-[11px]'
                      style={{ color: 'rgba(31,58,52,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {formatTime(conv.lastMessage.createdAt)}
                    </p>
                  )}
                  {conv.unreadCount > 0 ? (
                    <span
                      className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white'
                      style={{ backgroundColor: '#C2AA6A' }}
                    >
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <span className='w-5 h-5' />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
