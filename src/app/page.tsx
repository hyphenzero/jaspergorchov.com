import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { NavbarDivider } from '@/components/navbar'
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/social-icons'
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="size-6 text-zinc-500 transition duration-100 group-hover:text-sky-400 sm:size-5" />
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <main>
        <Container as={FadeInStagger} className="py-16 lg:py-24">
          <FadeIn>
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-[length:clamp(2rem,3.75vw,3rem)] dark:text-white">
              I’m Jasper Gorchov, a 13-year-old developer, designer, and digital artist.
            </h1>
          </FadeIn>
          <FadeIn>
            <div className="mt-10 items-center gap-x-6 sm:flex">
              <div className="flex items-center gap-x-6">
                <Button color="sky">Browse work</Button>
                <Button plain>
                  <PlayIcon />
                  Watch the video
                </Button>
              </div>
              <div className="flex items-center gap-x-6 max-sm:mt-10">
                <NavbarDivider className="max-sm:hidden" />
                <SocialLink href="#" aria-label="Follow on GitHub" icon={GitHubIcon} />
                {/* <Button plain href="#" aria-label="Follow on GitHub"><GitHubIcon /></Button> */}
                <SocialLink href="#" aria-label="Follow on X" icon={XIcon} />
                {/* <Button plain href="#" aria-label="Follow on X"><XIcon /></Button> */}
                <SocialLink href="#" aria-label="Follow on Instagram" icon={InstagramIcon} />
                {/* <Button plain href="#" aria-label="Follow on Instagram"><InstagramIcon /></Button> */}
                <SocialLink href="#" aria-label="Follow on Behance" icon={LinkedInIcon} />
                {/* <Button plain href="#" aria-label="Follow on Behance"><LinkedInIcon /></Button> */}
              </div>
            </div>
          </FadeIn>
        </Container>

        <Container className="pb-24 sm:pb-[96rem]">
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl">
              <div className="absolute inset-0 z-10 rounded-xl bg-zinc-100 shadow ring-1 ring-inset ring-slate-900/10 dark:bg-zinc-900 dark:ring-white/10" />
              {/* <Image alt="" priority fill src={workImage} className="-inset-px object-cover" unoptimized /> */}
            </div>
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <div className="absolute inset-0 z-10 rounded-xl shadow ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              {/* <Image alt="" priority fill src={workImage} className="-inset-px object-cover" unoptimized /> */}
            </div>
            <div className="relative isolate aspect-video w-full overflow-clip rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <div className="absolute inset-0 z-10 rounded-xl shadow ring-1 ring-inset ring-slate-900/10 dark:ring-white/10" />
              {/* <Image alt="" priority fill src={workImage} className="-inset-px object-cover" unoptimized /> */}
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
