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
          {/* <div className="mx-auto h-full max-w-7xl px-6 pb-24 max-lg:pt-24 sm:pb-32 lg:flex lg:items-center lg:justify-center lg:px-8 lg:py-0"> */}
          {/* <div className="mx-auto max-w-2xl flex-shrink-0 text-center lg:mx-0 lg:max-w-xl">
              <Link href="/blog" className="group inline-flex space-x-4">
                <Badge>jaspergorchov.com v2.0</Badge>
                <Text className="inline-flex items-center space-x-2">
                  <span>My personal website, redesigned</span>
                  <ChevronRightIcon className="size-4 text-zinc-500" aria-hidden="true" />
                </Text>
              </Link>
              <h1 className="mt-10 text-4xl font-medium tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
                13-year-old developer, designer, and 3D artist
              </h1>
              <p className="mt-6 text-lg/8 text-zinc-600 dark:text-zinc-400">
                I’m Jasper Gorchov, and I create websites, illustrations, and experiences with professional tools and
                technologies.
              </p>
              <div className="mx-auto mt-10 flex w-fit items-center gap-x-6 text-center">
                <Button>View work</Button>
                <Button plain>
                  <PlayIcon />
                  Watch the video
                </Button>
              </div>
            </div> */}

          <Container className="">
            <FadeInStagger faster className="mx-auto max-w-5xl">
              <FadeIn>
                <p className="mb-[1em] text-center text-3xl font-medium leading-none tracking-[.004em] text-zinc-400">
                  Jasper Gorchov
                </p>
              </FadeIn>
              <FadeIn>
                <h1 className="text-center text-6xl font-medium tracking-[-0.015em] text-zinc-950 sm:text-7xl dark:text-white">
                  13-year-old developer, designer, and digital artist.
                </h1>
              </FadeIn>
              <FadeIn>
                <div className="mx-auto mt-14 flex w-fit items-center gap-x-6">
                  <Button>View work</Button>
                  <Button plain>
                    <PlayIcon />
                    Watch the video
                  </Button>
                </div>
              </FadeIn>
            </FadeInStagger>
          </Container>

          {/* <Spline
              scene="https://prod.spline.design/RpizKHhpMvHWEUhw/scene.splinecode"
              className="aspect-square max-w-96 max-lg:mx-auto max-lg:mt-32 lg:my-auto"
            /> */}
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
