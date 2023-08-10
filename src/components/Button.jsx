import clsx from 'clsx'

export function Button({
	secondary = false,
	glow = false,
	leadingIcon,
	trailingIcon,
	className,
	children,
}) {
	return (
		<div
			className={clsx(
				'group flex items-center justify-center rounded-full px-6 py-2 font-display text-sm font-semibold shadow-xl ring-sky-300 ring-offset-1 backdrop-blur-3xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
				!secondary && 'bg-sky-300 font-bold text-neutral-900 hover:bg-sky-200',
				secondary &&
					'bg-neutral-900 text-white hover:border-neutral-700 hover:bg-neutral-800',
				className,
			)}
		>
			{leadingIcon && <div className="mr-2 h-3.5 w-3.5">{leadingIcon}</div>}{' '}
			{children}{' '}
			{trailingIcon && <div className="ml-2 h-3.5 w-3.5">{trailingIcon}</div>}
		</div>
	)
}
