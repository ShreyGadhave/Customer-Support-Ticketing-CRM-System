/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tickets',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
