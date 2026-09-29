import { ExternalLink, Link2 } from 'lucide-react'
import type { ResourceGroup } from '@/lib/courseResources'

type ModuleResources = { order: number; title: string; groups: ResourceGroup[] }

// Always-visible "Course resources" section below the course player — one card
// per module, styled to match the "Course must-haves" cards above it.
export default function CourseModuleResources({ modules }: { modules: ModuleResources[] }) {
  if (modules.length === 0) return null

  const hasAffiliate = modules.some((m) => m.groups.some((g) => g.links.some((l) => l.affiliate)))

  return (
    <section className="mt-8 border-t border-[#1F3A34]/10 pt-6">
      <div className="mb-2 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-[#C2AA6A]" />
        <h2 className="font-serif text-xl font-bold text-[#1F3A34]">Course resources</h2>
      </div>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#1F3A34]/70">
        Every website, tool and platform mentioned in the course, grouped by module.
        {hasAffiliate &&
          ' Some are affiliate links — they cost you nothing extra and help support the course.'}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <div
            key={m.order}
            className="flex items-start gap-4 rounded-2xl border border-[#1F3A34]/10 bg-white p-5"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1F3A34] font-serif text-lg font-bold text-[#C2AA6A]">
              {m.order}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold leading-snug text-[#1F3A34]">{m.title}</h3>
              {m.groups.map((group) => (
                <div key={group.heading ?? group.links[0].url} className="mt-3">
                  {group.heading && (
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F3A34]/50">
                      {group.heading}
                    </p>
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
          </div>
        ))}
      </div>
    </section>
  )
}
