"use client"

import Head from "next/head"
import { Tilt } from "react-tilt"
import CardFlip from "src/components/card/card.js"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

const tiltOptions = {
	reverse: true, // reverse the tilt direction
	max: 10, // max tilt rotation (degrees)
	perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
	scale: 1.05, // 2 = 200%, 1.5 = 150%, etc..
	speed: 1000, // Speed of the enter/exit transition
	transition: true, // Set a transition on enter/exit.
	axis: null, // What axis should be disabled. Can be X or Y.
	reset: true, // If the tilt effect has to be reset on exit.
	easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
}

export default function Card() {
	return (
		<>
			<Head>
				<title>Card - Jasper Gorchov</title>
				<meta
					name="description"
					content="I'm Jasper Gorchov, and I craft immersive web-based apps and aesthetic 3D illustrations."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="apple-touch-icon" href="/logo.svg" />
				<link rel="icon" href="/logo.svg" />
			</Head>
			<main className="cursor-default select-none">
				<div className="absolute float-left ml-16 mt-6 text-center">
					<a
						href="/"
						className="font-grotesk text-base font-medium text-slate-500 transition-colors duration-200 hover:text-sky-400"
					>
						<span className="font-sans">←</span> Back to Home
					</a>
				</div>
				<div className="flex h-screen w-screen flex-col items-center justify-center space-y-12">
					<div className="aspect-video w-10/12 sm:w-1/5 md:w-3/5">
						<Tilt options={tiltOptions}>
							<div className="rounded-[80px] shadow-xl">
								<CardFlip />
							</div>
						</Tilt>
					</div>
					<div className="flex w-fit items-center justify-center rounded-lg bg-slate-900 px-3.5 py-2.5 font-grotesk text-base font-semibold text-slate-400 opacity-60 ring-1 ring-inset ring-slate-800">
						<InformationCircleIcon className="mr-2 h-7 w-7" /> Click Card to
						Flip
					</div>
				</div>
			</main>
		</>
	)
}
