import type { NextConfig } from 'next'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  outputFileTracingIncludes: {
    '/**/*': ['./src/app/blog/**/*.mdx', './src/app/projects/**/*.mdx'],
  },
  experimental: {
    mdxRs: true,
  },
  async redirects() {
    return [
      {
        source: '/uses',
        destination: '/about',
        permanent: true,
      },
    ]
  },
} satisfies NextConfig

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)
