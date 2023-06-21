/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tegro-imagekit.s3.eu-central-1.amazonaws.com',
      }, {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      }
    ],
  },
}

module.exports = nextConfig
