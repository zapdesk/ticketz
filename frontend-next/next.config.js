/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  output: 'standalone',
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      }
    ];
  },
  images: {
    domains: ['localhost']
  }
};

module.exports = nextConfig;  