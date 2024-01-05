/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // profiler: true,
  swcMinify: true,

  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },

  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
