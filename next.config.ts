import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  outputFileTracingIncludes: {
    '/**/*': ['./src/app/blog/**/*.mdx', './src/app/projects/**/*.mdx'],
  },
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [{ hostname: 'cdn.polyhaven.com' }, { hostname: 'dl.polyhaven.org' }],
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

const withMDX = createMDX()

export default withMDX(nextConfig)
