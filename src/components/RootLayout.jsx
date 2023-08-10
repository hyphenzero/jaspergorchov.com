'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import clsx from 'clsx'
import { Dialog } from '@headlessui/react'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { Parallax } from './Parallax'
import { WavePattern } from './WavePattern'
import { Logo } from './Logo'
import { Button } from './Button'

const navigation = [
	{ name: 'About', href: '/about' },
	{ name: 'Work', href: '/work' },
	{ name: 'Playground', href: '/playground' },
]

const social = [
	{
		name: 'Dribbble',
		href: 'https://dribbble.com/hyphenzero',
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: 'GitHub',
		href: 'https://github.com/hyphenzero',
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
]

function Header() {
	const router = useRouter()

	const isActiveRoute = (href) => {
		return router.pathname === href
	}

	return (
		<header className="absolute inset-x-0 top-0 z-50 mx-auto w-full max-w-7xl">
			<nav
				className="flex items-center justify-between p-6 lg:px-8"
				aria-label="Global"
			>
				<div className="flex items-center lg:space-x-20">
					<Link href="/" aria-label="Home">
						<Logo />
					</Link>
					<div className="hidden lg:flex lg:gap-x-10 motion-reduce:lg:gap-x-5">
						{/* 'flex items-center rounded-lg py-1 text-sm font-medium hover:backdrop-blur-3xl hover:bg-sky-300/5 hover:px-3 motion-reduce:px-3 transition-all duration-300' */}
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center rounded-full py-1 text-sm font-medium transition-all duration-300 hover:bg-neutral-900 hover:px-4 hover:backdrop-blur-3xl motion-reduce:px-3 ${
									isActiveRoute(item.href) ? 'text-sky-300' : 'text-white'
								}`}
							>
								{/* <span className="mb-px absolute opacity-0 transition-opacity duration-300 text-sky-300 group-hover:opacity-100 motion-reduce:group-hover:hidden font-grid">→</span> */}
								{item.name}
							</Link>
						))}
					</div>
				</div>
				<div className="flex items-center max-lg:space-x-4">
					<Link href="/contact" className="rounded-full">
						<Button secondary className="shadow-neutral-950">
							Contact
						</Button>
					</Link>
					<div className="rounded-full p-3 lg:hidden">
						<Bars2Icon className="h-6 w-6 text-white" />
					</div>
				</div>
			</nav>
		</header>
	)
}

function Footer() {
	return (
		<footer aria-labelledby="footer-heading" className="mt-32">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl border-t border-neutral-900 px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6 md:order-2">
					{social.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className="text-neutral-500 transition-colors duration-200 hover:text-sky-300"
						>
							<span className="sr-only">{item.name}</span>
							<item.icon className="h-6 w-6 rounded-full" aria-hidden="true" />
						</a>
					))}
				</div>
				<div className="mt-8 md:order-1 md:mt-0">
					<p className="text-center text-xs leading-5 text-neutral-500">
						&copy; {new Date().getFullYear()} Jasper Gorchov. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export function RootLayout({ children, wavePattern = true }) {
	return (
		<>
			<Header />
			<main className="min-h-full w-screen overflow-hidden">
				{wavePattern && (
					<div className="absolute inset-0 -z-10 h-screen w-screen overflow-x-clip">
						<WavePattern className="absolute left-0 top-0 -z-10 h-screen max-w-none overflow-clip bg-cover bg-center [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] max-sm:-translate-x-96" />
					</div>
				)}
				{children}
			</main>
			<Footer />
		</>
	)
}
