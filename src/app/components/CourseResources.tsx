import { ExternalLink, Link2 } from 'lucide-react'
import type { ResourceGroup } from '@/lib/courseResources'

// Compact, low-footprint list of the external links referenced in a module.
// Sits between the lesson description and the Amazon "Course must-haves" cards.
export default function CourseResources({ groups }: { groups: ResourceGroup[] }) {
  if (groups.length === 0) return null

  const hasAffiliate = groups.some((g) => g.links.some((l) => l.affiliate))

  return (
    <section className="mt-8 border-t border-[#1F3A34]/10 pt-6">
      <div className="mb-2 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-[#C2AA6A]" />
        <h2 className="font-serif text-xl font-bold text-[#1F3A34]">Links &amp; resources</h2>
      </div>

      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.heading ?? group.links[0].url}>
            {group.heading && (
              <h3 className="mb-2 font-serif text-base font-bold text-[#1F3A34]">
                {group.heading}
              </h3>
            )}
            <ul className="flex flex-col gap-1.5">
              {group.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel={link.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                    className="group inline-flex items-start gap-1.5 text-sm font-medium leading-snug text-[#1F3A34] transition-colors hover:text-[#C2AA6A]"
                  >
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C2AA6A]" />
                    <span className="underline decoration-[#1F3A34]/30 underline-offset-2 group-hover:decoration-[#C2AA6A]">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {hasAffiliate && (
        <p className="mt-4 text-xs text-[#1F3A34]/40">
          Some of these are affiliate links — they cost you nothing extra and help support the course.
        </p>
      )}
    </section>
  )
}
