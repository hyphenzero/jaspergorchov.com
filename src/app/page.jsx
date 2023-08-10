import Link from 'next/link'
import Image from 'next/image'

import clsx from 'clsx'
import { PlayIcon } from '@heroicons/react/20/solid'
import {
	CubeIcon,
	GlobeAltIcon,
	RectangleStackIcon,
	WindowIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/outline'

import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { LargeText } from '@/components/LargeText'
import { Button } from '@/components/Button'
import { ProjectsGrid, Project } from '@/components/ProjectsGrid'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'

const services = [
	{
		name: 'UI/UX',
		icon: WindowIcon,
	},
	{
		name: '3D',
		icon: CubeIcon,
	},
	{
		name: 'Web Design',
		icon: GlobeAltIcon,
	},
	{
		name: 'AR/VR',
		icon: RectangleStackIcon,
	},
]

const projects = [
	{
		id: '1',
		href: '/work/',
		title: 'Client 1',
		date: 'March 2023',
		description: 'Project description 1',
		medium: '3D Design',
		image: null,
	},
	{
		id: '2',
		href: '/work/',
		title: 'Client 2',
		date: 'April 2023',
		description: 'Project description 2',
		medium: '3D Design',
		image: null,
	},
	{
		id: '3',
		href: '/work/',
		title: 'Client 3',
		date: 'June 2023',
		description: 'Project description 3',
		medium: '3D Design',
		image: null,
	},
	{
		id: '4',
		href: '/work/',
		title: 'Client 4',
		date: 'July 2023',
		description: 'Project description 4',
		medium: '3D Design',
		image: null,
	},
	{
		id: '5',
		href: '/work/',
		title: 'Client 5',
		date: 'July 2023',
		description: 'Project description 5',
		medium: '3D Design',
		image: null,
	},
	{
		id: '6',
		href: '/work/',
		title: 'Client 6',
		date: 'July 2023',
		description: 'Project description 6',
		medium: '3D Design',
		image: null,
	},
]

function Services() {
	return (
		<Section className="mt-32">
			<FadeIn className="flex items-center gap-x-8">
				<h2 className="font-display text-sm font-semibold tracking-wider text-white">
					A wide range of possibilities
				</h2>
				<div className="h-px flex-auto bg-neutral-800/50" />
			</FadeIn>
			<FadeInStagger faster>
				<ul
					role="list"
					className="relative mt-10 grid grid-cols-2 gap-12 sm:mt-16 sm:grid-cols-2 sm:gap-16"
				>
					{services.map((service) => (
						<li key={service.name} className="">
							<FadeIn className="flex items-center">
								<service.icon className="mr-4 h-7 w-7 -translate-y-[1.5px] text-sky-300 sm:mr-5" />
								<p className="flex items-center font-display font-medium text-white sm:text-2xl">
									{service.name}
								</p>
							</FadeIn>
						</li>
					))}
				</ul>
			</FadeInStagger>
		</Section>
	)
}

export const metadata = {
	description:
		'I’m Jasper Gorchov, and I craft immersive web-based apps and beautiful 3D illustrations.',
}

export default function Home() {
	return (
		<>
			{/* <BlurryShape /> */}

			<div className="relative">
				<Container className="mt-24 py-32 sm:py-48 lg:py-56">
					<FadeIn className="max-w-2xl sm:mx-auto sm:text-center">
						<h1 className="font-display text-5xl font-medium tracking-tight text-white [text-wrap:balance] sm:text-7xl">
							Software Developer <br className="max-sm:hidden" />& 3D Designer
						</h1>
						<p className="mt-6 text-xl text-neutral-400">
							I’m Jasper Gorchov, and I craft immersive web-based apps and
							aesthetic 3D illustrations.{' '}
							<span className="max-sm:hidden">
								I harness the combination of these powerful mediums to create
								the future of digital interations and experiences.
							</span>
						</p>
						<div className="mt-8 w-full items-center sm:flex sm:justify-center">
							{/* <Link href="https://youtube.com/watch/" className="rounded-full">
								<Button className="shadow-neutral-950 sm:w-fit">
									Browse work
								</Button>
							</Link> */}
							<Link className="rounded-full max-sm:mt-3 sm:ml-6" href="/work">
								<Button
									className="w-fit rounded-full shadow-neutral-950"
									secondary
									// leadingIcon={<PlayIcon className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200" />}
									trailingIcon={
										<ChevronRightIcon className="-mt-px translate-x-1 text-neutral-500 transition-all duration-300 group-hover:text-neutral-300" />
									}
								>
									Browse work
								</Button>
							</Link>
						</div>

						{/* <ArrowDownIcon className="mt-8 w-5 h-5 text-neutral-700 mx-auto" /> */}
					</FadeIn>
				</Container>

				<Services />

				<LargeText
					overlay
					text="I craft visually stunning, web-based 3D experiences that immerse users in extraordinary worlds."
				/>
			</div>

			<ProjectsGrid title="Featured Projects" moreButton moreButtonHref="/work">
				{projects.map((project) => (
					<Project
						key={project.id}
						client={project.title}
						description={project.description}
						href={project.href}
					/>
				))}
			</ProjectsGrid>
		</>
	)
}
