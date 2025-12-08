import type { NextConfig } from 'next'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  outputFileTracingIncludes: {
    '/**/*': ['./src/app/blog/**/*.mdx', './src/app/projects/**/*.mdx'],
  },
  experimental: {
    mdxRs: true,
  },
} satisfies NextConfig

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)
