import Link from 'next/link'

import { Bars2Icon } from '@heroicons/react/24/solid'
import { ForwardIcon } from '@heroicons/react/20/solid'
import WavePattern from './WavePattern'
import Logo from './Logo'
import { SecondaryButton } from './Button'

const navigation = [
	{ name: 'About', href: '#' },
	{ name: 'Work', href: '#' },
	{ name: 'Blog', href: '#' },
]

const social = [
	{
		name: "Dribbble",
		href: "https://dribbble.com/hyphenzero",
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
		name: "GitHub",
		href: "https://github.com/hyphenzero",
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

export function RootLayout({ children }) {
	return (
		<>
			<Header />
			<main className="min-h-full w-screen overflow-x-hidden">
				<WavePattern fade="fromTopRight" parallax />
				{children}
			</main>
			<Footer />
		</>
	)
}

function Header() {
	return (
		<header className="absolute inset-x-0 top-0 z-50 mx-auto w-full max-w-7xl">
			<nav
				className="flex items-center justify-between p-6 lg:px-8"
				aria-label="Global"
			>
				<div className="flex items-center lg:space-x-20">
					<Link
						href="/"
						aria-label="Home"
					>
						<Logo />
					</Link>
					<div className="hidden lg:flex lg:gap-x-10 motion-reduce:lg:gap-x-5">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="flex items-center group rounded-md motion-reduce:px-3 hover:px-3 py-1 text-sm font-medium text-neutral-100 hover:text-sky-300 transition-all duration-300 hover:bg-sky-300/20 backdrop-blur-3xl"
							>
								<ForwardIcon className="h-4 w-0 group-hover:w-4 transition-[all,_width] duration-300 group-hover:mr-1.5 motion-reduce:group-hover:hidden" />
								{item.name}
							</Link>
						))}
					</div>
				</div>
				<div className="flex items-center max-lg:space-x-4">
					<Link href="/contact">
						<SecondaryButton>Contact</SecondaryButton>
					</Link>
					<div className="lg:hidden rounded-full p-3 transition-all duration-200 hover:bg-neutral-900">
						<Bars2Icon className="h-6 w-6 text-neutral-100" />
					</div>
				</div>
			</nav>
		</header>
	)
}

function Footer() {
	return (
		<footer aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
				<div className="mt-16 border-t border-neutral-900 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
					<div>
						<h3 className="font-display text-sm font-semibold leading-6 text-white">Subscribe to the newsletter</h3>
						<p className="mt-2 text-sm leading-6 text-neutral-300">
							Get monthly updates on my projects, right in your inbox.
						</p>
					</div>
					<form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
						<label htmlFor="email-address" className="sr-only">
							Email address
						</label>
						<input
							type="email"
							name="email-address"
							id="email-address"
							autoComplete="email"
							required
							className="w-full min-w-0 appearance-none rounded-md border-0 bg-neutral-950 px-3 py-1.5 text-base text-white ring-1 ring-inset ring-neutral-800 placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-sky-300 sm:w-56 sm:text-sm sm:leading-6"
							placeholder="Enter your email"
						/>
						<div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
							<button
								type="submit"
								className="flex w-full items-center justify-center rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 transition-colors duration-200"
							>
								Subscribe
							</button>
						</div>
					</form>
				</div>
				<div className="mt-8 border-t border-neutral-900 pt-8 md:flex md:items-center md:justify-between">
					<div className="flex space-x-6 md:order-2">
						{social.map((item) => (
							<a key={item.name} href={item.href} className="text-neutral-500 hover:text-neutral-400">
								<span className="sr-only">{item.name}</span>
								<item.icon className="h-6 w-6" aria-hidden="true" />
							</a>
						))}
					</div>
					<p className="mt-8 text-sm leading-5 text-neutral-400 md:order-1 md:mt-0">
						&copy; {new Date().getFullYear()} Jasper Gorchov. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
