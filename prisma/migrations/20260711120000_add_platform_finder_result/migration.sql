-- CreateTable
CREATE TABLE "PlatformFinderResult" (
    "id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "email" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "emailedAt" TIMESTAMP(3),
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformFinderResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformFinderResult_stripeSessionId_key" ON "PlatformFinderResult"("stripeSessionId");
