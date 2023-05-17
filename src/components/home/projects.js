import React from "react"
import Marquee from "react-fast-marquee"

const images = [
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
	},
	{
		alt: "IMG_4985.HEIC",
		source: "/spheres.png",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1614705827065-62c3dc488f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format",
	},
	{
		alt: "IMG_4985.HEIC",
		source:
			"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format",
	},
]

export default function Projects() {
	return (
		<section className="mx-auto space-y-12 py-24 sm:py-32">
			<div className="text-center">
				<h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
					Projects
				</h2>
				<div className="flex w-full justify-center">
					<p className="mt-4 max-w-prose font-grotesk text-lg leading-8 text-slate-400">
						Check out my latest projects and experiments! From little 3D
						experiments to full-scale web apps, I'm always working on something
						new.
					</p>
				</div>
			</div>
		</section>
	)
}
