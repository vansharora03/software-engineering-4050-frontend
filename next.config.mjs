/** @type {import('next').NextConfig} */
const nextConfig = { async redirects() {
    return [
      {
        source: '/',
        destination: '/movies',
        permanent: true, // Set to true for a 308 permanent redirect, false for a 307 temporary redirect
      },
    ];
  },
};
export default nextConfig;
