'use client'

interface BookingTimeProps {
  start: string
  end: string
}

export default function BookingTime({ start, end }: BookingTimeProps) {
  const s = new Date(start)
  const e = new Date(end)

  return (
    <>
      <div className='text-center flex-shrink-0'>
        <p className='text-xs font-semibold uppercase' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
          {s.toLocaleDateString('en-GB', { month: 'short' })}
        </p>
        <p className='text-xl font-bold leading-none' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          {s.toLocaleDateString('en-GB', { day: 'numeric' })}
        </p>
      </div>
      <div className='w-px h-8 flex-shrink-0' style={{ backgroundColor: '#EDE4D8' }} />
      <div className='min-w-0'>
        <p className='text-sm font-medium' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
          {s.toLocaleDateString('en-GB', { weekday: 'long' })}
        </p>
        <p className='text-xs' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
          {s.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – {e.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </>
  )
}
