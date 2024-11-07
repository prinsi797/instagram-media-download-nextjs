const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...withPWA({}),
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  reactStrictMode: true,
  images: {
    domains: ['instagram.com', 'instagram.famd5-3.fna.fbcdn.net', 'scontent.cdninstagram.com'],
  },
  output: 'export', 
};

module.exports = nextConfig;