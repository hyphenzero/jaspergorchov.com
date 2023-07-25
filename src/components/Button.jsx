export function SecondaryButton({ children }) {
	return (
		<div className="flex items-center justify-center font-display rounded-full border border-neutral-800 bg-neutral-950 px-6 py-2 text-sm font-semibold text-neutral-100 shadow-xl shadow-neutral-950 ring-sky-300 transition-colors duration-200 hover:border-neutral-700 hover:bg-neutral-900 focus:outline-none focus:ring-2 ring-offset-1">
			{children}
		</div>
	)
}

export function PrimaryButton({ children }) {
	return (
		<div className="flex items-center justify-center font-semibold font-display rounded-full border-t border-sky-200 bg-gradient-to-t from-sky-400 to-sky-300 px-6 py-2 text-sm text-neutral-950 shadow-xl shadow-neutral-950 transition-[all,_background-image] duration-200 focus:outline-none focus:ring-2 ring-sky-300 ring-offset-1 hover:from-sky-600 hover:to-sky-400">
			{children}
		</div>
	)
}
