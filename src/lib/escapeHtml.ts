/** Escapes text for interpolation into an HTML email body. Anything a visitor
 *  typed must go through this, or a form becomes a way to put arbitrary links
 *  and markup in Millie's inbox. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
