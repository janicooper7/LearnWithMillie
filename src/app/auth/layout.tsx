import type { Metadata } from 'next'

// Auth pages are reached via many ?next=/?type= variants, so keep them out of
// the index (links on them are still followed). Pages set their own titles.
export const metadata: Metadata = {
  title: {
    default: 'Account',
    template: '%s | LearnWithMillie',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
