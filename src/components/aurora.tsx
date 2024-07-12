'use client'

import { cn } from '@/utils/cn'
import React from 'react'

interface AuroraProps extends React.HTMLProps<HTMLDivElement> {
  radialGradient?: boolean
}

export const Aurora = ({ className, radialGradient = true, ...props }: AuroraProps) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} {...props}>
      <div
        className={cn(
          `pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,theme(colors.blue.500)_10%,theme(colors.pink.300)_15%,theme(colors.blue.300)_20%,theme(colors.violet.200)_25%,theme(colors.blue.400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,theme(colors.zinc.900)_0%,theme(colors.zinc.900)_7%,transparent_10%,transparent_12%,theme(colors.zinc.900)_16%)] [--white-gradient:repeating-linear-gradient(100deg,white_0%,white_7%,transparent_10%,transparent_12%,white_16%)] [background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:animate-[aurora_60s_linear_infinite] after:mix-blend-multiply after:content-[""] after:[background-attachment:fixed] after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0 dark:[--aurora:repeating-linear-gradient(100deg,theme(colors.sky.300)_10%,theme(colors.pink.400)_15%,theme(colors.blue.500)_20%,theme(colors.sky.300)_25%,theme(colors.indigo.400)_20%)] dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

          radialGradient && `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
        )}
      ></div>
    </div>
  )
}
