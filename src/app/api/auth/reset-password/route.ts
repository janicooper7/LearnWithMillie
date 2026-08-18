import { NextResponse } from 'next/server'
import { consumeResetToken } from '@/lib/passwordReset'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'This reset link is invalid.' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const email = await consumeResetToken(token, password)
    if (!email) {
      return NextResponse.json(
        { error: 'This reset link has expired or has already been used. Please request a new one.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, email })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
