import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | LearnWithMillie',
  description:
    'Terms and conditions for LearnWithMillie, including our cancellation policy, refund policy, trial lesson terms, and online course terms.',
}

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `These Terms and Conditions govern your use of LearnWithMillie and the English tutoring services provided by Millie Cooper. By booking a lesson or creating an account, you agree to be bound by these terms. Please read them carefully before making any purchase.`,
  },
  {
    id: 'bookings',
    title: 'Lesson Bookings',
    items: [
      'All lessons are 50 minutes in duration and conducted online via Google Meet.',
      'Lessons must be booked through your student dashboard using available lessons.',
      'A booking confirmation email will be sent to you immediately after scheduling.',
      'You are responsible for ensuring your technical setup (camera, microphone, and internet connection) is working prior to each session.',
      'Millie reserves the right to reschedule a lesson in exceptional circumstances, with as much notice as possible.',
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    items: [
      'You may cancel or reschedule a lesson up to 24 hours before the scheduled start time to receive a lesson refund.',
      'Cancellations made within 24 hours of the lesson start time are non-refundable and the lesson will not be returned.',
      'To cancel a lesson, use the link provided in your booking confirmation email or contact Millie directly.',
      'No-shows (failing to attend without prior notice) are treated as late cancellations and are non-refundable.',
      'If Millie is unable to attend a scheduled lesson, you will receive a full lesson refund regardless of notice period.',
    ],
  },
  {
    id: 'refunds',
    title: 'Refund Policy',
    items: [
      'Subscription payments are non-refundable once the billing period has commenced.',
      'Unused lessons do not carry over to the following billing period unless otherwise agreed in writing.',
      'If you cancel your subscription, you retain access to your remaining lessons until the end of the current billing period.',
      "Refunds will only be considered in exceptional circumstances at Millie's sole discretion.",
      'Any approved refunds will be processed to the original payment method within 5–10 business days.',
    ],
  },
  {
    id: 'trial',
    title: 'Trial Lessons',
    highlight: true,
    highlightText: 'Please read this section carefully. Trial lesson payments are final and non-refundable, and bookings cannot be changed once confirmed.',
    items: [
      'Trial lessons are available to new students only and may only be purchased once per account.',
      'Trial lessons are strictly non-refundable under any circumstances once payment has been completed.',
      'Trial lessons are non-amendable — the date and time cannot be changed once the booking is confirmed.',
      'If you do not attend your trial lesson, the lesson is forfeited and no refund or replacement will be issued.',
      'The trial lesson is intended as an introductory session and does not guarantee continuation of lessons.',
      'Trial lessons cannot be transferred to another account.',
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    items: [
      'Subscriptions are billed monthly on a recurring basis via Stripe.',
      'Your lesson allowance is refreshed at the start of each billing cycle.',
      'You may cancel your subscription at any time through your student dashboard. Cancellation takes effect at the end of the current billing period.',
      'Downgrading or upgrading your plan mid-cycle is not currently supported. Please cancel and re-subscribe to change plans.',
      "LearnWithMillie reserves the right to adjust pricing with 30 days' written notice.",
    ],
  },
  {
    id: 'conduct',
    title: 'Student Conduct',
    items: [
      'Students are expected to be respectful and professional during all sessions.',
      "Millie reserves the right to terminate a session and cancel a student's account if conduct is deemed inappropriate or abusive.",
      'Lessons are for personal use only and may not be recorded, shared, or redistributed without prior written consent.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `LearnWithMillie provides tutoring services on a best-efforts basis. While every effort is made to deliver high-quality lessons, no guarantees are made regarding specific learning outcomes or exam results. To the fullest extent permitted by law, Millie Cooper shall not be liable for any indirect, incidental, or consequential damages arising from the use of this service.`,
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    content: `We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our services following any changes constitutes acceptance of the revised terms.`,
  },
  {
    id: 'courses',
    title: 'Online Courses',
    highlight: true,
    highlightText: 'Every online course is backed by a 7-day money-back guarantee. If it is not right for you, you can request a full refund within 7 days of purchase — see the terms below.',
    content: `The following terms apply to all online courses sold through LearnWithMillie. By purchasing a course, you agree to be bound by these terms in addition to all other sections of these Terms and Conditions.`,
    items: [
      'Every course comes with a 7-day money-back guarantee. If you decide the course is not right for you, you may request a full refund within 7 days of your purchase date.',
      'To qualify for a refund, we ask that you have watched at least the first module of the course before requesting it — this simply helps ensure the course has had a fair chance to deliver value. Beyond that, no detailed justification is required.',
      'To request a refund, contact Millie directly via the contact form within the 7-day window, quoting the email address used at checkout. Approved refunds are processed to the original payment method within 5–10 business days.',
      'After the 7-day window has passed, course purchases are non-refundable, as you will have had full access to the course materials.',
      'Your statutory rights are not affected. Where the law provides a mandatory cooling-off period for digital content (including under the UK Consumer Contracts Regulations 2013 and Consumer Rights Act 2015), those rights apply. At checkout you may be asked to acknowledge that, by accessing the course content immediately, you agree to begin the service during the cooling-off period; the 7-day money-back guarantee above is offered in addition to, and never in place of, any rights you have by law.',
      'Course access is granted to the purchasing individual only and is non-transferable.',
      'You may not record, screenshot, screen-capture, or otherwise reproduce any part of the course content in any format.',
      'Sharing, distributing, re-uploading, or making available any course content — in whole or in part — outside of your own personal, private use is strictly prohibited.',
      'Unauthorised reproduction or distribution of course materials may constitute copyright infringement and/or breach of contract, and LearnWithMillie reserves the right to pursue legal action in such cases.',
      'Access to course content is provided for personal educational use only. You may not use course content for commercial purposes, resale, or to create derivative works.',
      'LearnWithMillie reserves the right to revoke access without refund if these terms are breached.',
    ],
  },
  {
    id: 'tutors',
    title: 'Tutor Mentorship Services',
    content: `Tutor mentorship services provided by LearnWithMillie are intended for guidance, education, and support purposes only. By purchasing or participating in mentorship, you acknowledge and agree that:`,
    items: [
      'No guarantees are made regarding income, client acquisition, business growth, or professional success',
      'Results will vary depending on individual effort, experience, and external factors beyond LearnWithMillie’s control',
      'Any examples of success (including testimonials or case studies) are illustrative only and do not guarantee similar outcomes',
      'You are solely responsible for the decisions you make and actions you take based on mentorship advice',
      'All mentorship services are provided on a best-efforts basis only.',
      'To the fullest extent permitted by law, LearnWithMillie shall not be liable for any loss of income, business opportunities, or other financial outcomes arising from participation in mentorship services.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    content: null,
  },
]

export default function TermsPage() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <main className='max-w-3xl mx-auto px-6 py-16'>
        {/* Header */}
        <div className='mb-12'>
          <p
            className='text-xs uppercase tracking-[0.25em] font-semibold mb-3'
            style={{
              color: '#C2AA6A',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Legal
          </p>
          <h1
            className='text-4xl font-bold mb-4'
            style={{
              color: '#1F3A34',
              fontFamily: 'var(--font-playfair), Georgia, serif',
            }}
          >
            Terms & Conditions
          </h1>
          <p
            className='text-sm'
            style={{
              color: 'rgba(31,58,52,0.5)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Effective date: 11 April 2026
          </p>
          <div className='mt-6 h-px' style={{ backgroundColor: '#EDE4D8' }} />
        </div>

        {/* Table of contents */}
        <nav
          className='mb-12 p-6 rounded-2xl bg-white'
          style={{ border: '1px solid #EDE4D8' }}
        >
          <p
            className='text-[11px] uppercase tracking-[0.18em] font-semibold mb-4'
            style={{
              color: 'rgba(31,58,52,0.45)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            Contents
          </p>
          <ol className='space-y-2'>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className='text-sm transition-opacity hover:opacity-70 flex items-center gap-2'
                  style={{
                    color: '#1F3A34',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  <span
                    style={{
                      color: '#C2AA6A',
                      fontWeight: 600,
                      minWidth: '1.2rem',
                    }}
                  >
                    {i + 1}.
                  </span>
                  {s.title}
                  {s.highlight && (
                    <span
                      className='text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full font-semibold'
                      style={{
                        backgroundColor: 'rgba(194,170,106,0.15)',
                        color: '#C2AA6A',
                      }}
                    >
                      Important
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className='space-y-10'>
          {sections.map((section, i) => (
            <div key={section.id} id={section.id}>
              <div className='flex items-center gap-3 mb-4'>
                <span
                  className='text-sm font-semibold'
                  style={{
                    color: '#C2AA6A',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2
                  className='text-xl font-bold'
                  style={{
                    color: '#1F3A34',
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                  }}
                >
                  {section.title}
                </h2>
              </div>

              {section.highlight && (
                <div
                  className='flex items-start gap-3 mb-4 p-4 rounded-xl'
                  style={{
                    backgroundColor: 'rgba(194,170,106,0.1)',
                    border: '1px solid rgba(194,170,106,0.3)',
                  }}
                >
                  <div
                    className='w-0.5 self-stretch rounded-full flex-shrink-0'
                    style={{ backgroundColor: '#C2AA6A' }}
                  />
                  <p
                    className='text-xs font-semibold leading-relaxed'
                    style={{
                      color: '#8a6f2e',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {'highlightText' in section ? section.highlightText : 'Please read this section carefully.'}
                  </p>
                </div>
              )}

              {section.id === 'contact' ? (
                <p
                  className='text-sm leading-relaxed'
                  style={{
                    color: 'rgba(31,58,52,0.75)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  If you have any questions about these Terms and Conditions,
                  please contact Millie directly via the{' '}
                  <a
                    href='/contact'
                    style={{
                      color: '#1F3A34',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    contact form
                  </a>
                  .
                </p>
              ) : (
                'content' in section &&
                section.content && (
                  <p
                    className='text-sm leading-relaxed'
                    style={{
                      color: 'rgba(31,58,52,0.75)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {section.content}
                  </p>
                )
              )}

              {'items' in section && section.items && (
                <ul className='space-y-3'>
                  {section.items.map((item) => (
                    <li key={item} className='flex items-start gap-3'>
                      <div
                        className='w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5'
                        style={{ backgroundColor: '#C2AA6A' }}
                      />
                      <p
                        className='text-sm leading-relaxed'
                        style={{
                          color: 'rgba(31,58,52,0.75)',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div
                className='mt-8 h-px'
                style={{ backgroundColor: '#EDE4D8' }}
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p
          className='mt-10 text-xs text-center'
          style={{
            color: 'rgba(31,58,52,0.4)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          © {new Date().getFullYear()} LearnWithMillie · Millie Cooper · All
          rights reserved
        </p>
      </main>
    </div>
  )
}
