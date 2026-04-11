import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify()
    console.log('SMTP transporter is configured correctly')
    return true
  } catch (error) {
    console.error('SMTP transporter configuration error:', error)
    return false
  }
}

export async function POST(request: Request) {
  // Verify environment variables
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD ||
    !process.env.RECIPIENT_EMAIL
  ) {
    console.error('Missing required environment variables:', {
      hasSmtpHost: !!process.env.SMTP_HOST,
      hasSmtpPort: !!process.env.SMTP_PORT,
      hasSmtpUser: !!process.env.SMTP_USER,
      hasSmtpPassword: !!process.env.SMTP_PASSWORD,
      hasRecipientEmail: !!process.env.RECIPIENT_EMAIL,
    })
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  // Verify transporter configuration
  const isTransporterValid = await verifyTransporter()
  if (!isTransporterValid) {
    return NextResponse.json(
      { error: 'SMTP service configuration error' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    console.log('Received form submission:', { ...body, email: '[REDACTED]' })

    const { fullName, email, message } = body

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `LearnWithMillie enquiry from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)

    return NextResponse.json({
      message: 'Message sent successfully',
      messageId: info.messageId,
    })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
