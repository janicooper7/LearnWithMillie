import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iFluentify - Connect Through Words',
  description:
    'Professional English tutoring tailored to your needs. Business English, Conversation, and Interview Preparation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth overflow-x-hidden'>
      <head>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className='relative pt-16 overflow-x-hidden'>
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  )
}
