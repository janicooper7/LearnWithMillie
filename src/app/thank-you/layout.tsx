import type { Metadata } from 'next'

// page.tsx is a client component and cannot export metadata itself
export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thanks for getting in touch — Millie will reply shortly.',
}

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
