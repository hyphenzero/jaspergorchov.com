import clsx from 'clsx'

export function Section({ children, className }) {
	return (
		<div
			className={clsx('rounded-3xl bg-neutral-912 py-14 sm:py-32', className)}
		>
			<div className="mx-auto w-full max-w-7xl px-8">{children}</div>
		</div>
	)
}
