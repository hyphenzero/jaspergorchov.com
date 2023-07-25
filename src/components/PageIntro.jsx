import clsx from 'clsx'

import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

export function PageIntro({ number, eyebrow, title, children, centered = false }) {
	return (
		<Container
			className={clsx('mt-24 sm:mt-32 lg:mt-40', centered && 'text-center')}
		>
			<FadeIn>
				<h1>
					<span className="block font-grid text-base font-semibold text-neutral-300">
						{eyebrow} <span className="align-top font-sans text-xs text-neutral-600">({number})</span>
					</span>
					<span className="sr-only"> - </span>
					<span
						className={clsx(
							'mt-6 block font-display text-4xl/[3rem] font-medium tracking-tight text-neutral-100 [text-wrap:balance] sm:text-5xl/[3.5rem]',
							centered && 'mx-auto',
						)}
					>
						{title}
					</span>
				</h1>
				<div
					className={clsx(
						'mt-6 max-w-3xl text-lg/8 text-neutral-400',
						centered && 'mx-auto',
					)}
				>
					{children}
				</div>
			</FadeIn>
		</Container>
	)
}
