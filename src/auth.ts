import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { authConfig } from '@/auth.config'
import { enrolInJourney } from '@/lib/email/runner'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Case-insensitive: new accounts are stored lowercase, but people type
        // their address however they like, and accounts created before emails
        // were normalised may still hold capitals.
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: (credentials.email as string).trim().toLowerCase(),
              mode: 'insensitive',
            },
          },
        })

        if (!user || !user.password) return null

        const { compare } = await import('bcryptjs')
        const valid = await compare(
          credentials.password as string,
          user.password
        )

        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        } as any
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        try {
          let assignedRole: 'STUDENT' | 'TEACHER' = 'STUDENT'
          try {
            const cookieStore = await cookies()
            if (cookieStore.get('_pending_role')?.value === 'TEACHER') {
              assignedRole = 'TEACHER'
            }
          } catch {
            // cookies() unavailable in this context — default to STUDENT
          }

          const normalisedEmail = user.email.trim().toLowerCase()

          // Whether this is a first sign-in is what decides if they get the
          // welcome email, and an upsert can't tell us which branch it took —
          // hence the read first. enrolInJourney is idempotent, so losing the
          // race against a concurrent sign-in still can't send two welcomes.
          // The match is case-insensitive so an account stored with capitals
          // is reused rather than duplicated alongside the lowercase one.
          const existing = await prisma.user.findFirst({
            where: { email: { equals: normalisedEmail, mode: 'insensitive' } },
            select: { id: true, role: true },
          })

          const dbUser = existing ?? await prisma.user.upsert({
            where: { email: normalisedEmail },
            update: {},
            create: {
              email: normalisedEmail,
              name: user.name ?? null,
              image: user.image ?? null,
              role: assignedRole,
            },
            select: { id: true, role: true },
          })
          ;(user as any).id = dbUser.id
          ;(user as any).role = dbUser.role

          if (!existing) {
            try {
              await enrolInJourney(dbUser.id, dbUser.role)
            } catch (err) {
              // Signing in must never fail because an email didn't go out.
              console.error('[auth] welcome email failed for', user.email, err)
            }
          }
        } catch {
          return false
        }
      }
      return true
    },
  },
})
