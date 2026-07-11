import { Leaf } from 'lucide-react'

type Variant = 'card' | 'inline'

/**
 * Stripe Climate contribution badge.
 * A portion of every purchase goes toward removing CO₂ from the atmosphere.
 * We surface the initiative — not the exact percentage.
 */
export default function ClimateBadge({
  variant = 'card',
}: {
  variant?: Variant
}) {
  if (variant === 'inline') {
    return (
      <div
        className='inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl'
        style={{
          backgroundColor: 'rgba(31,58,52,0.05)',
          border: '1px solid rgba(31,58,52,0.12)',
        }}
      >
        <span
          className='flex items-center justify-center rounded-lg flex-shrink-0'
          style={{ width: 28, height: 28, backgroundColor: '#1F3A34' }}
        >
          <Leaf className='w-4 h-4' style={{ color: '#C2AA6A' }} strokeWidth={2.2} />
        </span>
        <span
          className='text-xs font-semibold leading-snug'
          style={{
            color: 'rgba(31,58,52,0.8)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          We remove CO₂ from the atmosphere
          <span
            className='block text-[11px] font-medium'
            style={{ color: 'rgba(31,58,52,0.55)' }}
          >
            Member of Stripe Climate
          </span>
        </span>
      </div>
    )
  }

  return (
    <div
      className='inline-flex items-center gap-3.5 px-5 py-4 rounded-2xl'
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EDE4D8',
        boxShadow: '0 2px 10px -6px rgba(31,58,52,0.15)',
      }}
    >
      <span
        className='flex items-center justify-center rounded-xl flex-shrink-0'
        style={{ width: 44, height: 44, backgroundColor: '#1F3A34' }}
      >
        <Leaf className='w-5 h-5' style={{ color: '#C2AA6A' }} strokeWidth={2.2} />
      </span>
      <span
        className='text-left'
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <span
          className='block text-sm font-bold'
          style={{ color: '#1F3A34' }}
        >
          A greener way to learn
        </span>
        <span
          className='block text-xs font-medium leading-snug mt-0.5'
          style={{ color: 'rgba(31,58,52,0.65)' }}
        >
          A share of every purchase helps remove CO₂ from the atmosphere with
          Stripe Climate.
        </span>
      </span>
    </div>
  )
}
