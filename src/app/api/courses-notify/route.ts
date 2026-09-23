import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { escapeHtml } from '@/lib/escapeHtml'

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
      subject: `New Courses Notification Sign-up: ${String(name).replace(/[\r\n]+/g, ' ').slice(0, 100)}`,
      html: `
        <h2>New Courses Launch Notification Sign-up</h2>
        <p>Someone has signed up to be notified when the Teacher Courses launch.</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      `,
    })

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('[courses-notify] Error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
