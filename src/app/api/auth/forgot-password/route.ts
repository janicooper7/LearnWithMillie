import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResetLink, buildResetEmail } from '@/lib/passwordReset'
import { sendMail } from '@/lib/mailer'

// Best-effort throttle. Instances aren't shared across serverless invocations,
// so this only blunts repeat submits from one warm instance — enough to stop a
// form being used to spam somebody's inbox.
const lastSent = new Map<string, number>()
const THROTTLE_MS = 60 * 1000

export async function POST(req: Request) {
  // The response never reveals whether an account exists — an attacker must not
  // be able to use this form to enumerate customer emails.
  const ok = NextResponse.json({ ok: true })

  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') return ok

    const normalised = email.trim().toLowerCase()

    const previous = lastSent.get(normalised)
    if (previous && Date.now() - previous < THROTTLE_MS) return ok
    lastSent.set(normalised, Date.now())

    const user = await prisma.user.findUnique({
      where: { email: normalised },
      select: { name: true },
    })
    if (!user) return ok

    const resetUrl = await createResetLink(normalised)
    const { subject, html } = buildResetEmail(resetUrl, user.name)
    await sendMail({ to: normalised, subject, html })

    return ok
  } catch (err) {
    console.error('[forgot-password]', err)
    return ok
  }
}
