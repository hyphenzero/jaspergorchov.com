import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { NavbarDivider } from '@/components/navbar'
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/social-icons'
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { SocialMedia } from '@/components/social-media'
import { Card } from '@/components/card'
import Image from 'next/image'
import workImage from '@/images/work.png'

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="size-6 text-zinc-500 group-hover:text-zinc-700 dark:hover:text-zinc-300 sm:size-5" />
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <main>
        <Container as={FadeIn} className="py-16 lg:py-24">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-[length:clamp(2rem,3.75vw,3rem)] dark:text-white">
              I’m Jasper Gorchov, a 13-year-old creative developer and digital artist.
            </h1>
            <div className="mt-6 items-center gap-x-6 sm:flex">
              <div className="flex items-center gap-x-6">
                <Button>Browse work</Button>
                <Button plain>
                  <PlayIcon />
                  Watch the video
                </Button>
              </div>
              <div className="flex items-center gap-x-6 max-sm:mt-10">
                <NavbarDivider className="mr-2 max-sm:hidden" />
                <SocialMedia />
              </div>
            </div>
        </Container>

        <Container className="pb-24 sm:pb-[96rem]">
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-clip rounded-xl aspect-video">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image
								fill
								className="aspect-video w-full object-cover"
								alt=""
								src={workImage}
							/>
            </div>
            <div className="relative overflow-clip rounded-xl aspect-video">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image
								fill
								className="aspect-video w-full object-cover"
								alt=""
								src={workImage}
							/>
            </div>
						<div className="relative overflow-clip rounded-xl aspect-video">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              <Image
								fill
								className="aspect-video w-full object-cover"
								alt=""
								src={workImage}
							/>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button plain className="-translate-x-3">
              More work <ArrowUpRightIcon />
            </Button>
            <div className="flex items-center gap-4">
              <Button
                color="light"
                aria-label="Previous"
                className="!rounded-full before:!rounded-full after:!rounded-full"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                color="light"
                aria-label="Next"
                className="!rounded-full before:!rounded-full after:!rounded-full"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </Container>

        {/* <Container className="py-24 sm:py-32">
          <div className="flex-col">
            <p className="font-mono text-sm/5 uppercase tracking-widest text-zinc-500">Work</p>
            <div className="mt-2 flex items-end justify-between">
              <h2 className="font-display text-4xl font-medium text-zinc-950 dark:text-white">Featured projects</h2>
              <Button plain>
                See all <ArrowRightIcon />
              </Button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-[44px] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container> */}
      </main>
    </>
  )
}
