'use client'

import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { useState } from 'react'

export function Logo({ className, ...props }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <svg viewBox="0 0 673 457" className={clsx('text-zinc-950 dark:text-white', className)} {...props}>
        <path
          d="M478.791 0C511.852 0 542.042 6.53358 569.362 19.5996C596.682 32.4677 619.152 50.4829 636.771 73.6455C654.589 96.6101 665.676 123.336 670.031 153.823H590.149C584.606 128.879 572.036 108.785 552.437 93.541C533.035 78.0994 509.18 70.379 480.87 70.3789C454.342 70.3789 431.377 76.9115 411.976 89.9775C392.574 103.044 377.529 121.455 366.839 145.212C356.346 168.77 351.1 196.585 351.1 228.656C351.1 260.53 356.445 288.345 367.136 312.102C377.826 335.66 392.872 353.972 412.272 367.038C431.872 379.906 454.936 386.34 481.464 386.34C503.241 386.34 522.642 381.985 539.667 373.274C556.89 364.366 570.452 351.992 580.351 336.154C588.762 322.697 593.67 307.452 595.077 290.421H492.748V228.359H673.001V272.606C673.001 308.439 664.586 340.213 647.759 367.929C631.129 395.645 608.264 417.422 579.162 433.26C550.06 448.899 516.9 456.719 479.682 456.719C438.9 456.719 402.869 447.117 371.59 427.914C340.31 408.711 315.861 381.985 298.241 347.736C291.595 334.671 286.219 320.812 282.108 306.162V319.525C282.108 363.277 269.24 396.933 243.504 420.491C217.966 444.049 183.518 455.828 140.163 455.828C97.4015 455.828 63.351 443.95 38.0107 420.193C12.6705 396.437 2.69093e-05 362.485 0 318.338V290.424H75.4268V318.635C75.4268 341.401 81.1681 358.823 92.6504 370.899C104.331 382.778 119.871 388.717 139.272 388.717C158.871 388.717 174.412 382.777 185.895 370.899C197.575 358.823 203.415 341.401 203.415 318.635V7.12793H282.108V150.432C286.341 135.309 291.916 121.096 298.836 107.795C316.851 73.5462 341.399 47.0181 372.48 28.2109C403.76 9.4037 439.197 2.41616e-06 478.791 0Z"
          fill="currentColor"
        />
      </svg>

      {/* Top border */}
      <motion.div
        className="absolute -inset-x-2 top-0 h-px bg-zinc-950/15 dark:bg-white/15"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut',
          delay: isHovered ? 0 : 0.3,
        }}
        style={{ transformOrigin: 'left' }}
      />
      {/* Right border */}
      <motion.div
        className="absolute -inset-y-1 -right-1 w-px bg-zinc-950/15 dark:bg-white/15"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut',
          delay: isHovered ? 0.3 : 0,
        }}
        style={{ transformOrigin: 'top' }}
      />
      {/* Bottom border */}
      <motion.div
        className="absolute -inset-x-2 bottom-0 h-px bg-zinc-950/15 dark:bg-white/15"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut',
          delay: isHovered ? 0.2 : 0.1,
        }}
        style={{ transformOrigin: 'left' }}
      />
      {/* Left border */}
      <motion.div
        className="absolute -inset-y-1 -left-1 w-px bg-zinc-950/15 dark:bg-white/15"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut',
          delay: isHovered ? 0.1 : 0.2,
        }}
        style={{ transformOrigin: 'top' }}
      />
    </div>
  )
}
