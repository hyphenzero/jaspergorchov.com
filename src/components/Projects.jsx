'use client'

import Image from 'next/image'

import clsx from 'clsx'

import { LinkArrow } from './LinkArrow'
import { FadeIn, FadeInStagger } from './FadeIn'
import { Button } from './Button'

export function Projects({ projects, title, featured = false, images = true, className }) {
  return (
    <div className={clsx('text-white', className)}>
      {featured && (
        <h2 className="mb-20 mt-6 text-center font-display text-3xl font-medium sm:text-4xl">
          Featured Projects
        </h2>
			)}
			{title && (
        <h2 className="mb-20 mt-6 text-center font-display text-3xl font-medium sm:text-4xl">
          {title}
        </h2>
			)}
      <FadeInStagger faster>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {projects.map((project) => (
            <article key={project.id}>
							<FadeIn className="flex flex-col items-start justify-between h-full">
								{images && (
									<div className="relative aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[3/2]">
										<Image
											{...project.image}
											className="rounded-2xl bg-neutral-900 object-cover"
											fill
											unoptimized
										/>
										<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
									</div>
								)}
                <div className="flex flex-col max-w-xl h-full">
                  <div className={clsx('flex items-center gap-x-4 text-xs font-medium', images && 'mt-8')}>
                    <time
                      dateTime={project.date.split('-')[0]}
                      className="font-display text-white"
                    >
                      {project.date.split('-')[0]}
                    </time>
                    <span className="text-neutral-700">/</span>
                    <div
                      href={project.service.href}
                      className="relative z-10 rounded-full bg-neutral-800/75 px-3 py-1.5 font-medium text-white transition-colors duration-200"
                    >
                      {project.service}
                    </div>
                  </div>
                  <div className="group relative mt-auto">
                    <h3 className="mt-5 font-display text-lg font-semibold text-white transition-colors duration-200 group-hover:text-sky-300">
                      <a href={project.href}>
                        <span className="absolute inset-0" />
                        {project.title}
                        <LinkArrow />
                      </a>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm text-neutral-400">
                      {project.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </article>
          ))}
        </div>
      </FadeInStagger>
      {featured && (
        <div className="mt-20 flex items-center justify-center">
          <Button href="/work" className="w-fit items-center">
            See more...
          </Button>
        </div>
      )}
    </div>
  )
}
