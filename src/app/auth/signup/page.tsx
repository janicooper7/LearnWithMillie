import type { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Create an Account',
  description:
    'Create a free LearnWithMillie account — book English lessons as a student, or access courses and teaching tools as a teacher.',
}

// Query params are read here on the server (not via useSearchParams in the form)
// so the page is fully server-rendered instead of bailing out to client rendering.
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; type?: string | string[] }>
}) {
  const { next, type } = await searchParams
  return (
    <SignupForm
      next={typeof next === 'string' ? next : null}
      type={typeof type === 'string' ? type : null}
    />
  )
}
