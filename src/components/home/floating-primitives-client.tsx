'use client'

import dynamic from 'next/dynamic'

export const FloatingPrimitives = dynamic(
  () => import('@/components/home/floating-primitives').then((module) => module.FloatingPrimitives),
  { ssr: false }
)
