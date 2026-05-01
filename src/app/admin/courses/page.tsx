'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, Package } from 'lucide-react'

type Lesson = {
  id: string
  title: string
  description: string | null
  vimeoId: string
  vimeoHash: string | null
  duration: number | null
  order: number
}

type Course = {
  id: string
  title: string
  slug: string
  description: string
  stripePriceId: string | null
  order: number
  isBundle: boolean
  bundleIncludes: string[]
  published: boolean
  thumbnail: string | null
  _count: { lessons: number; userAccess: number }
}

const EMPTY_COURSE: Omit<Course, 'id' | '_count'> = {
  title: '', slug: '', description: '', stripePriceId: '', order: 0,
  isBundle: false, bundleIncludes: [], published: false, thumbnail: '',
}
const EMPTY_LESSON: Omit<Lesson, 'id'> = {
  title: '', description: '', vimeoId: '', vimeoHash: '', duration: null, order: 0,
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({})
  const [lessonLoading, setLessonLoading] = useState<Record<string, boolean>>({})

  // Course form state
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE)
  const [courseSubmitting, setCourseSubmitting] = useState(false)

  // Lesson form state
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null) // courseId
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON)
  const [lessonSubmitting, setLessonSubmitting] = useState(false)

  async function loadCourses() {
    setLoading(true)
    const res = await fetch('/api/admin/courses')
    const data = await res.json()
    setCourses(data)
    setLoading(false)
  }

  async function loadLessons(courseId: string) {
    if (lessons[courseId]) return
    setLessonLoading((p) => ({ ...p, [courseId]: true }))
    const res = await fetch(`/api/admin/courses/${courseId}/lessons`)
    const data = await res.json()
    setLessons((p) => ({ ...p, [courseId]: data }))
    setLessonLoading((p) => ({ ...p, [courseId]: false }))
  }

  useEffect(() => { loadCourses() }, [])

  function openNewCourse() {
    setEditingCourse(null)
    setCourseForm(EMPTY_COURSE)
    setShowCourseForm(true)
  }

  function openEditCourse(c: Course) {
    setEditingCourse(c)
    setCourseForm({
      title: c.title, slug: c.slug, description: c.description,
      stripePriceId: c.stripePriceId ?? '', order: c.order,
      isBundle: c.isBundle, bundleIncludes: c.bundleIncludes,
      published: c.published, thumbnail: c.thumbnail ?? '',
    })
    setShowCourseForm(true)
  }

  async function submitCourse(e: React.FormEvent) {
    e.preventDefault()
    setCourseSubmitting(true)
    const payload = {
      ...courseForm,
      bundleIncludes: typeof courseForm.bundleIncludes === 'string'
        ? (courseForm.bundleIncludes as string).split(',').map((s) => s.trim()).filter(Boolean)
        : courseForm.bundleIncludes,
    }
    const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses'
    await fetch(url, {
      method: editingCourse ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setCourseSubmitting(false)
    setShowCourseForm(false)
    loadCourses()
  }

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course and all its lessons?')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    loadCourses()
  }

  function toggleExpand(courseId: string) {
    if (expandedId === courseId) {
      setExpandedId(null)
    } else {
      setExpandedId(courseId)
      loadLessons(courseId)
    }
  }

  function openNewLesson(courseId: string) {
    setEditingLesson(null)
    setLessonForm({ ...EMPTY_LESSON, order: (lessons[courseId]?.length ?? 0) })
    setShowLessonForm(courseId)
  }

  function openEditLesson(lesson: Lesson, courseId: string) {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title, description: lesson.description ?? '',
      vimeoId: lesson.vimeoId, vimeoHash: lesson.vimeoHash ?? '',
      duration: lesson.duration, order: lesson.order,
    })
    setShowLessonForm(courseId)
  }

  async function submitLesson(e: React.FormEvent, courseId: string) {
    e.preventDefault()
    setLessonSubmitting(true)
    const url = editingLesson
      ? `/api/admin/lessons/${editingLesson.id}`
      : `/api/admin/courses/${courseId}/lessons`
    await fetch(url, {
      method: editingLesson ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lessonForm),
    })
    setLessonSubmitting(false)
    setShowLessonForm(null)
    setLessons((p) => ({ ...p, [courseId]: [] }))
    loadLessons(courseId)
  }

  async function deleteLesson(lessonId: string, courseId: string) {
    if (!confirm('Delete this lesson?')) return
    await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' })
    setLessons((p) => ({ ...p, [courseId]: [] }))
    loadLessons(courseId)
  }

  const nonBundleSlugs = courses.filter((c) => !c.isBundle).map((c) => c.slug)

  return (
    <div className="min-h-screen bg-[#F4EDE4] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A34]">Course Management</h1>
            <p className="text-[#1F3A34]/50 text-sm mt-1">Create and manage online courses</p>
          </div>
          <button
            onClick={openNewCourse}
            className="flex items-center gap-2 bg-[#1F3A34] text-white px-4 py-2 rounded-lg hover:bg-[#1F3A34]/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>

        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-[#1F3A34] mb-5">
                {editingCourse ? 'Edit Course' : 'New Course'}
              </h2>
              <form onSubmit={submitCourse} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Title *</label>
                    <input required value={courseForm.title} onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Course 1 — Beginner English" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Slug *</label>
                    <input required value={courseForm.slug} onChange={(e) => setCourseForm((p) => ({ ...p, slug: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="course-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Display Order</label>
                    <input type="number" value={courseForm.order} onChange={(e) => setCourseForm((p) => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Description</label>
                    <textarea rows={3} value={courseForm.description} onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Stripe Price ID</label>
                    <input value={courseForm.stripePriceId ?? ''} onChange={(e) => setCourseForm((p) => ({ ...p, stripePriceId: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="price_..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F3A34] mb-1">Thumbnail URL</label>
                    <input value={courseForm.thumbnail ?? ''} onChange={(e) => setCourseForm((p) => ({ ...p, thumbnail: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
                  </div>
                  <div className="col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={courseForm.isBundle} onChange={(e) => setCourseForm((p) => ({ ...p, isBundle: e.target.checked }))}
                        className="w-4 h-4 accent-[#1F3A34]" />
                      <span className="text-sm text-[#1F3A34]">Is a bundle</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={courseForm.published} onChange={(e) => setCourseForm((p) => ({ ...p, published: e.target.checked }))}
                        className="w-4 h-4 accent-[#1F3A34]" />
                      <span className="text-sm text-[#1F3A34]">Published</span>
                    </label>
                  </div>
                  {courseForm.isBundle && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#1F3A34] mb-2">Included Course Slugs</label>
                      <div className="space-y-2">
                        {nonBundleSlugs.map((s) => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={courseForm.bundleIncludes.includes(s)}
                              onChange={(e) => {
                                setCourseForm((p) => ({
                                  ...p,
                                  bundleIncludes: e.target.checked
                                    ? [...p.bundleIncludes, s]
                                    : p.bundleIncludes.filter((x) => x !== s),
                                }))
                              }}
                              className="w-4 h-4 accent-[#1F3A34]"
                            />
                            <span className="text-sm text-[#1F3A34]">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={courseSubmitting}
                    className="flex-1 bg-[#1F3A34] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1F3A34]/90 disabled:opacity-50">
                    {courseSubmitting ? 'Saving…' : editingCourse ? 'Save Changes' : 'Create Course'}
                  </button>
                  <button type="button" onClick={() => setShowCourseForm(false)}
                    className="flex-1 border border-gray-200 text-[#1F3A34] py-2 rounded-lg text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#1F3A34] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-[#1F3A34]/10 overflow-hidden">
                {/* Course header */}
                <div className="flex items-center gap-4 p-5">
                  <button onClick={() => toggleExpand(course.id)} className="text-[#1F3A34]/40 hover:text-[#1F3A34] transition-colors">
                    {expandedId === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1F3A34]">{course.title}</span>
                      {course.isBundle && <Package className="w-4 h-4 text-[#C2AA6A]" />}
                      {course.published
                        ? <Eye className="w-4 h-4 text-green-500" />
                        : <EyeOff className="w-4 h-4 text-[#1F3A34]/30" />}
                    </div>
                    <div className="text-xs text-[#1F3A34]/40 mt-0.5 flex items-center gap-3">
                      <span>/{course.slug}</span>
                      <span>{course._count.lessons} lessons</span>
                      <span>{course._count.userAccess} students</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditCourse(course)} className="p-2 text-[#1F3A34]/40 hover:text-[#1F3A34] transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCourse(course.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons panel */}
                {expandedId === course.id && (
                  <div className="border-t border-[#1F3A34]/10 bg-[#F4EDE4]/50">
                    <div className="px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1F3A34]">Lessons</span>
                      <button
                        onClick={() => openNewLesson(course.id)}
                        className="flex items-center gap-1.5 text-xs bg-[#1F3A34] text-white px-3 py-1.5 rounded-lg hover:bg-[#1F3A34]/90 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Lesson
                      </button>
                    </div>

                    {/* Lesson Form */}
                    {showLessonForm === course.id && (
                      <div className="px-5 pb-4">
                        <form onSubmit={(e) => submitLesson(e, course.id)} className="bg-white rounded-xl p-4 border border-[#1F3A34]/10 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Lesson Title *</label>
                              <input required value={lessonForm.title} onChange={(e) => setLessonForm((p) => ({ ...p, title: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Introduction" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Vimeo Video ID *</label>
                              <input required value={lessonForm.vimeoId} onChange={(e) => setLessonForm((p) => ({ ...p, vimeoId: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="123456789" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Vimeo Hash (private)</label>
                              <input value={lessonForm.vimeoHash ?? ''} onChange={(e) => setLessonForm((p) => ({ ...p, vimeoHash: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="abc123def" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Duration (seconds)</label>
                              <input type="number" value={lessonForm.duration ?? ''} onChange={(e) => setLessonForm((p) => ({ ...p, duration: e.target.value ? Number(e.target.value) : null }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="300" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Order</label>
                              <input type="number" value={lessonForm.order} onChange={(e) => setLessonForm((p) => ({ ...p, order: Number(e.target.value) }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-[#1F3A34] mb-1">Description</label>
                              <textarea rows={2} value={lessonForm.description ?? ''} onChange={(e) => setLessonForm((p) => ({ ...p, description: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" disabled={lessonSubmitting}
                              className="flex-1 bg-[#1F3A34] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#1F3A34]/90 disabled:opacity-50">
                              {lessonSubmitting ? 'Saving…' : editingLesson ? 'Save Lesson' : 'Add Lesson'}
                            </button>
                            <button type="button" onClick={() => setShowLessonForm(null)}
                              className="flex-1 border border-gray-200 text-[#1F3A34] py-2 rounded-lg text-xs hover:bg-gray-50">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Lesson list */}
                    {lessonLoading[course.id] ? (
                      <div className="px-5 pb-4 text-sm text-[#1F3A34]/40">Loading…</div>
                    ) : (
                      <div className="px-5 pb-4 space-y-2">
                        {(lessons[course.id] ?? []).length === 0 && showLessonForm !== course.id && (
                          <p className="text-sm text-[#1F3A34]/40 py-2">No lessons yet.</p>
                        )}
                        {(lessons[course.id] ?? []).map((lesson, idx) => (
                          <div key={lesson.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#1F3A34]/10">
                            <span className="text-xs text-[#1F3A34]/30 w-5 text-right">{idx + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1F3A34] truncate">{lesson.title}</p>
                              <p className="text-xs text-[#1F3A34]/40">ID: {lesson.vimeoId}{lesson.duration ? ` · ${Math.floor(lesson.duration / 60)}m` : ''}</p>
                            </div>
                            <button onClick={() => openEditLesson(lesson, course.id)} className="p-1.5 text-[#1F3A34]/30 hover:text-[#1F3A34] transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteLesson(lesson.id, course.id)} className="p-1.5 text-red-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {courses.length === 0 && (
              <div className="text-center py-20 text-[#1F3A34]/40">
                <p>No courses yet. Create your first course.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
