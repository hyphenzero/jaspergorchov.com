export function Grid({ children }) {
	return (
		<div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 text-neutral-100 font-display font-medium">
			{children}
		</div>
	)
}
