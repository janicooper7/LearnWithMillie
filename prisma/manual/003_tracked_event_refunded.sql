-- TrackedEvent.refundedAt: marks a 'purchased' row whose Stripe charge was
-- fully refunded, so /admin/report can show the sale as refunded and keep it
-- out of revenue instead of deleting the history. Set by the charge.refunded
-- branch of the Stripe webhook. Applied by hand for the same reason as 001:
--
--   npx prisma db execute --file prisma/manual/003_tracked_event_refunded.sql
--
-- Idempotent, so re-running it is harmless.

ALTER TABLE "TrackedEvent" ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3);
