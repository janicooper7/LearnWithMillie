import type { Metadata } from 'next'
import CookieSettingsLink from '../components/CookieSettingsLink'
import { RETENTION } from '@/lib/retentionPolicy'

export const metadata: Metadata = {
  title: 'Privacy & Cookie Policy | LearnWithMillie',
  description:
    'How LearnWithMillie collects, uses and protects your personal data, which cookies the site uses, and your rights under UK data protection law.',
  alternates: {
    canonical: '/privacy',
  },
}

// Facts about the business shown on this page. Update the effective date
// whenever the policy's substance changes.
const DETAILS = {
  controller: 'Millie Cooper, a sole trader trading as LearnWithMillie',
  effectiveDate: '23 September 2026',
}

const text = 'text-sm leading-relaxed'
const textStyle = { color: 'rgba(31,58,52,0.75)', fontFamily: 'var(--font-inter), sans-serif' }

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${text} mb-3`} style={textStyle}>
      {children}
    </p>
  )
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className='space-y-2.5 mb-3'>
      {items.map((item, i) => (
        <li key={i} className='flex items-start gap-3'>
          <div className='w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5' style={{ backgroundColor: '#C2AA6A' }} />
          <p className={text} style={textStyle}>
            {item}
          </p>
        </li>
      ))}
    </ul>
  )
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className='overflow-x-auto mb-4 rounded-xl border' style={{ borderColor: '#EDE4D8' }}>
      <table className='w-full text-left text-xs' style={textStyle}>
        <thead style={{ backgroundColor: 'rgba(194,170,106,0.12)' }}>
          <tr>
            {head.map((h) => (
              <th key={h} className='px-3 py-2.5 font-semibold' style={{ color: '#1F3A34' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white'>
          {rows.map((row, i) => (
            <tr key={i} className='border-t align-top' style={{ borderColor: '#EDE4D8' }}>
              {row.map((cell, j) => (
                <td key={j} className='px-3 py-2.5 leading-relaxed'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const b = (s: string) => <strong style={{ color: '#1F3A34' }}>{s}</strong>

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'who',
    title: 'Who I am',
    body: (
      <>
        <P>
          LearnWithMillie is run by {DETAILS.controller}. I am the
          &ldquo;controller&rdquo; of your personal data, which means I decide how
          it is used and I am responsible for protecting it.
        </P>
        <P>
          For anything about your personal data, contact me through the{' '}
          <a href='/contact' className='font-semibold underline underline-offset-2' style={{ color: '#1F3A34' }}>
            contact form
          </a>{' '}
          and mention &ldquo;privacy&rdquo; in your message.
        </P>
      </>
    ),
  },
  {
    id: 'what',
    title: 'What I collect and why',
    body: (
      <>
        <P>
          UK data protection law says I need a lawful reason (a &ldquo;lawful
          basis&rdquo;) for each use of your data. Here is everything the site
          collects, what it is for, and the reason.
        </P>
        <Table
          head={['What', 'Why', 'Lawful basis']}
          rows={[
            [
              'Account: name, email, password (stored only as a secure hash), student or teacher, and your Google name and photo if you sign in with Google',
              'To create and run your account',
              'Contract',
            ],
            [
              'Purchases: plan, lesson credits, courses bought, Stripe customer and subscription IDs',
              'To take payment and give you what you paid for',
              'Contract; legal obligation (tax records)',
            ],
            [
              'Bookings: lesson times, time zone, and booking IDs from Cal.com',
              'To schedule, remind you about and run your lessons',
              'Contract',
            ],
            [
              'Messages you send me through your dashboard',
              'To answer you and support your lessons',
              'Contract',
            ],
            [
              'Course progress: which lessons you have completed',
              'To show your progress and resume where you left off',
              'Contract',
            ],
            [
              'Platform Finder: your quiz answers and the email used at checkout',
              'To produce and email your report',
              'Contract',
            ],
            [
              'Contact form: your name, email and message',
              'To reply to your enquiry',
              'Legitimate interests (answering people who contact me)',
            ],
            [
              'Mailing list (sign-up box): email, first name if given, whether you are a teacher or learner, and the page you signed up on',
              'To send the discount code, tips and offers, including a short series related to the page you signed up on',
              'Consent (you can withdraw it at any time)',
            ],
            [
              'Customer emails: welcome emails, tips and offers about similar services, after you create an account',
              'To help you get started and tell you about lessons, courses and tools',
              'Legitimate interests. You can opt out when you sign up and in every email',
            ],
            [
              'Visit statistics: a random visitor ID, pages visited, and how you arrived (for example a search engine or an ad campaign)',
              'To understand which pages help people, and which marketing works',
              'Legitimate interests (see Cookies below). You can refuse it',
            ],
            [
              'Google Analytics, Meta and TikTok cookies',
              'Detailed site analytics and measuring ads',
              'Consent, only if you accept them',
            ],
          ]}
        />
        <P>
          I don&rsquo;t sell your data, and I don&rsquo;t make any decisions
          about you by automated means that have legal or similarly significant
          effects. The Platform Finder suggests platforms based on your answers.
          It is only a recommendation.
        </P>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who I share it with',
    body: (
      <>
        <P>
          I use the following service providers (&ldquo;processors&rdquo;) to run
          the site. They may only use your data to provide their service to me.
        </P>
        <Table
          head={['Provider', 'What for', 'Location']}
          rows={[
            ['Stripe', 'Payments and subscriptions. Your card details go straight to Stripe and I never see them', 'USA / EU'],
            ['Cal.com', 'Lesson booking and calendar invitations', 'USA / EU'],
            ['Google', 'Google Meet (lessons), Google sign-in, sending emails, Google Analytics (only with consent)', 'USA'],
            ['Neon', 'Database hosting', 'USA / EU'],
            ['Netlify', 'Website hosting', 'USA'],
            ['Vimeo', 'Course videos, with tracking turned off', 'USA'],
            ['YouTube', 'Preview videos, loaded in privacy-enhanced mode only when you press play', 'USA'],
            ['Meta (Facebook/Instagram)', 'Measuring ads, only with consent', 'USA / Ireland'],
            ['TikTok', 'Measuring ads, only with consent', 'UK / Ireland / USA and elsewhere'],
          ]}
        />
        <P>
          I may also share data if the law requires it, or with professional
          advisers such as an accountant.
        </P>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International transfers',
    body: (
      <P>
        Some of these providers process data outside the UK, mainly in the
        United States. When they do, the transfer is protected either by the
        UK&ndash;US &ldquo;data bridge&rdquo; (for companies certified under
        it) or by the UK International Data Transfer Agreement / UK Addendum to
        the EU Standard Contractual Clauses built into the provider&rsquo;s
        data processing terms.
      </P>
    ),
  },
  {
    id: 'retention',
    title: 'How long I keep it',
    body: (
      <List
        items={[
          <>{b('Account data')} is kept while you have an account. Ask me to delete it at any time.</>,
          <>{b('Payment records')} are kept for six years after the end of the tax year they relate to, because HMRC requires it. They stay with Stripe even if your account is deleted.</>,
          <>{b('Visit statistics')} are deleted automatically after {Math.round(RETENTION.trackedEventDays / 30)} months.</>,
          <>{b('Unpaid Platform Finder quizzes')} are deleted after {RETENTION.unpaidPlatformFinderDays} days.</>,
          <>{b('Mailing list')}: if you unsubscribe, your name and sign-up page are removed within {RETENTION.unsubscribedMinimiseDays} days. I keep only your email address, marked as unsubscribed, so that I never email you again.</>,
          <>{b('Contact form messages')} are kept in my inbox for as long as needed to deal with your enquiry.</>,
        ]}
      />
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <P>Under UK data protection law you have the right to:</P>
        <List
          items={[
            'get a copy of the personal data I hold about you',
            'have anything inaccurate corrected',
            'have your data deleted',
            'restrict or object to how I use it. Your right to object to marketing is absolute: I will stop',
            'receive data you gave me in a portable format',
            'withdraw consent at any time. This doesn’t affect anything done before you withdrew',
          ]}
        />
        <P>
          To use any of these rights, get in touch through the{' '}
          <a href='/contact' className='underline underline-offset-2' style={{ color: '#1F3A34' }}>
            contact form
          </a>
          . I may ask you to confirm your identity first. I will reply within
          one month. To stop marketing emails, use the unsubscribe link in any
          email. To change your cookie choices, use &ldquo;Cookie settings&rdquo;
          in the footer.
        </P>
        <P>
          If you are unhappy with how I have handled your data, you can complain
          to the Information Commissioner&rsquo;s Office at{' '}
          <a href='https://ico.org.uk/make-a-complaint/' target='_blank' rel='noopener noreferrer' className='underline underline-offset-2' style={{ color: '#1F3A34' }}>
            ico.org.uk
          </a>{' '}
          or on 0303 123 1113. I would appreciate the chance to put it right
          first.
        </P>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <P>
        My lessons, courses and tools are designed for adults. If you are under
        18, please ask a parent or guardian to contact me before you sign up or
        buy anything. I don&rsquo;t knowingly collect personal data from children
        under 13. If you believe a child has given me their details, contact me
        and I will delete them.
      </P>
    ),
  },
  {
    id: 'security',
    title: 'Keeping your data safe',
    body: (
      <P>
        The site is served only over HTTPS. Passwords are stored as one-way
        hashes, payments are handled entirely by Stripe, and only I can reach the
        admin area. No system is perfectly secure. If a breach puts your rights
        at risk, I will tell you and the ICO as the law requires.
      </P>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    body: (
      <>
        <P>
          Cookies and browser storage (such as localStorage) are small pieces of
          data saved on your device. Essential ones are always on. Advertising
          cookies and Google Analytics only load if you accept them in the cookie
          banner. My own visit counter runs unless you refuse analytics. You can
          change your choice at any time:{' '}
          <CookieSettingsLink className='font-semibold underline underline-offset-2' style={{ color: '#1F3A34' }} />
          .
        </P>
        <Table
          head={['Name', 'Type', 'Purpose', 'Lasts']}
          rows={[
            ['authjs.* (session, csrf, callback-url)', 'Essential', 'Keeps you signed in and protects sign-in forms', 'Session / 30 days'],
            ['_pending_role, _marketing_opt_out', 'Essential', 'Carries your sign-up choices through Google sign-in', '5 minutes'],
            ['lwm:consent', 'Essential', 'Remembers your cookie choice', 'Until changed'],
            ['lwm:signup-popup', 'Essential', 'Stops the sign-up box appearing again once dismissed', '30 days, or permanent if you joined'],
            ['Stripe, Cal.com', 'Essential', 'Set by the checkout and booking tools when you use them', 'Set by provider'],
            ['lwm:vid, lwm:sid, lwm:sid_ts, lwm:attr', 'Analytics (first-party)', 'Counts visits and which pages and campaigns lead to purchases. Never shared with anyone', 'Visitor ID: until cleared. Session: 30 minutes idle'],
            ['_ga, _ga_*', 'Analytics (consent)', 'Google Analytics', 'Up to 2 years'],
            ['_fbp, lwm:fbq:*', 'Advertising (consent)', 'Meta pixel: measures ad performance and purchases', 'Up to 90 days'],
            ['_ttp, _tt_*', 'Advertising (consent)', 'TikTok pixel: measures ad performance', 'Up to 13 months'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <P>
        If I change how I use your data, I will update this page and the date at
        the top. For significant changes I will also email account holders.
      </P>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F4EDE4' }}>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-16'>
        <div className='mb-12'>
          <p className='text-xs uppercase tracking-[0.25em] font-semibold mb-3' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
            Legal
          </p>
          <h1 className='text-4xl font-bold mb-4' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Privacy &amp; Cookie Policy
          </h1>
          <p className='text-sm' style={{ color: 'rgba(31,58,52,0.5)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Effective date: {DETAILS.effectiveDate}
          </p>
          <div className='mt-6 h-px' style={{ backgroundColor: '#EDE4D8' }} />
        </div>

        <nav className='mb-12 p-6 rounded-2xl bg-white' style={{ border: '1px solid #EDE4D8' }}>
          <p className='text-[11px] uppercase tracking-[0.18em] font-semibold mb-4' style={{ color: 'rgba(31,58,52,0.45)', fontFamily: 'var(--font-inter), sans-serif' }}>
            Contents
          </p>
          <ol className='space-y-2'>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className='text-sm transition-opacity hover:opacity-70 flex items-center gap-2' style={{ color: '#1F3A34', fontFamily: 'var(--font-inter), sans-serif' }}>
                  <span style={{ color: '#C2AA6A', fontWeight: 600, minWidth: '1.2rem' }}>{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className='space-y-10'>
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className='scroll-mt-24'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-sm font-semibold' style={{ color: '#C2AA6A', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className='text-xl font-bold' style={{ color: '#1F3A34', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {section.title}
                </h2>
              </div>
              {section.body}
              <div className='mt-8 h-px' style={{ backgroundColor: '#EDE4D8' }} />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
