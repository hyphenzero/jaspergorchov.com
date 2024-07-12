'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { createContext, useContext } from 'react'

const FadeInStaggerContext = createContext(false)

const viewport = { once: true, margin: '0px 0px -50px' }

interface FadeInProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  wait?: number
}

export function FadeIn({ wait = 1, ...props }: FadeInProps) {
  let shouldReduceMotion = useReducedMotion()
  let isInStaggerGroup = useContext(FadeInStaggerContext)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ delay: wait ? 0.2 * wait : 0, duration: 1, type: 'spring' }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'hidden',
            whileInView: 'visible',
            viewport,
          })}
      {...props}
    />
  )
}

export function FadeInStagger({
	wait = 0,
  faster = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & { wait?: number, faster?: boolean }) {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ delay: 0.2 * wait, staggerChildren: faster ? 0.12 : 0.2, type: 'spring' }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  )
}
