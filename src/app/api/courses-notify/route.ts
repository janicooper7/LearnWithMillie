import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    await sendMail({
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER || '',
      subject: `New Courses Notification Sign-up: ${name}`,
      html: `
        <h2>New Courses Launch Notification Sign-up</h2>
        <p>Someone has signed up to be notified when the Teacher Courses launch.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    })

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('[courses-notify] Error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
