import { prisma } from '@/lib/prisma'
import { profileFromAnswers, type FinderAnswers } from '@/app/teachers/platform-finder/platforms'
import { sendPlatformFinderResults } from '@/lib/platformFinderEmail'

function resultUrl(id: string): string {
  const base = process.env.NEXTAUTH_URL ?? ''
  return `${base}/teachers/platform-finder?id=${id}`
}

// Marks a Platform Finder result as paid and emails the customer their matches
// + shareable link. Safe to call from multiple places (webhook and the result
// endpoint) and multiple times — the email is sent exactly once via an atomic
// claim on `emailedAt`.
export async function finalizePlatformFinderResult(id: string, email: string | null): Promise<void> {
  if (!email) {
    // No email to send to — still unlock the record so the link works.
    await prisma.platformFinderResult.updateMany({
      where: { id, paid: false },
      data: { paid: true },
    })
    return
  }

  // Atomically claim the email send. Only the caller that flips emailedAt
  // from null wins the right to send, so the customer never gets duplicates.
  const claim = await prisma.platformFinderResult.updateMany({
    where: { id, emailedAt: null },
    data: { paid: true, email, emailedAt: new Date() },
  })
  if (claim.count !== 1) return // already finalized elsewhere

  const row = await prisma.platformFinderResult.findUnique({ where: { id } })
  if (!row) return

  const profile = profileFromAnswers(row.answers as unknown as FinderAnswers)
  if (!profile) {
    console.warn('Platform Finder finalize: incomplete answers, no email sent', { id })
    return
  }

  try {
    await sendPlatformFinderResults(email, profile, resultUrl(id))
    console.log('Platform Finder results emailed', { id, email })
  } catch (err: any) {
    console.error('Platform Finder results email failed:', err.message)
  }
}
