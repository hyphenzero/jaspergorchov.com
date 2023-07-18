import { Container } from "@/components/Container"
import { FadeIn, FadeInStagger } from '@/components/FadeIn'

export default function Home() {
	return (
		<>
			<Container className="mt-24 py-32 sm:py-48 lg:py-56">
				<FadeIn className="max-w-3xl">
					<h1 className="font-display text-5xl/[3.5rem] font-medium tracking-tight text-neutral-100 [text-wrap:balance] sm:text-6xl/[4.5rem] lg:text-[4rem]/[4.5rem]">
						Software Developer <br className="max-sm:hidden" /> & 3D Artist
					</h1>
					<p className="mt-6 text-lg/8 text-neutral-400">
						I’m Jasper Gorchov, and I craft immersive web-based apps and aesthetic 3D illustrations. <span className="max-sm:hidden">I harness the combination of these powerful mediums to create the future of digital experiences.</span>
					</p>
				</FadeIn>
      </Container>
		</>
	)
}
