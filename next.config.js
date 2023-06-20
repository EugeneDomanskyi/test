/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tegro-imagekit.s3.eu-central-1.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
