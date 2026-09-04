-- Product-specific follow-up drip for marketing-list subscribers.
--
-- Existing rows get followUp = NULL, so nobody already on the list is
-- retroactively enrolled and mailed a pitch they never asked for. The track is
-- only ever set at signup, by /api/subscribe.
ALTER TABLE "Subscriber" ADD COLUMN "followUp" TEXT;
ALTER TABLE "Subscriber" ADD COLUMN "followUpStep" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Subscriber" ADD COLUMN "followUpStartedAt" TIMESTAMP(3);
ALTER TABLE "Subscriber" ADD COLUMN "followUpNextAt" TIMESTAMP(3);
ALTER TABLE "Subscriber" ADD COLUMN "followUpSentAt" TIMESTAMP(3);
ALTER TABLE "Subscriber" ADD COLUMN "followUpAttempts" INTEGER NOT NULL DEFAULT 0;

-- The cron's only query is "which rows are due", so it reads this index and
-- returns nothing in most hours.
CREATE INDEX "Subscriber_followUpNextAt_idx" ON "Subscriber"("followUpNextAt");
