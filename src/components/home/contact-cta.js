import { EnvelopeIcon } from "@heroicons/react/24/solid"

export default function ContactCTA() {
	return (
		<div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
			<div className="relative isolate overflow-hidden bg-slate-900/50 px-6 py-24 text-center sm:rounded-3xl sm:px-16">
				<div className="mx-auto flex aspect-square w-fit items-center justify-center rounded-lg bg-blue-400/20 px-3.5 py-2.5 font-grotesk text-base font-semibold text-blue-400 ring-1 ring-inset ring-blue-400/20">
					<EnvelopeIcon className="h-7 w-7" />
				</div>
				<h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Get in Touch
				</h2>
				<p className="mx-auto mt-4 max-w-xl font-grotesk text-lg leading-8 text-slate-400">
					While I'm not currently looking for new projects, you can feel free to
					shoot me an email if you'd like to talk.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/contact"
						className="rounded-lg bg-slate-900 px-3.5 py-2.5 font-grotesk text-base font-semibold text-slate-400 ring-1 ring-inset ring-slate-800 transition-all duration-300 hover:scale-110 hover:bg-[#0F2B44] hover:text-sky-400 hover:ring-sky-400/20"
					>
						Contact
					</a>
				</div>
			</div>
		</div>
	)
}
