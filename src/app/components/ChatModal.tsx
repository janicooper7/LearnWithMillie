'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  fromAdmin: boolean
  createdAt: string
}

interface ChatModalProps {
  userId?: string   // only required in admin mode
  userName: string
  isAdmin: boolean
  onClose: () => void
}

export default function ChatModal({ userId, userName, isAdmin, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(0)

  const fetchMessages = useCallback(async () => {
    const url = isAdmin ? `/api/admin/messages/${userId}` : '/api/messages'
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }, [isAdmin, userId])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 4000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length !== prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      prevLengthRef.current = messages.length
    }
  }, [messages])

  const send = async () => {
    const content = input.trim()
    if (!content || sending) return

    // Clear input and show message immediately (optimistic)
    setInput('')
    setSending(true)
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      content,
      fromAdmin: isAdmin,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    const url = isAdmin ? `/api/admin/messages/${userId}` : '/api/messages'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (res.ok) {
      // Replace optimistic message with real server data
      await fetchMessages()
    }
    setSending(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4'
      style={{ backgroundColor: 'rgba(31,58,52,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className='w-full sm:max-w-md flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden'
        style={{
          height: '560px',
          backgroundColor: 'white',
          border: '1px solid #EDE4D8',
          boxShadow: '0 24px 80px rgba(31,58,52,0.2)',
        }}
      >
        {/* Header */}
        <div
          className='flex items-center justify-between px-5 py-4 flex-shrink-0'
          style={{ backgroundColor: '#1F3A34' }}
        >
          <div>
            <p
              className='text-[10px] uppercase tracking-[0.2em] font-medium'
              style={{ color: 'rgba(194,170,106,0.7)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {isAdmin ? 'Conversation' : 'Message Millie'}
            </p>
            <p
              className='text-sm font-semibold text-white mt-0.5'
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {isAdmin ? userName : 'Millie Cooper'}
            </p>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200'
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.18)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
          >
            <X className='w-4 h-4 text-white' />
          </button>
        </div>

        {/* Messages area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3' style={{ backgroundColor: '#FAFAF8' }}>
          {messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full gap-2'>
              <div
                className='w-10 h-10 rounded-full flex items-center justify-center'
                style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
              >
                <Send className='w-4 h-4' style={{ color: 'rgba(31,58,52,0.3)' }} />
              </div>
              <p
                className='text-sm text-center max-w-[220px]'
                style={{ color: 'rgba(31,58,52,0.4)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {isAdmin ? 'No messages yet.' : 'Send a message to Millie — she typically replies within 24 hours.'}
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = isAdmin ? msg.fromAdmin : !msg.fromAdmin
            const isOptimistic = msg.id.startsWith('optimistic-')
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className='max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed'
                  style={{
                    backgroundColor: isMine ? '#1F3A34' : 'white',
                    color: isMine ? 'white' : '#1F3A34',
                    border: isMine ? 'none' : '1px solid #EDE4D8',
                    fontFamily: 'var(--font-inter), sans-serif',
                    borderBottomRightRadius: isMine ? '4px' : '16px',
                    borderBottomLeftRadius: isMine ? '16px' : '4px',
                    opacity: isOptimistic ? 0.7 : 1,
                  }}
                >
                  <p>{msg.content}</p>
                  <p className='text-[10px] mt-1.5' style={{ opacity: 0.45 }}>
                    {isOptimistic
                      ? 'Sending…'
                      : new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className='flex items-center gap-2 px-3 py-3 flex-shrink-0'
          style={{ borderTop: '1px solid #EDE4D8', backgroundColor: 'white' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder='Type a message…'
            className='flex-1 text-sm px-4 py-2.5 rounded-xl outline-none'
            style={{
              backgroundColor: '#F4EDE4',
              color: '#1F3A34',
              fontFamily: 'var(--font-inter), sans-serif',
              border: 'none',
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className='w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40'
            style={{ backgroundColor: '#1F3A34' }}
          >
            <Send className='w-4 h-4 text-white' />
          </button>
        </div>
      </div>
    </div>
  )
}
