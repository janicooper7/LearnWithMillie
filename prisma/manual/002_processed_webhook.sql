-- ProcessedWebhook: at-most-once guard for the Stripe and Cal.com webhooks
-- (src/lib/webhookIdempotency.ts).
--
-- The table was created by 20260411105032_add_processed_webhook and then
-- dropped an hour later by 20260411120458_add_trial_purchased, while the model
-- stayed in schema.prisma. Nothing used it until now, so the drift went
-- unnoticed. Restored by hand for the same reason as 001:
--
--   npx prisma db execute --file prisma/manual/002_processed_webhook.sql
--
-- Idempotent, so re-running it is harmless.

CREATE TABLE IF NOT EXISTS "ProcessedWebhook" (
    "id" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedWebhook_pkey" PRIMARY KEY ("id")
);
