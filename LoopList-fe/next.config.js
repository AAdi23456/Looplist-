/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'], // Allow Dicebear avatar images
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 