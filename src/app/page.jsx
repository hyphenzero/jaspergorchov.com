import Image from 'next/image'

import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader' 
import { Parallax } from '@/components/Parallax'
import { Marquee, Divider } from '@/components/Marquee'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'

export default function Home() {
	return (
		<>
			<Container className="mt-24 py-32 sm:py-48 lg:py-56">
				<FadeIn className="max-w-2xl mx-auto text-center">
					<h1 className="font-display text-5xl/[3.5rem] font-medium tracking-tight text-neutral-100 [text-wrap:balance] sm:text-[4rem]/[4.5rem]">
						Software Developer <br className="max-sm:hidden" /> & 3D Designer
					</h1>
					<p className="mt-6 text-lg/8 text-neutral-400 [text-wrap:balance]">
						I’m <span className="text-neutral-100 font-medium">Jasper Gorchov</span>, and I craft immersive web-based apps and
						aesthetic 3D illustrations.{' '}
						<span className="max-sm:hidden">
							I harness the combination of these powerful mediums to create the
							future of digital experiences.
						</span>
					</p>
					
					<p className="uppercase font-grid mt-12 text-neutral-600">↓</p>
				</FadeIn>
			</Container>
			
			<Marquee>
				<span>UI/UX</span>
				<Divider />
				<span>Software Development</span>
				<Divider />
				<span>3D</span>
				<Divider />
				<span>Design</span>
				<Divider />
				<span>Digital Experiences</span>
				<Divider />
				<span>Web</span>
				<Divider />
			</Marquee>

			<SectionHeader className="z-10" number="01" text="I craft visually stunning, web-based 3D experiences that immerse users in extraordinary worlds." post="3D experiences" />
		</>
	)
}
