"use client"

import Head from "next/head"
import { motion, useScroll, useTransform } from "framer-motion"
import { Tilt } from "react-tilt"
import Stats from "src/components/home/stats.js"
import Images from "src/components/home/images.js"
import Skills from "src/components/home/skills.js"
import Projects from "src/components/home/projects.js"
import ContactCTA from "src/components/home/contact-cta.js"
import Footer from "src/components/home/footer.js"

const containerVariant = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.4 },
	},
}

const logoVariant = {
	hidden: { opacity: 0, x: -30, rotate: -30 },
	visible: { opacity: 1, x: 0, rotate: 0 },
}

const navVariant = {
	hidden: { opacity: 0, y: -15 },
	visible: { opacity: 1, y: 0 },
}

const bgVariant = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
}

const itemVariant = {
	hidden: { opacity: 0, y: 15 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: "easeInOut" },
	},
}

const navigation = [
	{ name: "About", href: "/about" },
	{ name: "Work", href: "/work" },
	{ name: "Projects", href: "/projects" },
	{ name: "Card", href: "/card" },
]

const tiltOptions = {
	reverse: true, // reverse the tilt direction
	max: 35, // max tilt rotation (degrees)
	perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
	scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
	speed: 1000, // Speed of the enter/exit transition
	transition: true, // Set a transition on enter/exit.
	axis: null, // What axis should be disabled. Can be X or Y.
	reset: true, // If the tilt effect has to be reset on exit.
	easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
}

export default function Home() {
	const { scrollYProgress } = useScroll()
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"])

	return (
		<>
			<Head>
				<title>Jasper Gorchov</title>
				<meta
					name="description"
					content="I'm Jasper Gorchov, and I craft immersive web-based apps and aesthetic 3D illustrations."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" href="/logo.svg" />
				<link rel="icon" href="/logo.svg" />
			</Head>
			<main className="w-screen overflow-x-clip">
				<section className="h-screen w-screen">
					<div className="overflow-hidden">
						<div className="sm:max-w-2xl">
							<motion.div
								variants={containerVariant}
								initial="hidden"
								animate="visible"
								className="flex h-screen w-screen flex-col items-center justify-center space-y-8"
							>
								<motion.nav
									variants={navVariant}
									transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
									className="fixed top-0 z-50 flex w-screen items-center justify-between bg-gradient-to-b from-slate-950 to-transparent px-6 py-4 md:px-28"
								>
									<a href="./" className="relative flex">
										<div className="h-12 w-12 rounded-full bg-slate-900"></div>
										<img
											src="logo.svg"
											alt="HyphenZero Logo"
											className="absolute left-0 top-0 z-10 h-12 w-12 rounded-full"
										/>
									</a>

									<div className="hidden md:flex">
										<div className="flex items-center justify-center space-x-12">
											{navigation.map((item) => (
												<a
													href={item.href}
													className="font-grotesk text-base font-medium text-slate-400 transition-colors duration-200 hover:text-sky-400"
												>
													{item.name}
												</a>
											))}
										</div>
									</div>

									<a
										href="/contact"
										className="rounded-lg bg-[#090E20] px-3.5 py-2.5 font-grotesk text-base font-semibold text-slate-400 ring-1 ring-inset ring-slate-800 transition-all duration-300 hover:scale-110 hover:bg-[#0F2B44] hover:text-sky-400 hover:ring-sky-400/20"
									>
										Contact
									</a>
								</motion.nav>

								<Tilt options={tiltOptions}>
									<motion.div
										variants={logoVariant}
										transition={{ duration: 0.7, ease: "easeInOut" }}
										className="flex h-fit w-fit rounded-full border border-slate-800 bg-slate-900 shadow-2xl shadow-sky-400/10"
									>
										<img
											src="logo.svg"
											alt="HyphenZero logo"
											className="w-24 sm:w-36"
										/>
									</motion.div>
								</Tilt>

								<motion.h1
									variants={itemVariant}
									className="max-w-sm bg-gradient-to-tr from-slate-50/60 to-slate-50 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent sm:max-w-2xl sm:text-7xl"
								>
									Software Developer & 3D Artist
								</motion.h1>

								<motion.p
									variants={itemVariant}
									className="max-w-sm text-center font-grotesk text-lg text-slate-400 sm:max-w-md sm:text-xl sm:leading-8"
								>
									I'm Jasper Gorchov, and I craft immersive web-based apps and
									aesthetic 3D illustrations.
								</motion.p>

								<motion.div
									variants={bgVariant}
									transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
									className="-z-10"
								>
									<svg
										className="absolute inset-0 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
										aria-hidden="true"
									>
										<defs>
											<pattern
												id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
												width={200}
												height={200}
												x="50%"
												y={-1}
												patternUnits="userSpaceOnUse"
											>
												<path d="M.5 200V.5H200" fill="none" />
											</pattern>
										</defs>
										<svg
											x="50%"
											y={-1}
											className="overflow-visible fill-slate-800/20"
										></svg>
										<rect
											width="100%"
											height="100%"
											strokeWidth={0}
											fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
										/>
									</svg>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>

				<Images />

				<Stats />

				<Skills />

				<Projects />

				<ContactCTA />

				<Footer />
			</main>
		</>
	)
}
