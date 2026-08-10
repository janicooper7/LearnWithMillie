-- TrackedEvent: first-party analytics behind /admin/report.
--
-- Applied by hand rather than through `prisma migrate`, because this project's
-- migration history has drifted from the live database (several tables exist in
-- Neon with no corresponding migration file). Until that drift is repaired,
-- `prisma migrate dev` proposes dropping the production database, so additive
-- changes go through `prisma db execute` with this file instead.
--
--   npx prisma db execute --file prisma/manual/001_tracked_event.sql
--
-- Every statement is idempotent, so re-running it is harmless.

CREATE TABLE IF NOT EXISTS "TrackedEvent" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "funnel" TEXT,
    "step" TEXT,
    "path" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'direct',
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "value" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TrackedEvent_createdAt_idx" ON "TrackedEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "TrackedEvent_funnel_step_createdAt_idx" ON "TrackedEvent"("funnel", "step", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackedEvent_sessionId_idx" ON "TrackedEvent"("sessionId");
CREATE INDEX IF NOT EXISTS "TrackedEvent_channel_createdAt_idx" ON "TrackedEvent"("channel", "createdAt");
