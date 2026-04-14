import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { authConfig } from '@/auth.config'

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
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

          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              role: assignedRole,
            },
            select: { id: true, role: true },
          })
          ;(user as any).id = dbUser.id
          ;(user as any).role = dbUser.role
        } catch {
          return false
        }
      }
      return true
    },
  },
})
