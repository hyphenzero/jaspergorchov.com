'use client'

import { useRef } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion'

export function SpinOnScroll({ children, ...props }) {
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <div ref={targetRef} {...props}>
      <motion.div style={{ rotate }}>{children}</motion.div>
    </div>
  )
}
