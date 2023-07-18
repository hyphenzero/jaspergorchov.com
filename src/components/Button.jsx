export function SecondaryButton({ children }) {
	return (
		<div className="rounded-full border border-neutral-800 px-6 py-2 flex items-center justify-center text-sm font-semibold text-neutral-100 transition-colors duration-200 hover:border-neutral-700 bg-black hover:bg-neutral-900 shadow-xl shadow-black focus:outline-none focus:ring-2 ring-sky-300">
			{children}
		</div>
	)
}

export function PrimaryButton({ children }) {
	return (
		<div className="rounded-full border-t border-sky-200 flex items-center justify-center bg-gradient-to-t from-sky-400 to-sky-300 px-6 py-4 text-sm text-neutral-100 shadow-xl shadow-black transition-colors duration-200">
			{children}
		</div>
	)
}
