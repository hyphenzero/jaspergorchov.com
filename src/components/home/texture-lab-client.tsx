'use client'

import dynamic from 'next/dynamic'

export const TextureLab = dynamic(() => import('@/components/home/texture-lab').then((m) => m.TextureLab), {
  ssr: false,
})
