'use client'

import Image from 'next/image'
import Link from 'next/link'

import Tilt from 'react-parallax-tilt'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

import { FadeIn, FadeInStagger } from './FadeIn'
import { Button } from './Button'

export function ProjectsGrid({
	title,
	moreButton = false,
	moreButtonHref,
	children,
}) {
	return (
		<div className="py-20 text-white">
			<h2 className="mb-20 mt-6 text-center font-display text-3xl font-medium sm:text-4xl">
				{title}
			</h2>
			<FadeInStagger faster>
				<ul
					role="list"
					className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8"
				>
					{children}
				</ul>
			</FadeInStagger>
			{moreButton && (
				<div className="mt-20 flex items-center justify-center">
					<Link href={moreButtonHref} className="rounded-full">
						<Button
							secondary
							trailingIcon={
								<ChevronRightIcon className="-mt-px translate-x-1 text-neutral-500 transition-all duration-300 group-hover:text-neutral-300" />
							}
							className="w-fit items-center"
						>
							See more
						</Button>
					</Link>
				</div>
			)}
		</div>
	)
}

export function Project({ client, image, href, description }) {
	return (
		<li className="group relative rounded-3xl border-t-[1.5px] border-transparent bg-neutral-950 transition-colors duration-200">
			<FadeIn className="relative h-full w-full">
				<Link
					href={href}
					className="absolute inset-0 h-full w-full rounded-3xl"
				/>
				<Tilt
					tiltMaxAngleX={5}
					tiltMaxAngleY={5}
					transitionSpeed={2000}
					glareEnable
					glarePosition="all"
					glareMaxOpacity={0.1}
					scale={1.05}
					className="z-10 overflow-clip rounded-xl"
				>
					<Link
						href={href}
						className="absolute inset-0 h-full w-full rounded-3xl"
					/>
					<div className="pointer-events-none relative flex aspect-[672/494] items-center justify-center overflow-clip rounded-xl bg-neutral-925 shadow-xl">
						<div className="absolute z-50 h-full w-full rounded-xl border-[1.5px] border-white/5" />
						<Image
							src={image}
							alt=""
							className="object-cover object-center transition-all duration-300"
						/>
					</div>
				</Tilt>
				<div className="mt-6 flex flex-wrap items-center">
					<h2 className="flex items-center font-display font-semibold text-white transition-colors duration-200 group-hover:text-sky-300">
						{client}
						<ArrowUpRightIcon className="ml-1 h-4 w-4 text-sky-300 opacity-0 transition-all duration-300 group-hover:opacity-100 motion-safe:group-hover:-translate-y-1" />
					</h2>
					<p className="w-full flex-none text-sm text-neutral-400">
						{description}
					</p>
				</div>
			</FadeIn>
		</li>
	)
}
