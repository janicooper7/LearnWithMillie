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
