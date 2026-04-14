'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import ChatModal from './ChatModal'

interface ChatButtonProps {
  userName: string
}

export default function ChatButton({ userName }: ChatButtonProps) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const check = async () => {
      const res = await fetch('/api/messages?unread=1')
      if (res.ok) {
        const data = await res.json()
        setUnread(data.count ?? 0)
      }
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
  }

  return (
    <>
      {open && (
        <ChatModal
          userName={userName}
          isAdmin={false}
          onClose={() => setOpen(false)}
        />
      )}

      {/* Floating widget */}
      <div className='fixed bottom-6 right-6 z-40 flex items-center gap-3'>

        {/* Speech bubble label */}
        <div
          className='relative transition-all duration-300'
          style={{
            opacity: hovered && !open ? 1 : 0,
            transform: hovered && !open ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.95)',
            pointerEvents: 'none',
          }}
        >
          <div
            className='px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-lg'
            style={{
              backgroundColor: '#1F3A34',
              color: 'white',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Message Millie
          </div>
          {/* Arrow pointing right */}
          <div
            className='absolute top-1/2 -translate-y-1/2 -right-[7px]'
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '7px solid #1F3A34',
            }}
          />
        </div>

        {/* FAB button */}
        <button
          onClick={open ? () => setOpen(false) : handleOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className='relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300'
          style={{
            backgroundColor: '#1F3A34',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
          aria-label='Message Millie'
        >
          {/* Icon toggles between chat and close */}
          <div
            className='transition-all duration-200'
            style={{ opacity: open ? 0 : 1, position: 'absolute' }}
          >
            <MessageCircle className='w-6 h-6 text-white' />
          </div>
          <div
            className='transition-all duration-200'
            style={{ opacity: open ? 1 : 0, position: 'absolute' }}
          >
            <X className='w-5 h-5 text-white' />
          </div>

          {/* Unread badge */}
          {unread > 0 && !open && (
            <span
              className='absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow'
              style={{ backgroundColor: '#C2AA6A' }}
            >
              {unread}
            </span>
          )}
        </button>
      </div>
    </>
  )
}
