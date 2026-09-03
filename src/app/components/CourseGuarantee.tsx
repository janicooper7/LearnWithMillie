import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

// The 7-day guarantee, stated loudly rather than as a line item.
//
// The headline and the small print have to stay in step with /terms#courses —
// the terms ask that the buyer has watched the first module before requesting,
// so this never promises a no-questions refund it can't keep.
export default function CourseGuarantee() {
  // Full-bleed band. It sits between two cream sections, so the dark ground
  // does double duty: it makes the guarantee impossible to scroll past, and it
  // breaks up the page before the FAQ.
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: '#1F3A34',
        borderTop: '3px solid #C2AA6A',
        borderBottom: '3px solid #C2AA6A',
      }}
    >
      <div className="container py-12 md:py-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-9 md:text-left">
          <span
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full md:mt-1"
            style={{ backgroundColor: 'rgba(194,170,106,0.18)', border: '1px solid rgba(194,170,106,0.4)' }}
          >
            <ShieldCheck className="h-8 w-8" style={{ color: '#C2AA6A' }} />
          </span>

          <div>
            <h3
              className="mb-3 text-2xl font-bold md:text-3xl"
              style={{ color: '#FFFFFF', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Try the whole trilogy risk-free
            </h3>
            <p
              className="text-base leading-relaxed md:text-lg"
              style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Watch it, use it, put it to work. If it isn&rsquo;t right for you, one email
              to Millie within 7 days gets you a full refund — no forms and no
              awkward questions.
            </p>
            <p
              className="mt-4 text-xs leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              We just ask that you&rsquo;ve watched the first module before requesting, so
              the course has had a fair chance.{' '}
              <Link
                href="/terms#courses"
                className="underline decoration-[#C2AA6A] underline-offset-2 transition-opacity hover:opacity-70"
              >
                Full guarantee terms
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
