'use client'

import { useVideoCache } from '@/components/video-cache-context'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  isActive: boolean
  className?: string
}

const FADE_DURATION = 500

export function ProjectVideoOverlay({ src, isActive, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const mountedRef = useRef(false)
  const { preload } = useVideoCache()

  useEffect(() => {
    preload(src)
  }, [src, preload])

  useEffect(() => {
    mountedRef.current = mounted
  }, [mounted])

  useEffect(() => {
    if (isActive) {
      if (!mountedRef.current) {
        setMounted(true)
        setReady(false)
      }
    } else if (mountedRef.current) {
      const timer = setTimeout(() => setMounted(false), FADE_DURATION)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  useEffect(() => {
    if (!mounted || !ready) return
    if (isActive) {
      videoRef.current?.play().catch(() => {})
    } else {
      videoRef.current?.pause()
    }
  }, [mounted, ready, isActive])

  return (
    <div
      className={className}
      style={{
        opacity: ready && isActive ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.42, 0, 0.58, 1)`,
        pointerEvents: 'none',
      }}
    >
      {mounted && (
        <video
          ref={videoRef}
          src={src}
          className="size-full object-cover"
          playsInline
          muted
          loop
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  )
}
