'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function Parallax({ children, ...props }) {
	const { scrollYProgress } = useScroll()
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"])

	return (
		<motion.div style={{ y }} {...props}>
			{children}
		</motion.div>
	)
}
