import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { Container } from '@/components/container'
import { FadeIn, FadeInStagger } from '@/components/fade-in'
import workImage from '@/images/work.png'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import Link from 'next/link'

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-sky-400 dark:fill-zinc-400 dark:group-hover:fill-sky-300" />
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <main className="px-2 pt-2">
        {/* <Spline
              scene="https://prod.spline.design/RpizKHhpMvHWEUhw/scene.splinecode"
              className="z-10 pointer-events-none translate-y-[25%] translate-x-[50%] absolute aspect-square scale-[1.75] max-lg:mx-auto max-lg:mt-32 lg:my-auto"
            /> */}
        {/* <div className="pointer-events-none absolute left-1/2 top-2 z-10 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
          <div className="absolute -inset-px bg-gradient-to-r from-sky-300 to-indigo-400 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-sky-400/30 dark:to-indigo-400/30 dark:opacity-100">
            <svg
              aria-hidden="true"
              className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/30 stroke-black/50 mix-blend-overlay dark:fill-white/[.035] dark:stroke-white/5"
            >
              <defs>
                <pattern id=":S1:" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
                  <path d="M.5 56V.5H72" fill="none"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#:S1:)"></rect>
              <svg x="-12" y="4" className="overflow-visible">
                <rect stroke-width="0" width="73" height="57" x="288" y="168"></rect>
                <rect stroke-width="0" width="73" height="57" x="144" y="56"></rect>
                <rect stroke-width="0" width="73" height="57" x="504" y="168"></rect>
                <rect stroke-width="0" width="73" height="57" x="720" y="336"></rect>
              </svg>
            </svg>
          </div>
        </div> */}

        <Card className="flex overflow-hidden lg:h-[calc(100dvh-16px)] lg:items-center lg:justify-center">
          {/* <div className="z-50 pointer-events-none absolute inset-x-0 top-0 flex justify-center">
						<div className="shrink-0" aria-hidden="true"
							// style="opacity: 1; transform: translateY(0%) translateZ(0px);"
						>
              <div className="relative -translate-y-[60px] [mask-image:linear-gradient(black_50%,transparent)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-zinc-950 before:via-transparent before:to-zinc-950">
								<Image alt="" fill
									// style="color:transparent"
									src={auroraLayer1} />
              </div>
              <div className="absolute inset-0 translate-x-[60px] [mask-image:linear-gradient(black_50%,transparent)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-zinc-950 before:via-transparent before:to-zinc-950">
								<Image alt="" fill
									// style="color:transparent"
									src={auroraLayer2} />
              </div>
            </div>
          </div> */}

          {/* <Aurora /> */}

          <Container className="">
            <FadeInStagger faster className="max-w-7xl">
              <FadeIn>
                <h1 className="mx-auto mt-6 text-balance text-center text-4xl font-medium tracking-tight text-zinc-950 sm:text-9xl dark:text-white">
                  Jasper
                  <br />
                  Gorchov
                </h1>
              </FadeIn>
              <FadeIn wait className="absolute left-0 top-0 z-10 aspect-video h-full rounded-xl bg-white"></FadeIn>
              {/* <FadeIn>
                <p className="mx-auto mt-8 max-w-xl text-center text-lg text-zinc-500 dark:text-zinc-400">
                  I’m Jasper, and I create sites, illustrations, and experiences with professional tools and
                  technologies.
                </p>
              </FadeIn> */}
              <FadeIn>
                <div className="mt-10 flex items-center justify-between">
                  <div className="mx-auto flex items-center gap-x-6">
                    <Button>View work</Button>
                    <Button plain>
                      <PlayIcon />
                      Watch the video
                    </Button>
                  </div>
                  {/* <div className="flex h-full gap-6">
                    <SocialLink href="#" aria-label="Follow on GitHub" icon={GitHubIcon} />
                    <SocialLink href="#" aria-label="Follow on X" icon={XIcon} />
                    <SocialLink href="#" aria-label="Follow on Instagram" icon={InstagramIcon} />
                    <SocialLink href="#" aria-label="Follow on Behance" icon={LinkedInIcon} />
                  </div> */}
                </div>
              </FadeIn>
            </FadeInStagger>
          </Container>

          {/* </div> */}
        </Card>

        <Container className="py-24 sm:py-32">
          <div className="flex-col">
            <p className="font-mono text-xs/4 uppercase tracking-widest text-zinc-500">Work</p>
            <div className="mt-2 flex items-end justify-between">
              <h2 className="font-display text-4xl font-medium text-zinc-950 dark:text-white">Featured projects</h2>
              <Button plain>
                See all <ArrowRightIcon />
              </Button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl">
              <div className="absolute inset-0 z-10 rounded-xl shadow ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image alt="" fill src={workImage} className="-inset-px object-cover" unoptimized />
            </div>
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl">
              <div className="absolute inset-0 z-10 rounded-xl shadow ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image alt="" fill src={workImage} className="-inset-px object-cover" unoptimized />
            </div>
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl">
              <div className="absolute inset-0 z-10 rounded-xl shadow ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image alt="" fill src={workImage} className="-inset-px object-cover" unoptimized />
            </div>
          </div>
        </Container>
      </main>
    </>
  )
}
