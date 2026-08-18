import { buildStudentLessons } from '@/lib/email/messages/studentLessons'
import { buildStudentWelcome } from '@/lib/email/messages/studentWelcome'
import { buildTeacherProducts } from '@/lib/email/messages/teacherProducts'
import { buildTeacherWelcome } from '@/lib/email/messages/teacherWelcome'
import type { JourneyStep } from '@/lib/email/types'

/**
 * The onboarding sequences, one per audience. Students and teachers are sold
 * completely different things, so they never share a sequence — the journey a
 * user is put on is fixed at signup from their role.
 *
 * To add the next email in a sequence:
 *   1. write its builder in ./messages/
 *   2. append a step here with a fresh `key` and its `delayDays`
 * Existing enrolments pick it up automatically — anyone whose signup date is
 * already past the new offset gets it on the next cron run, so add steps with
 * an offset comfortably beyond where your live users are, or expect a burst.
 *
 * Never reorder or delete a step that has shipped: `step` on the stored row is
 * an index into this array, so changing the order re-points people mid-journey.
 */
export const JOURNEYS = {
  student: [
    {
      key: 'student-welcome',
      delayDays: 0,
      build: buildStudentWelcome,
    },
    {
      key: 'student-lessons',
      delayDays: 1,
      build: buildStudentLessons,
    },
  ] as JourneyStep[],

  teacher: [
    {
      key: 'teacher-welcome',
      delayDays: 0,
      build: buildTeacherWelcome,
    },
    {
      key: 'teacher-products',
      delayDays: 1,
      build: buildTeacherProducts,
    },
  ] as JourneyStep[],
}

export type JourneyName = keyof typeof JOURNEYS

export function isJourneyName(value: string): value is JourneyName {
  return value in JOURNEYS
}

/** Admins are staff, not an audience — they aren't enrolled in anything. */
export function journeyForRole(role: string): JourneyName | null {
  if (role === 'TEACHER') return 'teacher'
  if (role === 'STUDENT') return 'student'
  return null
}
