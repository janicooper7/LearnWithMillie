/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  // Baseline security headers (UK GDPR Article 32). A full Content-Security-
  // Policy is left out for now: GA, both pixels, Stripe, Cal and Vimeo each
  // need allow-listing, and a wrong CSP breaks checkout silently.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/mentorship', destination: '/teachers/mentorship', permanent: true },
      { source: '/courses', destination: '/teachers/courses', permanent: true },
      { source: '/courses/:slug', destination: '/teachers/courses/:slug', permanent: true },
      { source: '/platform-finder', destination: '/teachers/platform-finder', permanent: true },
      { source: '/debategenerator', destination: '/teachers/debategenerator', permanent: true },
    ]
  },
}

module.exports = nextConfig
