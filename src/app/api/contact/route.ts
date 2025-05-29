import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use an app password for Gmail
  },
})

export async function POST(request: Request) {
  try {
    const { fullName, email, lessonType, plan, message } = await request.json()

    // Validate required fields
    if (!fullName || !email || !lessonType || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL, // The email where you want to receive responses
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Lesson Type:</strong> ${lessonType}</p>
        <p><strong>Selected Plan:</strong> ${plan}</p>
        ${
          message
            ? `<p><strong>Additional Comments:</strong> ${message}</p>`
            : ''
        }
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
