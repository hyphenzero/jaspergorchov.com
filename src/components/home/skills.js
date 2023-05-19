import React from "react"
import { SparklesIcon } from "@heroicons/react/24/solid"

export default function Software() {
	return (
		<div className="overflow-hidden">
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="flex h-full items-center justify-center">
						<div className="lg:max-w-lg">
							<div className="flex aspect-square w-fit items-center justify-center rounded-lg bg-teal-500/20 px-3.5 py-2.5 font-grotesk text-base font-semibold text-teal-400 ring-1 ring-inset ring-teal-400/20">
								<SparklesIcon className="h-7 w-7" />
							</div>
							<p className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
								Skills. Intertwined.
							</p>
							<p className="mt-4 font-grotesk text-lg leading-8 text-slate-400">
								At the intersection of software development and 3D art, I aim to
								transport users into a digital world that sparks their
								imagination and leaves a lasting impact.
							</p>
						</div>
					</div>
					<img
						src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
						alt="Product screenshot"
						className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
						width={2432}
						height={1442}
					/>
				</div>
			</div>
		</div>
	)
}
