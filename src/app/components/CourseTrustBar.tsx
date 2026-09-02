import { ShieldCheck, Infinity as InfinityIcon, PlayCircle, FileText, Check } from 'lucide-react'

// Trust badges, sat directly under the hero. A cold visitor decides whether to
// keep reading in a couple of seconds, so the four things that de-risk the
// purchase get large icons and short labels rather than being buried as line
// items further down the page.
const badges = [
  {
    icon: ShieldCheck,
    title: '7-day guarantee',
    sub: 'Full refund, one email',
  },
  {
    icon: InfinityIcon,
    title: 'Lifetime access',
    sub: 'Buy once, keep forever',
  },
  {
    icon: PlayCircle,
    title: '35 video modules',
    sub: '~350 min, fully self-paced',
  },
  {
    icon: FileText,
    title: 'Templates included',
    sub: 'Worksheets, scripts & tools',
  },
]

// What every purchase carries, whichever course it is. These are the plain
// mechanics of access rather than selling points, so they sit as a quiet
// checklist beneath the badges instead of competing with them.
const included = [
  'Full video course access',
  'Structured lesson path',
  'Progress tracking',
  'Lifetime access',
  'All future updates included',
]

export default function CourseTrustBar() {
  return (
    <section
      className="overflow-hidden rounded-2xl bg-white"
      style={{ border: '1px solid #E2D6C4' }}
      aria-label="Why teachers trust this course"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-5 py-7 sm:px-7 lg:grid-cols-4">
        {badges.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex flex-col items-center gap-2.5 text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(194,170,106,0.16)', border: '1px solid rgba(194,170,106,0.4)' }}
            >
              <Icon className="h-7 w-7" style={{ color: '#C2AA6A' }} strokeWidth={1.75} />
            </span>
            <span>
              <span
                className="block text-base font-bold leading-tight"
                style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {title}
              </span>
              <span
                className="mt-1 block text-sm leading-snug"
                style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {sub}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div
        className="px-5 py-6 sm:px-7"
        style={{ backgroundColor: '#FBF7F1', borderTop: '1px solid #EDE4D8' }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.22em]"
          style={{ color: 'rgba(31,58,52,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Every course includes
        </p>
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: '#C2AA6A' }}
              >
                <Check className="h-3 w-3" style={{ color: '#FFFFFF' }} strokeWidth={3} />
              </span>
              <span
                className="text-sm leading-snug"
                style={{ color: 'rgba(31,58,52,0.8)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
