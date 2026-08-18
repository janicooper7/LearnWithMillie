-- CreateTable
CREATE TABLE "EmailJourney" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journey" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "nextSendAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailJourney_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailJourney_userId_key" ON "EmailJourney"("userId");

-- CreateIndex
CREATE INDEX "EmailJourney_nextSendAt_idx" ON "EmailJourney"("nextSendAt");

-- AddForeignKey
ALTER TABLE "EmailJourney" ADD CONSTRAINT "EmailJourney_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
