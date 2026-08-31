// Shared visual shell for every journey email. The password-reset email
// (src/lib/passwordReset.ts) established the look — cream page, dark green
// header with a gold eyebrow, white body card — and these keep to it so a
// welcome email and a transactional one clearly come from the same place.
//
// Everything is table-based with inline styles because Outlook still ignores
// <div> layout and anything in a <style> block.

export const GREEN = '#1F3A34'
export const GOLD = '#C2AA6A'
export const CREAM = '#F4EDE4'
export const BORDER = '#EDE4D8'
const MUTED = 'rgba(31,58,52,0.8)'

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://learnwithmillie.com'
}

/**
 * The recipient's first name, escaped and ready to drop into copy — or null
 * when we don't have one, so each email decides its own fallback wording.
 * Returned as-is rather than title-cased: names don't reliably capitalise.
 */
export function firstName(name?: string | null): string | null {
  const first = name?.trim().split(/\s+/)[0]
  return first ? esc(first) : null
}

/** Standard opener, falling back to a greeting that works with no name. */
export function greeting(name?: string | null): string {
  const first = firstName(name)
  return first ? `Hi ${first},` : 'Hi there,'
}

export function p(html: string): string {
  return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${MUTED};">${html}</p>`
}

export function link(href: string, text: string): string {
  return `<a href="${esc(href)}" style="color:${GREEN};font-weight:600;">${esc(text)}</a>`
}

/** Low-key text link with an arrow. Used instead of a button where a big gold
 *  call to action would feel like a pitch. */
export function softLink(href: string, text: string): string {
  return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;">
    <a href="${esc(href)}" style="color:${GREEN};font-weight:700;text-decoration:underline;">${esc(text)} &rarr;</a>
  </p>`
}

export function button(href: string, text: string): string {
  return `<div style="text-align:center;margin:6px 0 22px 0;">
    <a href="${esc(href)}" style="display:inline-block;background:${GOLD};color:${GREEN};text-decoration:none;font-size:15px;font-weight:700;padding:13px 28px;border-radius:10px;">${esc(text)} &rarr;</a>
  </div>`
}

/**
 * The discount code, set out as something to be copied.
 *
 * Rendered as selectable text rather than an image or a pre-filled link: the
 * code has to survive being read on a phone and typed into Stripe's promo box
 * on a laptop, and a picture of a code can't be copied at all. Monospaced and
 * letter-spaced so an O and a 0 can be told apart.
 *
 * `code` is escaped because it is a value; `caption` is not, because it is
 * authored copy and shares the convention of p() and note() — entities and
 * inline markup in it are meant to render, not to be shown as text.
 */
export function discountCode(opts: { code: string; caption: string }): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 20px 0;">
    <tr>
      <td align="center" style="background:${CREAM};border:2px dashed ${GOLD};border-radius:14px;padding:22px 18px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;font-weight:700;color:#8a6f2e;margin-bottom:10px;">Your code</div>
        <div style="font-family:'Courier New',Courier,monospace;font-size:28px;font-weight:700;letter-spacing:0.14em;color:${GREEN};">${esc(opts.code)}</div>
        <div style="font-size:13px;color:rgba(31,58,52,0.7);margin-top:10px;line-height:1.55;">${opts.caption}</div>
      </td>
    </tr>
  </table>`
}

/** Soft cream panel — for an aside that shouldn't read as a sales box. */
export function note(html: string): string {
  return `<div style="font-size:14px;color:rgba(31,58,52,0.7);background:${CREAM};border:1px solid ${BORDER};border-radius:10px;padding:14px 16px;line-height:1.65;margin:0 0 18px 0;">${html}</div>`
}

/**
 * Sign-off block.
 *
 * The signature is a hosted image rather than an attachment, so the mail stays
 * light and the graphic can be swapped without a code change — but it lives at
 * an absolute URL on the live site, so it only resolves once the site is
 * deployed. Plenty of clients (Outlook especially) also block remote images
 * until the reader allows them, which is why `alt` carries the full name and
 * the qualifications stay as real text underneath: with images off, the block
 * still reads as a signature.
 *
 * Displayed at 300px against a 400px source so it stays sharp on retina.
 */
export function signOff(): string {
  return `<p style="margin:22px 0 0 0;font-size:15px;line-height:1.65;color:${MUTED};">
      Speak soon,
    </p>
    <img src="${siteUrl()}/images/email-signature.png"
      alt="Millie Cooper, Founder of LearnWithMillie"
      width="300"
      style="display:block;width:300px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:8px 0 2px 0;" />
    <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(31,58,52,0.55);">
      Certified TEFL teacher &middot; London<br />
      Master&rsquo;s in Public Policy, UCL<br />
      Bachelor&rsquo;s in International Politics, King&rsquo;s College London
    </p>`
}

/**
 * Wraps built-up body HTML in the branded frame.
 *
 * `preheader` is the grey line inboxes show next to the subject. It is hidden
 * in the body itself and padded, otherwise clients pull in whatever text comes
 * first — usually the greeting, which tells the reader nothing.
 */
export function renderEmail(opts: {
  eyebrow: string
  headline: string
  preheader: string
  body: string
  unsubscribeUrl?: string
  /**
   * Why this person is being emailed, for the footer. Defaults to the account
   * wording, which is true of everyone in the journeys — but not of the
   * marketing list, whose members never created an account and would rightly
   * read that as a lie about where their address came from.
   */
  footerReason?: string
}): string {
  const { eyebrow, headline, preheader, body, unsubscribeUrl } = opts
  const footerReason = opts.footerReason ?? 'you created an account at'

  const unsubscribe = unsubscribeUrl
    ? `<br /><a href="${esc(unsubscribeUrl)}" style="color:rgba(31,58,52,0.5);text-decoration:underline;">Unsubscribe from these emails</a>`
    : ''

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${CREAM};">
    <div style="display:none;font-size:1px;color:${CREAM};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="background:${GREEN};border-radius:18px 18px 0 0;padding:32px 28px;text-align:center;">
                <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};font-weight:600;margin-bottom:10px;">${esc(eyebrow)}</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.25;">
                  ${esc(headline)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:0 0 18px 18px;padding:28px 28px 30px 28px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px 4px 24px;text-align:center;font-size:12px;line-height:1.7;color:rgba(31,58,52,0.5);">
                You're receiving this because ${esc(footerReason)}
                <a href="${esc(siteUrl())}" style="color:rgba(31,58,52,0.6);">learnwithmillie.com</a>.${unsubscribe}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/**
 * A bordered product card: name, price, one line of blurb, and its own link.
 * Used where an email offers several things at once and each needs its own
 * way in — a single shared CTA would make the reader pick before they've read.
 */
export function productCard(opts: {
  title: string
  price: string
  blurb: string
  href: string
  cta: string
}): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;">
    <tr>
      <td style="background:#FBF7F1;border:1px solid ${BORDER};border-radius:14px;padding:18px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:700;color:${GREEN};">${esc(opts.title)}</td>
            <td align="right" style="font-size:15px;font-weight:700;color:${GREEN};white-space:nowrap;padding-left:12px;">${esc(opts.price)}</td>
          </tr>
        </table>
        <div style="font-size:14px;color:rgba(31,58,52,0.7);margin-top:8px;line-height:1.6;">${esc(opts.blurb)}</div>
        <a href="${esc(opts.href)}" style="display:inline-block;margin-top:12px;color:${GREEN};font-size:14px;font-weight:700;text-decoration:underline;">${esc(opts.cta)} &rarr;</a>
      </td>
    </tr>
  </table>`
}

/**
 * Comparison table for the lesson plans.
 *
 * `price` must be what the customer is actually charged each month. The plans
 * are priced per lesson on the site, and a per-lesson figure sitting next to
 * "4 lessons a month" reads as the price of all four — so the headline number
 * here is the monthly total, and the per-lesson rate goes in `detail`.
 */
export function planTable(
  plans: { name: string; price: string; per?: string; detail: string; featured?: boolean }[]
): string {
  const rows = plans
    .map(
      // The first row sits flush against the card's own border, so only the
      // rows after it get a divider.
      (plan, i) => `
      <tr>
        <td style="padding:12px 14px;${i > 0 ? `border-top:1px solid ${BORDER};` : ''}${plan.featured ? `background:rgba(194,170,106,0.09);` : ''}">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:${GREEN};">${esc(plan.name)}</span>
          ${plan.featured ? `<span style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;color:#8a6f2e;background:rgba(194,170,106,0.22);border-radius:20px;padding:3px 8px;margin-left:8px;">Most popular</span>` : ''}
          <div style="font-size:13px;color:rgba(31,58,52,0.65);margin-top:4px;line-height:1.5;">${esc(plan.detail)}</div>
        </td>
        <td align="right" style="padding:12px 14px;${i > 0 ? `border-top:1px solid ${BORDER};` : ''}white-space:nowrap;${plan.featured ? `background:rgba(194,170,106,0.09);` : ''}">
          <span style="font-size:17px;font-weight:700;color:${GREEN};">${esc(plan.price)}</span>
          ${plan.per ? `<div style="font-size:12px;color:rgba(31,58,52,0.6);margin-top:2px;">${esc(plan.per)}</div>` : ''}
        </td>
      </tr>`
    )
    .join('')

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:14px;margin:0 0 18px 0;background:#ffffff;">
    ${rows}
  </table>`
}

/**
 * Full-width photo inside the body card.
 *
 * `width` is the display width in CSS pixels and must be no more than the
 * 544px the card allows. The source files are cut roughly twice that so they
 * stay sharp on retina screens. The `width` attribute is repeated outside the
 * style because Outlook ignores CSS sizing on images, and `display:block`
 * removes the stray baseline gap underneath.
 */
export function emailImage(opts: { src: string; alt: string; width?: number }): string {
  const width = opts.width ?? 544
  return `<img src="${esc(opts.src)}" alt="${esc(opts.alt)}" width="${width}"
    style="display:block;width:100%;max-width:${width}px;height:auto;border:0;outline:none;text-decoration:none;border-radius:14px;margin:0 auto 20px auto;" />`
}

/**
 * Social accounts, one row per platform.
 *
 * Split rather than combined on a single line: a reader is usually on one
 * platform or the other, and one row per account gives each its own tappable
 * link instead of making them share a sentence. Icons are emoji rather than
 * image files so nothing here depends on remote images loading.
 */
export function socialLinks(
  accounts: { icon: string; platform: string; handle: string; url: string; blurb: string }[]
): string {
  const rows = accounts
    .map(
      (account, i) => `
      <tr>
        <td style="padding:14px 16px;${i > 0 ? `border-top:1px solid ${BORDER};` : ''}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="30" valign="top" style="font-size:18px;line-height:1.3;padding-right:10px;">${account.icon}</td>
              <td valign="top">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;color:${GOLD};">${esc(account.platform)}</div>
                <a href="${esc(account.url)}" style="display:inline-block;margin-top:3px;font-size:16px;font-weight:700;color:${GREEN};text-decoration:underline;">${esc(account.handle)}</a>
                <div style="font-size:13px;color:rgba(31,58,52,0.65);margin-top:4px;line-height:1.55;">${esc(account.blurb)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('')

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border:1px solid ${BORDER};border-radius:12px;margin:0 0 18px 0;">
    ${rows}
  </table>`
}
