import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { enrolInJourney } from '@/lib/email/runner'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Stored lowercase, always. Postgres unique indexes are case-sensitive, so
    // "Sam@x.com" and "sam@x.com" were two separate accounts — the Stripe credit
    // landed on one and the person signed in to the other.
    const normalisedEmail = (email as string).trim().toLowerCase()

    // Case-insensitive so an account created before this normalisation still
    // blocks a duplicate rather than becoming one.
    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalisedEmail, mode: 'insensitive' } },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const assignedRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT'

    const user = await prisma.user.create({
      data: { name, email: normalisedEmail, password: hashed, role: assignedRole },
    })

    // Puts them on the onboarding sequence for their role and sends the welcome
    // email. Awaited rather than fired and forgotten because the request is
    // killed the moment we respond, but never allowed to fail the signup — an
    // SMTP hiccup must not cost us the account.
    try {
      await enrolInJourney(user.id, assignedRole)
    } catch (err) {
      console.error('[register] welcome email failed for', user.email, err)
    }

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
