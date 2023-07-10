/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },

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
