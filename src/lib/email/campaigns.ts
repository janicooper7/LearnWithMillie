import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createBulkTransport } from "@/lib/email/send";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import type { BuiltEmail, JourneyContext } from "@/lib/email/types";

/**
 * One-off broadcasts to a segment, as opposed to the drip sequences in
 * journeys.ts.
 *
 * The difference that matters: a journey step is scheduled off the person's
 * own signup date and goes to everyone eventually, while a campaign goes once,
 * now, to whoever matches `audience` at the moment it runs. That makes them
 * the wrong tool for onboarding and the right tool for "everyone who hasn't
 * bought yet, before the September rush".
 *
 * Adding one:
 *   1. write its builder in ./messages/
 *   2. add an entry here with a key that has never been used before
 *   3. dry-run it from /api/admin/email-campaign to see who it would reach
 * The key is written to EmailCampaignSend the first time someone is mailed, so
 * reusing an old key silently excludes everyone who got the old email.
 */
export type Campaign = {
  /** What it is, for the admin dry-run output. */
  description: string;
  /** Who it goes to. The runner adds "not unsubscribed" and "not already
   *  sent this campaign" on top, so segments never repeat that themselves. */
  audience: Prisma.UserWhereInput;
  build: (ctx: JourneyContext) => BuiltEmail;
};

// Empty between broadcasts. A campaign is deleted once it has finished sending
// — the EmailCampaignSend rows are what record who was mailed, not this map, so
// removing an entry loses no history. Retiring a key does mean it stops being
// suppressed, so a future campaign must never reuse a key listed there.
//
// Typed by index signature rather than inferred from the literal, so an empty
// map doesn't collapse CampaignKey to `never` and take the admin route with it.
export const CAMPAIGNS: Record<string, Campaign> = {};

/** Stop a batch once this many sends fail back to back — a throttling mail
 *  server rejects everything, and hammering it just deepens the throttle. */
const MAX_CONSECUTIVE_FAILURES = 5;

export type CampaignKey = keyof typeof CAMPAIGNS;

export function isCampaignKey(value: string): value is CampaignKey {
  return value in CAMPAIGNS;
}

/**
 * The full recipient filter: the campaign's own segment, minus anyone who has
 * unsubscribed and anyone this campaign has already reached.
 *
 * A user with no EmailJourney row (nobody, in practice, but the relation is
 * optional) still counts as subscribed — the absence of a row is not consent
 * withdrawn.
 */
function recipientWhere(key: CampaignKey): Prisma.UserWhereInput {
  // Composed with AND rather than spread into one object: a segment is free to
  // use its own top-level OR, and a spread would silently drop the suppression
  // clauses on top of it.
  return {
    AND: [
      CAMPAIGNS[key].audience,
      {
        OR: [
          { emailJourney: { is: null } },
          { emailJourney: { is: { unsubscribedAt: null } } },
        ],
      },
      { campaignSends: { none: { campaign: key } } },
    ],
  };
}

/** How many people the campaign would still go to. */
export function countRemaining(key: CampaignKey): Promise<number> {
  return prisma.user.count({ where: recipientWhere(key) });
}

export type CampaignRun = {
  key: CampaignKey;
  /** Recipients outstanding before this batch ran. */
  matched: number;
  sent: number;
  failed: number;
  /** Still to go after this batch — call again while this is above zero. */
  remaining: number;
};

/**
 * Sends one batch of a campaign.
 *
 * Capped rather than exhaustive on purpose. It goes out over Gmail SMTP one
 * message at a time, which is slow enough that a few hundred recipients would
 * outlast any serverless function, so the caller runs it repeatedly until
 * `remaining` reaches zero. Nobody is mailed twice in the meantime because a
 * recipient is only ever picked up when they have no EmailCampaignSend row.
 *
 * The claim is that row, inserted before the message is built: the unique
 * index on (userId, campaign) means a second, overlapping run inserting the
 * same pair fails and skips the person instead of mailing them again. A send
 * that throws deletes its own row so the next batch retries it.
 */
export async function sendCampaign(
  key: CampaignKey,
  opts: { limit?: number } = {},
): Promise<CampaignRun> {
  const limit = opts.limit ?? 40;
  const campaign = CAMPAIGNS[key];
  // One authenticated connection for the whole batch. Opening a fresh one per
  // message is what made an earlier run stall on Gmail's login throttle.
  const mail = createBulkTransport();

  const matched = await countRemaining(key);
  const batch = await prisma.user.findMany({
    where: recipientWhere(key),
    // Oldest signups first, so a run split across several calls works through
    // the list in a stable order rather than reshuffling between batches.
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true, email: true, name: true },
  });

  let sent = 0;
  let failed = 0;
  // Consecutive failures. A campaign stops dead rather than working through
  // the whole list against a throttling or misconfigured server — every attempt
  // past the first few is just noise, and the recipients stay unclaimed for the
  // next run.
  let consecutiveFailures = 0;

  try {
    for (const user of batch) {
      let claim;
      try {
        claim = await prisma.emailCampaignSend.create({
          data: { userId: user.id, campaign: key },
          select: { id: true },
        });
      } catch {
        // Unique violation — another run already has this one.
        continue;
      }

      const context: JourneyContext = {
        name: user.name,
        email: user.email,
        unsubscribeUrl: unsubscribeUrl(user.id),
      };

      try {
        const { subject, html } = campaign.build(context);
        await mail.send({
          to: user.email,
          subject,
          html,
          unsubscribeUrl: context.unsubscribeUrl,
        });
        sent += 1;
        consecutiveFailures = 0;
      } catch (err) {
        failed += 1;
        consecutiveFailures += 1;
        // Hand the recipient back so a later batch can try again.
        await prisma.emailCampaignSend
          .delete({ where: { id: claim.id } })
          .catch(() => {});
        console.error(
          `[email-campaign] ${key} failed for ${user.email}`,
          err instanceof Error ? err.message : err,
        );
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.error(
            `[email-campaign] ${key} halted after ${consecutiveFailures} consecutive failures`,
          );
          break;
        }
      }
    }
  } finally {
    mail.close();
  }

  const remaining = await countRemaining(key);
  console.log("[email-campaign]", key, { matched, sent, failed, remaining });
  return { key, matched, sent, failed, remaining };
}
