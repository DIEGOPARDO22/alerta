// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.apis.net.pe/v2/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;