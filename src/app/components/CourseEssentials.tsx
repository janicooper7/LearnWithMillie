import { ExternalLink, ShoppingBag, BookOpen, Camera, Laptop } from 'lucide-react'
import type { CourseEssential } from '@/lib/courseEssentials'

export default function CourseEssentials({ items }: { items: CourseEssential[] }) {
  if (items.length === 0) return null

  return (
    <section className="mt-8 border-t border-[#1F3A34]/10 pt-6">
      <div className="mb-2 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-[#C2AA6A]" />
        <h2 className="font-serif text-xl font-bold text-[#1F3A34]">Course must-haves</h2>
      </div>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#1F3A34]/70">
        Our recommended kit and reading, gathered into handy Amazon lists. These are affiliate links, so they cost you
        nothing extra — and they help support the course.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.kind === 'books' ? BookOpen : item.kind === 'tools' ? Laptop : Camera
          return (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-[#1F3A34]/10 bg-white p-5 transition-all hover:border-[#C2AA6A]/60 hover:shadow-md"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1F3A34]">
                <Icon className="h-5 w-5 text-[#C2AA6A]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-snug text-[#1F3A34]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#1F3A34]/70">{item.description}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-[#C2AA6A] transition-colors group-hover:text-[#1F3A34]">
                  Shop the list on Amazon
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
