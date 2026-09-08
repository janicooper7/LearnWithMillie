-- The "lovely to meet you" email that follows a trial lesson.
--
-- Scheduled by the Cal webhook when a trial is booked and swept by the hourly
-- cron, so the send time is a column rather than an offset computed at read
-- time. Existing users get nothing retroactively: only a booking made after
-- this migration creates a row.
CREATE TABLE "TrialFollowUp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "lessonEnd" TIMESTAMP(3) NOT NULL,
    "sendAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrialFollowUp_pkey" PRIMARY KEY ("id")
);

-- One trial, one email: a replayed BOOKING_CREATED webhook must not be able to
-- queue the same follow-up twice.
CREATE UNIQUE INDEX "TrialFollowUp_bookingUid_key" ON "TrialFollowUp"("bookingUid");

-- The cron's only query is "which rows are due", so it reads this index and
-- returns nothing in most hours.
CREATE INDEX "TrialFollowUp_sendAt_idx" ON "TrialFollowUp"("sendAt");

ALTER TABLE "TrialFollowUp" ADD CONSTRAINT "TrialFollowUp_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
