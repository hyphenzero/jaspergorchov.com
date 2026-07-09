'use client'

import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = {
  src: string
  isActive: boolean
  className?: string
}

export function ProjectVideoOverlay({ src, isActive, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return
    if (isActive) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [isActive])

  return (
    <motion.div
      className={className}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
    >
      <video ref={videoRef} src={src} className="size-full object-cover" playsInline muted loop />
    </motion.div>
  )
}
