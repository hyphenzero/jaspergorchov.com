import React from "react"
import Marquee from "react-fast-marquee"

const images = [
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
]

export default function Images() {
	return (
		<section className="mx-auto space-y-12 py-24 sm:py-32">
			<Marquee
				gradient={true}
				gradientColor={[2, 6, 23]}
				className="grid w-full max-w-none grid-cols-5"
			>
				{images.map((image) => (
					<div className="flex items-center justify-center">
						<div
							className="relative mx-12 h-48 w-48 md:h-64 md:w-64"
							key={image.alt}
						>
							<img
								src={image.source}
								alt={image.alt}
								className="aspect-square h-48 w-48 rounded-xl border border-slate-800/75 md:h-64 md:w-64"
							/>
						</div>
					</div>
				))}
			</Marquee>
			<div className="text-center md:float-right md:mr-16">
				<a
					href="/work"
					className="font-grotesk text-base font-medium text-slate-500 transition-colors duration-200 hover:text-sky-400"
				>
					See the full gallery <span className="font-sans">→</span>
				</a>
			</div>
		</section>
	)
}
