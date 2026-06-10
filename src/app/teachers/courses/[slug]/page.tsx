'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlayCircle, BookOpen, CheckCircle, Lock, ChevronRight } from 'lucide-react'

type Course = {
  id: string
  title: string
  slug: string
  description: string
  isBundle: boolean
  bundleIncludes: string[]
  thumbnail: string | null
  hasAccess: boolean
  _count: { lessons: number }
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((r) => r.json())
      .then((data) => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  async function handlePurchase() {
    setCheckoutLoading(true)
    try {
      const planKey = `course-${slug.replace('course-', '')}`
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'Unauthorized') {
        router.push('/auth/login')
      }
    } catch {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EDE4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1F3A34] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course || (course as any).error) {
    return (
      <div className="min-h-screen bg-[#F4EDE4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1F3A34]/60 mb-4">Course not found.</p>
          <Link href="/teachers/courses" className="text-[#1F3A34] font-semibold underline">Browse all courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4EDE4]">
      {/* Hero */}
      <div className="bg-[#1F3A34] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/teachers/courses" className="text-white/50 hover:text-white text-sm mb-6 inline-block transition-colors">
            ← All Courses
          </Link>
          {course.isBundle && (
            <span className="inline-block bg-[#C2AA6A] text-[#1F3A34] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              Complete Bundle
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{course.title}</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">{course.description}</p>
          <div className="flex items-center gap-6 mt-6 text-white/50 text-sm">
            <span className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4" />
              {course._count.lessons} video lessons
            </span>
            {course.isBundle && course.bundleIncludes.length > 0 && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {course.bundleIncludes.length + 1} courses included
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Lifetime access
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {course.isBundle && course.bundleIncludes.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#1F3A34] mb-4">What&apos;s Included</h2>
                <div className="space-y-3">
                  {[course.slug, ...course.bundleIncludes].map((s, i) => (
                    <div key={s} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="w-8 h-8 bg-[#C2AA6A]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#C2AA6A]">
                        {i + 1}
                      </div>
                      <span className="font-medium text-[#1F3A34] capitalize">{s.replace(/-/g, ' ')}</span>
                      <CheckCircle className="w-4 h-4 text-[#C2AA6A] ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-[#1F3A34] mb-4">What you&apos;ll get</h2>
              <div className="space-y-3">
                {[
                  'High-quality video lessons with Millie',
                  'Structured learning path with progress tracking',
                  'Lifetime access — learn at your own pace',
                  'All future updates to this course included',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C2AA6A] mt-0.5 flex-shrink-0" />
                    <span className="text-[#1F3A34]/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-5" />
              ) : (
                <div className="w-full h-40 bg-[#1F3A34] rounded-xl mb-5 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-[#C2AA6A]" />
                </div>
              )}

              {course.hasAccess ? (
                <>
                  <div className="flex items-center gap-2 text-[#C2AA6A] mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">You own this course</span>
                  </div>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#1F3A34] text-white font-bold py-3 rounded-xl hover:bg-[#1F3A34]/90 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" /> Start Learning
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePurchase}
                    disabled={checkoutLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#C2AA6A] text-[#1F3A34] font-bold py-3 rounded-xl hover:bg-[#C2AA6A]/90 transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <span className="w-4 h-4 border-2 border-[#1F3A34] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Enrol Now</>
                    )}
                  </button>
                  <p className="text-xs text-center text-[#1F3A34]/40 mt-3">One-time payment · Lifetime access</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
