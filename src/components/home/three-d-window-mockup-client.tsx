'use client'

import dynamic from 'next/dynamic'

export const ThreeDWindowMockup = dynamic(
  () => import('@/components/home/three-d-window-mockup').then((module) => module.ThreeDWindowMockup),
  { ssr: false }
)
