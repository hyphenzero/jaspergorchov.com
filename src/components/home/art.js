import React from "react"

export default function Software() {
	return (
		<div className="overflow-hidden">
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<img
						src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
						alt="Product screenshot"
						className="-ml-96 w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-[57rem]"
						width={2432}
						height={1442}
					/>
					<div className="flex h-full items-center justify-end">
						<div className="space-y-4 text-right lg:max-w-lg">
							<h2 className="font-grotesk text-base font-semibold leading-7 text-sky-400">
								3D Artist
							</h2>
							<p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
								Digital Worlds
							</p>
							<p className="font-grotesk text-lg leading-8 text-slate-400">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Possimus maxime quia ea, ab, rem mollitia minus quaerat cumque
								suscipit hic magni ipsa similique! Veritatis blanditiis illum
								tempora, repellat rem incidunt.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
