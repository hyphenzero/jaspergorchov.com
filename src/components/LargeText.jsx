'use client'

import { useRef } from 'react'

import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'

import { FadeIn } from './FadeIn'

export function LargeText({ text, className, overlay = false, ...props }) {
	return (
		<div
			className={clsx(
				'flex h-screen items-center justify-center bg-neutral-950',
				className,
			)}
			{...props}
		>
			<div className="relative w-fit max-w-5xl py-16 max-sm:px-10 sm:py-52">
				<FadeIn className="text-center font-display text-4xl font-light tracking-tight text-white [text-wrap:balance] sm:text-6xl">
					{text}
				</FadeIn>
			</div>
		</div>
	)
}
