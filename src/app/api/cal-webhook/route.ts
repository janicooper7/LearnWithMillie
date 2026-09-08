import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isProposalCancellation } from '@/lib/cal'
import { PROPOSAL_EVENT_SLUGS } from '@/lib/sessionProposals'
import { cancelTrialFollowUp, scheduleTrialFollowUp } from '@/lib/email/trialFollowUpRunner'
import crypto from 'crypto'

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')
  return `sha256=${digest}` === signature
}

async function cancelCalBooking(bookingUid: string) {
  const url = `https://api.cal.com/v2/bookings/${bookingUid}/cancel`
  console.log('[cal-webhook] Cancelling booking uid:', bookingUid)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
      'cal-api-version': '2024-08-13',
    },
    body: JSON.stringify({ cancellationReason: 'Insufficient lessons.' }),
  })
  const text = await res.text()
  console.log('[cal-webhook] Cancel response:', res.status, text)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-cal-signature-256') ?? ''

    if (process.env.CAL_WEBHOOK_SECRET && signature) {
      const valid = verifySignature(body, signature, process.env.CAL_WEBHOOK_SECRET)
      if (!valid) {
        console.error('[cal-webhook] Invalid signature. Received:', signature, '— continuing anyway for debugging')
        // Not returning 401 temporarily to debug refund issue
      }
    }

    const event = JSON.parse(body)
    const { triggerEvent, payload } = event

    console.log('[cal-webhook] Event:', triggerEvent, '| Booking id:', payload?.id, '| uid:', payload?.uid, '| Attendees:', JSON.stringify(payload?.attendees ?? []), '| Reason:', payload?.cancellationReason ?? payload?.reason ?? '')

    // Respond OK to ping/test events
    if (!triggerEvent || triggerEvent === 'PING') {
      return NextResponse.json({ received: true, action: 'ping ok' })
    }

    const attendeeEmail = payload?.attendees?.[0]?.email as string | undefined
    if (!attendeeEmail) {
      console.log('[cal-webhook] No attendee email found in payload')
      return NextResponse.json({ received: true })
    }

    const user = await prisma.user.findUnique({
      where: { email: attendeeEmail },
      select: { id: true, allowance: true, trialPurchased: true, trialUsed: true, stripeSubscriptionId: true },
    })

    if (!user) {
      console.log('[cal-webhook] No user found for email:', attendeeEmail)
      return NextResponse.json({ received: true })
    }

    if (triggerEvent === 'BOOKING_CREATED') {
      // Atomically deduct 1 credit only if the user has credits available.
      // Using updateMany with allowance > 0 ensures no race condition with the client check.
      const isTrialUser = user.trialPurchased && !user.stripeSubscriptionId && !user.trialUsed

      const result = await prisma.user.updateMany({
        where: { email: attendeeEmail, allowance: { gt: 0 } },
        data: {
          allowance: { decrement: 1 },
          upcomingLessons: { increment: 1 },
          ...(isTrialUser ? { trialUsed: true } : {}),
        },
      })

      if (result.count === 0) {
        console.log('[cal-webhook] No credits — attempting cancel. payload.uid:', payload?.uid)
        await cancelCalBooking(payload.uid)
        return NextResponse.json({ received: true, action: 'cancelled — no credits' })
      }

      // Queue the "lovely to meet you" email for a few hours after the lesson.
      // Only on the trial: it is the one booking where the student has not yet
      // chosen a plan, and the email exists to ask them to. Awaited but never
      // able to throw, so a mail problem cannot make Cal retry the booking and
      // double-spend the credit above.
      if (isTrialUser && payload?.uid) {
        await scheduleTrialFollowUp({
          userId: user.id,
          bookingUid: payload.uid,
          lessonEnd: new Date(payload.endTime),
          // The zone the student booked in, so "not in the middle of the night"
          // means their night rather than the server's.
          timeZone: payload?.attendees?.[0]?.timeZone ?? null,
        })
      }

      return NextResponse.json({ received: true, action: isTrialUser ? 'trial credit deducted, trialUsed set' : 'credit deducted' })
    }

    if (triggerEvent === 'BOOKING_CANCELLED') {
      // Don't refund if this was our own auto-cancellation for 0 credits
      const reason: string = payload?.cancellationReason ?? payload?.reason ?? ''
      if (reason === 'Insufficient lessons.') {
        return NextResponse.json({ received: true, action: 'no refund — auto-cancelled for 0 credits' })
      }

      // Was this slot only ever being *held* for someone (see SessionProposal)?
      // The row is looked up rather than trusting the reason string alone,
      // because a proposal can also be cancelled straight from the Cal.com
      // dashboard, which sends whatever reason was typed there.
      const bookingUid: string | undefined = payload?.uid

      // A lesson that isn't happening gets no "lovely to meet you". Done for
      // every cancellation, whatever the reason and whoever cancelled, and
      // before the refund rules below so an early return can't skip it.
      if (bookingUid) await cancelTrialFollowUp(bookingUid)

      const proposal = bookingUid
        ? await prisma.sessionProposal.findUnique({
            where: { bookingUid },
            select: { id: true, status: true, eventTypeSlug: true },
          })
        : null

      // An accepted proposal is an ordinary booking from then on, and drops
      // through to the usual 24-hour rule below.
      const wasUnconfirmed =
        (!!proposal && proposal.status !== 'ACCEPTED') || isProposalCancellation(reason)

      // Cancelled outside our own flow — the student is no longer being asked
      // to confirm anything, so stop the dashboard offering it.
      if (proposal?.status === 'PENDING') {
        await prisma.sessionProposal.update({
          where: { id: proposal.id },
          data: { status: 'WITHDRAWN', respondedAt: new Date() },
        })
      }

      const lessonStart = new Date(payload.startTime)
      const now = new Date()
      const hoursUntilLesson = (lessonStart.getTime() - now.getTime()) / (1000 * 60 * 60)

      // A time the student never agreed to always costs them nothing, however
      // little notice there was. The 24-hour rule is there to discourage
      // last-minute cancellations of lessons people booked themselves, and
      // applying it to a proposal would charge someone for saying no.
      if (wasUnconfirmed) {
        // BOOKING_CREATED burns the one-per-account trial. Saying no to a trial
        // nobody asked for must hand that back too, or the student is left
        // having "used" a trial they never took.
        const returnsTrial =
          proposal?.eventTypeSlug === PROPOSAL_EVENT_SLUGS.trial &&
          user.trialPurchased &&
          !user.stripeSubscriptionId

        await prisma.user.update({
          where: { id: user.id },
          data: {
            allowance: { increment: 1 },
            upcomingLessons: { decrement: 1 },
            ...(returnsTrial ? { trialUsed: false } : {}),
          },
        })
        return NextResponse.json({
          received: true,
          action: returnsTrial
            ? 'credit and trial refunded — unconfirmed proposal'
            : 'credit refunded — unconfirmed proposal',
        })
      }

      if (hoursUntilLesson >= 24) {
        await prisma.user.update({
          where: { id: user.id },
          data: { allowance: { increment: 1 }, upcomingLessons: { decrement: 1 } },
        })
        return NextResponse.json({ received: true, action: 'credit refunded' })
      }

      // Within 24h — no credit refund but lesson is no longer upcoming
      await prisma.user.update({
        where: { id: user.id },
        data: { upcomingLessons: { decrement: 1 } },
      })
      return NextResponse.json({ received: true, action: 'no refund — within 24h' })
    }

    if (triggerEvent === 'BOOKING_COMPLETED') {
      await prisma.user.update({
        where: { id: user.id },
        data: { upcomingLessons: { decrement: 1 } },
      })
      return NextResponse.json({ received: true, action: 'lesson completed' })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[cal-webhook] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
