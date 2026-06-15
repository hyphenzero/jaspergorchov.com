import type { Metadata } from 'next'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, software, and gear I use daily.',
}

const categories = [
  {
    title: 'Editor & Terminal',
    items: [
      {
        name: 'Neovim',
        description:
          'My daily driver for almost everything — configured with Lua, LazyVim, and a growing collection of plugins.',
      },
      {
        name: 'Zed',
        description:
          'A fast, collaborative code editor I reach for when I want something that just works out of the box.',
      },
      { name: 'Warp', description: 'A Rust-based terminal with AI-powered search and modern features.' },
      { name: 'tmux', description: 'Session management and multiplexing for long-running terminal workflows.' },
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
    ],
  },
  {
    title: 'Hardware',
    items: [
      {
        name: 'MacBook Pro 14" (M3 Pro)',
        description: 'My primary machine — portable enough to carry everywhere, powerful enough for 3D work.',
      },
      {
        name: 'Keychron Q1 Pro',
        description: 'Custom mechanical keyboard with Gateron Jupiter switches, lubed and tuned.',
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Ergonomic mouse with a silent scroll wheel and customizable gestures.',
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

      <div className="mt-24 space-y-20">
        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="font-mono font-semibold text-sky-500 text-sm uppercase tracking-widest dark:text-sky-400">
              {category.title}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {category.items.map((item) => (
                <div key={item.name} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <h3 className="font-medium text-zinc-950 dark:text-white">{item.name}</h3>
                  <p className="mt-2 text-sm/6 text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  )
}
