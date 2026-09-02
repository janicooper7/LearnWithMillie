import { Rocket, Megaphone, Target, BookOpen, Sparkles, TrendingUp } from 'lucide-react'

// "What you'll learn", rebuilt as six icon cards. The old version was six full
// sentences in a two-column list — accurate but unreadable at a glance. Each
// card now leads with the outcome in three or four words and keeps the detail
// to a single supporting line.
const outcomes = [
  {
    icon: Rocket,
    title: 'Launch your career',
    body: 'TEFL choice, platform applications, tech, rates, and a profile that converts.',
  },
  {
    icon: Megaphone,
    title: 'Fill your calendar',
    body: 'A marketing system across five channels — the LMNOP method and 10 Holograms.',
  },
  {
    icon: Target,
    title: 'Convert 80% of trials',
    body: 'The 5-phase trial framework that took my conversion from 50% to over 80%.',
  },
  {
    icon: BookOpen,
    title: 'Teach lessons they rebook',
    body: 'A 50-minute structure refined across 4,000+ real lessons, A1 to C2.',
  },
  {
    icon: Sparkles,
    title: 'Win back 5–8 hours a week',
    body: 'AI workflows for lesson planning, materials, and vocab lists.',
  },
  {
    icon: TrendingUp,
    title: 'Build a career that lasts',
    body: 'Set your rates, keep students for years, and scale with the SCALE framework.',
  },
]

export default function CourseOutcomes() {
  return (
    <section>
      <h2
        className="mb-7 text-3xl font-bold md:text-4xl"
        style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        What you’ll walk away with
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {outcomes.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl bg-white p-6"
            style={{ border: '1px solid #E2D6C4' }}
          >
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'rgba(31,58,52,0.07)' }}
            >
              <Icon className="h-6 w-6" style={{ color: '#1F3A34' }} strokeWidth={1.75} />
            </span>
            <p
              className="mb-1.5 text-xl font-bold leading-snug"
              style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {title}
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'rgba(31,58,52,0.65)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
