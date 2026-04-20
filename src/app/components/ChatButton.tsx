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
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)

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

  useEffect(() => {
    const timer = setTimeout(() => setBubbleVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
    setBubbleDismissed(true)
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
      <div className='fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3'>

        {/* Auto speech bubble */}
        {!open && (
          <div
            className='relative transition-all duration-500'
            style={{
              opacity: bubbleVisible && !bubbleDismissed ? 1 : 0,
              transform: bubbleVisible && !bubbleDismissed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
              pointerEvents: bubbleVisible && !bubbleDismissed ? 'auto' : 'none',
            }}
          >
            <div
              className='relative px-4 py-3 rounded-2xl shadow-xl max-w-[220px]'
              style={{ backgroundColor: 'white', border: '1px solid #EDE4D8' }}
            >
              {/* Dismiss button */}
              <button
                onClick={() => setBubbleDismissed(true)}
                className='absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center shadow transition-colors duration-150'
                style={{ backgroundColor: '#1F3A34' }}
                aria-label='Dismiss'
              >
                <X className='w-3 h-3 text-white' />
              </button>

              <p className='text-sm font-medium leading-snug' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                Need any help? Feel free to get in touch! 👋
              </p>

              {/* Tail pointing down-right */}
              <div
                className='absolute -bottom-[7px] right-6'
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '7px solid white',
                  filter: 'drop-shadow(0 1px 0 #EDE4D8)',
                }}
              />
            </div>
          </div>
        )}

        {/* Hover label */}
        <div className='flex items-center gap-3'>
          <div
            className='relative transition-all duration-300'
            style={{
              opacity: hovered && !open && (bubbleDismissed || !bubbleVisible) ? 1 : 0,
              transform: hovered && !open ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.95)',
              pointerEvents: 'none',
            }}
          >
            <div
              className='px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-lg'
              style={{ backgroundColor: '#1F3A34', color: 'white', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Message Millie
            </div>
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
            <div className='transition-all duration-200' style={{ opacity: open ? 0 : 1, position: 'absolute' }}>
              <MessageCircle className='w-6 h-6 text-white' />
            </div>
            <div className='transition-all duration-200' style={{ opacity: open ? 1 : 0, position: 'absolute' }}>
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
      </div>
    </>
  )
}
