import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Erases a person (UK GDPR Article 17).
 *
 * Deleting the User cascades to everything hanging off it — messages, course
 * access, progress, journeys, proposals, follow-ups. What doesn't hang off it
 * is anything keyed by email address instead: the marketing list and Platform
 * Finder reports. Those are cleared here too, matched case-insensitively
 * because registration and the popup have not always normalised the same way.
 *
 * Deliberately NOT touched: Stripe's customer and payment records, which must
 * be kept for tax purposes (HMRC: six years), and Cal.com bookings, which are
 * handled in Cal. The privacy policy says so.
 */
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const email = { equals: user.email, mode: 'insensitive' as const }

  await prisma.$transaction([
    prisma.subscriber.deleteMany({ where: { email } }),
    // The report itself holds only quiz answers; the email is what makes it
    // this person's. Kept rather than deleted so a shared link still resolves.
    prisma.platformFinderResult.updateMany({ where: { email }, data: { email: null } }),
    // Outstanding password-reset links (see src/lib/passwordReset.ts).
    prisma.verificationToken.deleteMany({
      where: { identifier: { endsWith: `:${user.email.toLowerCase()}` } },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ])

  return NextResponse.json({ success: true })
}
