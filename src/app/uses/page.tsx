import type { Metadata } from 'next'
import { Container } from '@/components/container'
import {
  Blender,
  Figma,
  Ghostty,
  Nextjs,
  PnpmLight,
  TailwindCSS,
  TypeScript,
  VisualStudioCode,
  ZedLight,
} from '@ridemountainpig/svgl-react'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, software, and gear I use daily.',
}

const categories = [
  {
    title: 'Editor & Terminal',
    items: [
      {
        name: 'VS Code',
        description: 'Still installed for when I need something Zed can\'t do — extensions, debugging configs, or pair programming.',
      },
      { name: 'Zed', description: 'What I reach for first: fast, focused, and collaborative.' },
      { name: 'Ghostty', description: 'A fast, GPU-accelerated terminal emulator with native UI.' },
    ],
  },
  {
    title: 'Design & 3D',
    items: [
      { name: 'Figma', description: 'My go-to for UI/UX design, prototyping, and collaborating on design systems.' },
      { name: 'Blender', description: 'Open-source 3D creation suite for modeling, sculpting, and rendering.' },
      {
        name: 'DaVinci Resolve',
        description: 'Professional video editing and color grading for project walkthroughs.',
      },
      {
        name: 'Pixelmator Pro',
        description: 'Image editing and compositing for quick mockups and asset preparation.',
      },
    ],
  },
  {
    title: 'Hardware',
    items: [
      {
        name: 'Keychron K3 Pro',
        description: 'Low-profile mechanical keyboard with Gateron red switches and south-facing RGB backlighting.',
      },
      {
        name: 'Work Louder Creator Micro',
        description: 'Programmable macro pad with RGB backlighting for shortcuts and creative workflows.',
      },
    ],
  },
  {
    title: 'Stack & Tools',
    items: [
      {
        name: 'Next.js',
        description: 'React framework for production-grade web apps with SSR, ISR, and the App Router.',
      },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid, consistent UI development.' },
      {
        name: 'TypeScript',
        description: 'Typed JavaScript for better tooling, refactoring, and developer experience.',
      },
      { name: 'pnpm', description: 'Fast, disk-space-efficient package manager.' },
    ],
  },
]

function LogoDaVinciResolve() {
  return (
    <svg className="p-px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0zm0 .93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97zm-5.66 3.423c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864zm4.172 7.922a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001zm-8.432.038a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z" />
    </svg>
  )
}

function LogoPixelmatorPro() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-9">
      <defs>
        <linearGradient id="pixelmator" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#pixelmator)" />
      <path d="M7 18l2.5-8 3.5 5.5 2.5-3.5L18 18H7z" fill="#fff" fillOpacity="0.9" />
    </svg>
  )
}

function LogoKeychron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g fill="currentColor" stroke="none">
        <g>
          <path d="M11.118 18.512H9.405V5.259h1.713Z"></path>
          <path d="M6.005 5.243h8.712v1.714H6.005Z"></path>
          <path d="m10.66 15.682-1.213-1.213 6.438-6.42h2.426Z"></path>
          <path d="m12.203 12.945 1.299-1.123 5.595 6.707-2.418.004Z"></path>
        </g>
        <path d="M12.3 22.2C6.676 22.2 2.1 17.625 2.1 12S6.677 1.8 12.3 1.8c4.234 0 7.873 2.595 9.414 6.277h1.915C21.998 3.384 17.54 0 12.3 0 5.683 0 .3 5.383.3 12c0 6.618 5.383 12 12 12 5.264 0 9.738-3.412 11.35-8.138h-1.914C20.21 19.577 16.557 22.2 12.3 22.2"></path>
      </g>
    </svg>
  )
}

function LogoWorkLouder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-9">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#f59e0b" />
      <path d="M6 8h12v2l-4 6h-4l4-6H6V8z" fill="#fff" />
    </svg>
  )
}

const svglComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Zed: ZedLight,
  Ghostty: Ghostty,
  'VS Code': VisualStudioCode,
  Figma: Figma,
  Blender: Blender,
  'Next.js': Nextjs,
  'Tailwind CSS': TailwindCSS,
  TypeScript: TypeScript,
  pnpm: PnpmLight,
}

const manualLogos: Record<string, React.ComponentType> = {
  'DaVinci Resolve': LogoDaVinciResolve,
  'Pixelmator Pro': LogoPixelmatorPro,
  'Keychron K3 Pro': LogoKeychron,
}

function SplitList() {
  return (
    <div className="mt-24 space-y-16">
      {categories.map((category) => (
        <section key={category.title} className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-3">
            <h2 className="font-medium text-zinc-950 text-xl tracking-tight dark:text-white">
              {category.title}
            </h2>
          </div>
          <div className="sm:col-span-9">
            <div className="divide-y divide-zinc-950/10 dark:divide-white/10">
              {category.items.map((item) => {
                const SvglComponent = svglComponents[item.name]
                const ManualLogo = manualLogos[item.name]
                return (
                  <div key={item.name} className="flex items-center gap-6 py-3 first:pt-0 last:pb-0">
                    <div className="shrink-0 size-7 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      {SvglComponent && <SvglComponent className="size-7 p-px" />}
                      {ManualLogo && !SvglComponent && <ManualLogo />}
                    </div>
                    <div className="min-w-0 flex items-baseline gap-6">
                      <h3 className="font-medium text-zinc-950 text-sm dark:text-white">{item.name}</h3>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default function UsesPage() {
  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-balance font-semibold text-7xl text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <h1 className="text-balance text-6xl text-zinc-950 tracking-tighter sm:text-7xl lg:text-8xl dark:text-white">
        Uses
      </h1>
      <p className="mt-8 max-w-2xl text-pretty font-medium text-lg/9 text-zinc-600 dark:text-zinc-400">
        A curated list of the tools, software, and gear I use to get things done.
      </p>

      <SplitList />
    </Container>
  )
}
