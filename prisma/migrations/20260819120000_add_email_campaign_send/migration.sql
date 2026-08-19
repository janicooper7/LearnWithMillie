-- CreateTable
CREATE TABLE "EmailCampaignSend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailCampaignSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailCampaignSend_userId_campaign_key" ON "EmailCampaignSend"("userId", "campaign");

-- CreateIndex
CREATE INDEX "EmailCampaignSend_campaign_idx" ON "EmailCampaignSend"("campaign");

-- AddForeignKey
ALTER TABLE "EmailCampaignSend" ADD CONSTRAINT "EmailCampaignSend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
