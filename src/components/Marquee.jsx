import clsx from 'clsx'
import MarqueeAnimation from 'react-fast-marquee'

export function Marquee({ children, className }) {
	return (
		<div className="mt-10 py-20 sm:mt-20 sm:py-32 lg:mt-30">
			<MarqueeAnimation speed={50} className={clsx('bg-neutral-900/50 py-12 border-y border-neutral-800 text-3xl uppercase font-display text-neutral-100', className)}>
				{children}
			</MarqueeAnimation>
		</div>
  )
}

export function Divider() {
	return (
		<span className="mx-10 sm:mx-20 text-lg text-neutral-500 font-grid">*</span>
	)
}
