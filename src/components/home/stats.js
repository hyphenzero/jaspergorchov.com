"use client"

import React, { useState, useRef, useEffect } from "react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { EyeIcon } from "@heroicons/react/24/solid"

const startDate = new Date("December 1, 2020")
const currentDate = new Date()
const yearsOfExperience = Math.floor(
	(currentDate - startDate) / (1000 * 60 * 60 * 24 * 365)
)

const stats = [
	{ id: 1, name: "Projects", value: null },
	{ id: 2, name: "Years of Experience", value: yearsOfExperience },
	{ id: 3, name: "Programming Languages", value: 7 },
]

const Stats = () => {
	const [isVisible, setIsVisible] = useState(false)
	const { ref, inView } = useInView({
		threshold: 0.6,
		triggerOnce: true,
	})

	const statRefs = useRef(stats.map(() => React.createRef()))

	if (inView && !isVisible) {
		setIsVisible(true)
	}

	const [projects, setProjects] = useState(null)

	useEffect(() => {
		fetch("https://api.github.com/users/HyphenZero/repos")
			.then((response) => response.json())
			.then((data) => {
				const projects = data.length
				setProjects(projects)
			})
	}, [])

	stats[0].value = projects

	return (
		<section className="w-screen" ref={ref}>
			<div className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 sm:px-8">
					<div className="mx-auto max-w-2xl sm:max-w-none">
						<div className="text-center">
							<div className="flex justify-center items-center aspect-square mx-auto w-fit rounded-lg px-3.5 py-2.5 font-grotesk text-base font-semibold ring-1 ring-inset bg-[#0F2B44] text-sky-400 ring-sky-400/20">
								<EyeIcon className="w-7 h-7" />
							</div>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
								Visual Thinker
							</h2>
							<div className="flex w-full justify-center">
								<p className="mt-4 max-w-prose font-grotesk text-lg leading-8 text-slate-400">
									With a keen eye for detail and a focus on crafting clean and
									modern visuals, my design work is characterized by a fresh and
									dynamic approach.
								</p>
							</div>
						</div>
						<dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
							{stats.map((stat, index) => (
								<div
									key={stat.id}
									className="flex flex-col bg-slate-900/50 p-8"
									ref={statRefs.current[index]}
								>
									<dt className="font-grotesk text-sm/6 font-semibold uppercase text-slate-400">
										{stat.name}
									</dt>
									<dd className="order-first font-grotesk text-3xl font-semibold tracking-tight text-slate-100">
										{isVisible ? (
											<CountUp
												start={0}
												end={stat.value}
												duration={4}
												separator=","
											/>
										) : (
											stat.value
										)}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Stats
