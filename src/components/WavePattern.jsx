'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'

export default function WavePattern({ fade, parallax }) {
	const fadeFromTopRight = fade === 'fromTopRight'
	const fadeFromTop = fade === 'fromTop'
	const fadeFromBottom = fade === 'fromBottom'
	const fadeFromLeft = fade === 'fromLeft'
	const fadeFromRight = fade === 'fromRight'

	let { scrollYProgress } = useScroll()
	let y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

	return (
		<motion.svg
			viewBox="0 0 1440 743"
			fill="none"
			style={parallax ? { y } : {}}
			className={clsx(
				'absolute max-w-none h-screen right-0 top-0 -z-10 bg-cover bg-center stroke-neutral-800',
				fadeFromTopRight && '[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]',
				fadeFromTop && '[mask-image:linear-gradient(white,transparent)]',
				fadeFromBottom && '[mask-image:linear-gradient(from_bottom,white,transparent)]',
				fadeFromLeft && '[mask-image:linear-gradient(from_left,white,transparent)]',
				fadeFromRight && '[mask-image:linear-gradient(from_right,white,transparent)]'
			)}
		>
			<path
				d="M0 22.2185C0 22.2185 209.817 -362.861 720 -108.891C1230.18 145.077 1440 -240 1440 -240"
				strokeWidth="1"
			/>
			<path
				d="M0 46.2185C0 46.2185 209.817 -338.861 720 -84.8908C1230.18 169.077 1440 -216 1440 -216"
				strokeWidth="1"
			/>
			<path
				d="M0 70.2185C0 70.2185 209.817 -314.861 720 -60.8908C1230.18 193.077 1440 -192 1440 -192"
				strokeWidth="1"
			/>
			<path
				d="M0 94.2185C0 94.2185 209.817 -290.861 720 -36.8908C1230.18 217.077 1440 -168 1440 -168"
				strokeWidth="1"
			/>
			<path
				d="M0 118.218C0 118.218 209.817 -266.861 720 -12.8908C1230.18 241.077 1440 -144 1440 -144"
				strokeWidth="1"
			/>
			<path
				d="M0 142.218C0 142.218 209.817 -242.861 720 11.1092C1230.18 265.077 1440 -120 1440 -120"
				strokeWidth="1"
			/>
			<path
				d="M0 166.218C0 166.218 209.817 -218.861 720 35.1092C1230.18 289.077 1440 -96 1440 -96"
				strokeWidth="1"
			/>
			<path
				d="M0 190.218C0 190.218 209.817 -194.861 720 59.1092C1230.18 313.077 1440 -72 1440 -72"
				strokeWidth="1"
			/>
			<path
				d="M0 214.218C0 214.218 209.817 -170.861 720 83.1092C1230.18 337.077 1440 -48 1440 -48"
				strokeWidth="1"
			/>
			<path
				d="M0 238.218C0 238.218 209.817 -146.861 720 107.109C1230.18 361.077 1440 -24 1440 -24"
				strokeWidth="1"
			/>
			<path
				d="M0 262.218C0 262.218 209.817 -122.861 720 131.109C1230.18 385.077 1440 0 1440 0"
				strokeWidth="1"
			/>
			<path
				d="M0 286.218C0 286.218 209.817 -98.8605 720 155.109C1230.18 409.077 1440 24 1440 24"
				strokeWidth="1"
			/>
			<path
				d="M0 310.218C0 310.218 209.817 -74.8605 720 179.109C1230.18 433.077 1440 48 1440 48"
				strokeWidth="1"
			/>
			<path
				d="M0 334.218C0 334.218 209.817 -50.8605 720 203.109C1230.18 457.077 1440 72 1440 72"
				strokeWidth="1"
			/>
			<path
				d="M0 358.218C0 358.218 209.817 -26.8605 720 227.109C1230.18 481.077 1440 96 1440 96"
				strokeWidth="1"
			/>
			<path
				d="M0 382.218C0 382.218 209.817 -2.86051 720 251.109C1230.18 505.077 1440 120 1440 120"
				strokeWidth="1"
			/>
			<path
				d="M0 406.218C0 406.218 209.817 21.1395 720 275.109C1230.18 529.077 1440 144 1440 144"
				strokeWidth="1"
			/>
			<path
				d="M0 430.218C0 430.218 209.817 45.1395 720 299.109C1230.18 553.077 1440 168 1440 168"
				strokeWidth="1"
			/>
			<path
				d="M0 454.218C0 454.218 209.817 69.1395 720 323.109C1230.18 577.077 1440 192 1440 192"
				strokeWidth="1"
			/>
			<path
				d="M0 478.218C0 478.218 209.817 93.1395 720 347.109C1230.18 601.077 1440 216 1440 216"
				strokeWidth="1"
			/>
			<path
				d="M0 502.218C0 502.218 209.817 117.139 720 371.109C1230.18 625.077 1440 240 1440 240"
				strokeWidth="1"
			/>
			<path
				d="M0 526.218C0 526.218 209.817 141.139 720 395.109C1230.18 649.077 1440 264 1440 264"
				strokeWidth="1"
			/>
			<path
				d="M0 550.218C0 550.218 209.817 165.139 720 419.109C1230.18 673.077 1440 288 1440 288"
				strokeWidth="1"
			/>
			<path
				d="M0 574.218C0 574.218 209.817 189.139 720 443.109C1230.18 697.077 1440 312 1440 312"
				strokeWidth="1"
			/>
			<path
				d="M0 598.218C0 598.218 209.817 213.139 720 467.109C1230.18 721.077 1440 336 1440 336"
				strokeWidth="1"
			/>
			<path
				d="M0 622.218C0 622.218 209.817 237.139 720 491.109C1230.18 745.077 1440 360 1440 360"
				strokeWidth="1"
			/>
			<path
				d="M0 646.218C0 646.218 209.817 261.139 720 515.109C1230.18 769.077 1440 384 1440 384"
				strokeWidth="1"
			/>
			<path
				d="M0 670.218C0 670.218 209.817 285.139 720 539.109C1230.18 793.077 1440 408 1440 408"
				strokeWidth="1"
			/>
			<path
				d="M0 694.218C0 694.218 209.817 309.139 720 563.109C1230.18 817.077 1440 432 1440 432"
				strokeWidth="1"
			/>
			<path
				d="M0 718.218C0 718.218 209.817 333.139 720 587.109C1230.18 841.077 1440 456 1440 456"
				strokeWidth="1"
			/>
			<path
				d="M0 742.218C0 742.218 209.817 357.139 720 611.109C1230.18 865.077 1440 480 1440 480"
				strokeWidth="1"
			/>
		</motion.svg>
	)
}