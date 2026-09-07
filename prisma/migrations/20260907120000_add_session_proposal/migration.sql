-- Sessions Millie booked for someone, waiting on them to confirm.
--
-- Proposing creates the real Cal booking up front, so the slot is held from the
-- moment she picks it. This table is the agreement layer on top: which booking,
-- for whom, and whether they have answered yet.

CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN');

CREATE TABLE "SessionProposal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "eventTypeSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "timeZone" TEXT NOT NULL,
    "message" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionProposal_pkey" PRIMARY KEY ("id")
);

-- One Cal booking is one proposal. Without this, two rows against the same uid
-- could each try to cancel it and each hand back a credit.
CREATE UNIQUE INDEX "SessionProposal_bookingUid_key" ON "SessionProposal"("bookingUid");

-- "What is this person sitting on" — the dashboard card.
CREATE INDEX "SessionProposal_userId_status_idx" ON "SessionProposal"("userId", "status");

-- "What has run out of time" — the cron sweep, which returns nothing most runs.
CREATE INDEX "SessionProposal_status_expiresAt_idx" ON "SessionProposal"("status", "expiresAt");

ALTER TABLE "SessionProposal" ADD CONSTRAINT "SessionProposal_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
