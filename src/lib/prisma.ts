import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
  // Pooled TCP driver against the Neon -pooler endpoint. The HTTP driver was
  // faster on cold starts but rejects transactions, which breaks every
  // prisma.upsert() in the app (auth sign-in, Stripe webhook, lesson progress).
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
