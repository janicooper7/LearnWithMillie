import { Star } from 'lucide-react'
import { featuredTeacherTestimonials } from '@/lib/teacherTestimonials'

// Proof block for the course sales page. Leads with the specific outcome each
// teacher reported, because a named result converts where generic praise
// doesn't. Reads from the same array as the mentorship carousel.
//
// Framing note: these teachers followed Millie's free content and mentorship,
// not the paid trilogy — the copy below says so rather than implying they are
// course graduates.
export default function CourseTestimonials() {
  const [lead, ...rest] = featuredTeacherTestimonials

  return (
    <section className="mt-12">
      <h2
        className="mb-2 text-2xl font-bold"
        style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        Teachers who used these frameworks
      </h2>
      <p
        className="mb-6 text-base leading-relaxed"
        style={{ color: 'rgba(31,58,52,0.6)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Messages from teachers who applied Millie&rsquo;s methods — the same systems
        taught inside the trilogy.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {lead && <TestimonialCard t={lead} featured />}
        {rest.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>
    </section>
  )
}

function TestimonialCard({
  t,
  featured = false,
}: {
  t: (typeof featuredTeacherTestimonials)[number]
  featured?: boolean
}) {
  return (
    <figure
      className={`flex flex-col rounded-lg bg-white p-6 ${featured ? 'md:col-span-2' : ''}`}
      style={{ border: '1px solid #E2D6C4' }}
    >
      <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4" style={{ color: '#C2AA6A', fill: '#C2AA6A' }} />
        ))}
      </div>

      {t.result && (
        <p
          className={`mb-2.5 font-bold leading-snug ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}
          style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {t.result}
        </p>
      )}

      <blockquote
        className="flex-grow text-base leading-relaxed"
        style={{ color: 'rgba(31,58,52,0.75)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        &ldquo;{t.content}&rdquo;
      </blockquote>

      <figcaption
        className="mt-5 flex items-center gap-3 pt-4"
        style={{ borderTop: '1px solid #EDE4D8' }}
      >
        {t.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.photo}
            alt={t.name}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            style={{ border: '2px solid #C2AA6A' }}
          />
        ) : (
          <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
            aria-hidden="true"
          >
            {t.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span>
          <span
            className="block text-sm font-semibold"
            style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t.name}
          </span>
          <span
            className="block text-xs"
            style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t.role}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
