import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import SessionProvider from './components/SessionProvider'
import GoogleAnalytics from './components/GoogleAnalytics'
import FacebookPixel from './components/FacebookPixel'
import TikTokPixel from './components/TikTokPixel'
import SiteTracking from './components/SiteTracking'
import StructuredData from './components/StructuredData'
import EmailSignupPopupLazy from './components/EmailSignupPopupLazy'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
const siteName = 'LearnWithMillie'
const defaultTitle =
  'LearnWithMillie - Professional English Tutoring | Business English & Interview Prep'
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
        url: '/images/webphoto.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional English tutoring with LearnWithMillie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/images/webphoto.jpg'],
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
  alternates: {
    canonical: siteUrl,
  },
  other: {
    // Trustpilot domain ownership check - safe to remove once verified
    'trustpilot-one-time-domain-verification-id':
      '7d6d2d62-a062-42b1-9fdf-575528ca6f28',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`scroll-smooth overflow-x-clip ${inter.variable} ${playfair.variable}`}>
      <head>
        {/* The tracking tags are held back until the visitor interacts or the
            deferral window closes, so a full preconnect here would open three
            sockets during load and let them go idle before anything used them.
            Resolving DNS early is the part that still pays off. */}
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />
        <link rel='dns-prefetch' href='https://connect.facebook.net' />
        <link rel='dns-prefetch' href='https://analytics.tiktok.com' />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <Suspense fallback={null}>
          <TikTokPixel />
        </Suspense>
        <StructuredData />
      </head>
      <body>
        <SiteTracking />
        <SessionProvider>
          <Navigation />
          <main className='relative pt-[72px] overflow-x-hidden'>
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
          {/* Inside SessionProvider: it only shows to signed-out visitors, so
              it needs to know whether there's a session. */}
          <EmailSignupPopupLazy />
        </SessionProvider>
      </body>
    </html>
  )
}
