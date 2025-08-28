// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❗️Allows production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // optional: if you also have type errors blocking build
  // typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
