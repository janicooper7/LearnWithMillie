'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import ChatModal from './ChatModal'

interface ChatButtonProps {
  userName: string
}

export default function ChatButton({ userName }: ChatButtonProps) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

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

  // Clear badge when modal opens
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

      <div
        className='bg-white rounded-2xl p-6 flex items-center justify-between'
        style={{ border: '1px solid #EDE4D8' }}
      >
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div
              className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
            >
              <MessageCircle className='w-5 h-5' style={{ color: '#1F3A34' }} />
            </div>
            {unread > 0 && (
              <span
                className='absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white'
                style={{ backgroundColor: '#C2AA6A' }}
              >
                {unread}
              </span>
            )}
          </div>
          <div>
            <p
              className='text-sm font-semibold'
              style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Message Millie
              {unread > 0 && (
                <span
                  className='ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full'
                  style={{ backgroundColor: 'rgba(194,170,106,0.15)', color: '#C2AA6A' }}
                >
                  {unread} new
                </span>
              )}
            </p>
            <p
              className='text-xs mt-0.5'
              style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Questions? Get in touch directly.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpen}
          className='px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:brightness-110 flex-shrink-0'
          style={{
            backgroundColor: '#1F3A34',
            color: 'white',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          Open chat
        </button>
      </div>
    </>
  )
}
