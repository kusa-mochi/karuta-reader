/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: './',
  exportPathMap: async function(defaultPathMap, {dev, dir, outDir, distDir, buildId}) {
    return {
      '/': {page: '/'},
    }
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
