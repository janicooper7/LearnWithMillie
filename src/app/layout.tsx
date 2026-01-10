import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'
import StructuredData from './components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluentify.com'
const siteName = 'Fluentify'
const defaultTitle =
  'Fluentify - Professional English Tutoring | Business English & Interview Prep'
const defaultDescription =
  'Professional English tutoring tailored to your needs. Learn Business English, improve your conversational skills, and prepare for job interviews with personalized lessons from a certified TEFL teacher in London.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'English tutoring',
    'Business English',
    'English conversation',
    'Interview preparation',
    'TEFL teacher',
    'Online English lessons',
    'English tutor London',
    'ESL lessons',
    'English speaking practice',
    'Professional English',
  ],
  authors: [{ name: 'Millie Cooper' }],
  creator: 'Millie Cooper',
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/images/HeaderImage.png',
        width: 1200,
        height: 630,
        alt: 'Professional English tutoring with Fluentify',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/images/HeaderImage.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
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
        <StructuredData />
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
