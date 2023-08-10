'use client'

import { createContext, useContext } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const FadeInStaggerContext = createContext(false)

const viewport = { once: true, margin: '0px 0px -200px' }

export function FadeIn({ y = true, scale = false, ...props }) {
	let shouldReduceMotion = useReducedMotion()
	let isInStaggerGroup = useContext(FadeInStaggerContext)

	return (
		<motion.div
			variants={{
				hidden: {
					opacity: 0,
					y: shouldReduceMotion ? 0 : y ? 24 : 0,
					scale: shouldReduceMotion ? 0 : scale ? 0.925 : 1,
				},
				visible: { opacity: 1, y: 0, scale: 1 },
			}}
			transition={{ duration: 0.5 }}
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

export function FadeInStagger({ faster = false, ...props }) {
	return (
		<FadeInStaggerContext.Provider value={true}>
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
				{...props}
			/>
		</FadeInStaggerContext.Provider>
	)
}
