import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your LearnWithMillie account to access your lessons, courses and teaching tools.',
}

// Query params are read here on the server (not via useSearchParams in the form)
// so the page is fully server-rendered instead of bailing out to client rendering.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const { next } = await searchParams
  return <LoginForm next={typeof next === 'string' ? next : null} />
}
