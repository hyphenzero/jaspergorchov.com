import { Container } from '@/components/container'
import {
  Blender,
  Figma,
  Ghostty,
  Laravel,
  Nextjs,
  Paper,
  PnpmLight,
  TailwindCSS,
  TypeScript,
  Vite,
  VisualStudioCode,
  ZedLight,
} from '@ridemountainpig/svgl-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { AnimatedSignature } from '@/components/animated-signature'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Jasper Gorchov — software developer, design engineer, and 3D artist.',
}

function LogoDaVinciResolve() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-3.5">
      <path
        fill="currentColor"
        d="M17.621 0 5.977.004c-1.37 0-2.756.345-3.762 1.11a4.925 4.925 0 0 0-1.61 2.003C.233 3.93 0 5.02 0 5.951l.012 12.2c.002 1.604.479 3.057 1.461 4.112.984 1.056 2.462 1.683 4.331 1.691L16.856 24c1.26.005 3.095-.036 4.303-.714 1.075-.605 2.025-1.556 2.497-2.984.278-.84.345-2.084.344-3.147l-.021-11.13c-.002-.888-.15-2.023-.547-2.934-.425-.976-1.181-1.815-2.322-2.425C20.353.26 19.123 0 17.622 0zm0 .93c1.378 0 2.538.295 3.04.565.977.523 1.544 1.166 1.889 1.96.315.721.47 1.793.473 2.572l.018 11.13c.002 1.013-.097 2.257-.298 2.86-.396 1.202-1.146 1.946-2.063 2.462-.814.457-2.612.593-3.82.588l-11.05-.044c-1.657-.007-2.832-.534-3.626-1.386-.792-.851-1.212-2.06-1.212-3.485L.999 5.95c0-.829.196-1.827.474-2.437.345-.757.75-1.207 1.365-1.674C3.585 1.27 4.868.97 6.08.97zm-5.66 3.423c-1.976.089-3.204 1.658-3.214 3.29.019 1.443 1.635 3.481 2.884 4.53.12.099.154.109.33.18.062.025.198-.047.327-.135.36-.245.993-.947 1.648-1.738a7.67 7.67 0 0 0 1.031-1.683c.409-.89.261-1.599.235-1.888a3.983 3.983 0 0 0-.99-1.692 3.36 3.36 0 0 0-2.251-.864zm4.172 7.922a10.185 10.185 0 0 0-3.244.61c-.15.058-.26.1-.374.17-.057.036-.11.135-.105.292.017.433.29 1.278.624 2.27.384 1.135 1.066 2.27 1.844 2.74a3.23 3.23 0 0 0 2.53.342c.832-.243 1.595-.868 1.962-1.546.986-1.818.19-3.548-1.121-4.417-.447-.296-1.133-.445-1.89-.46-.074 0-.15-.002-.226-.001zm-8.432.038a6.201 6.201 0 0 0-.752.047c-.596.078-.932.273-1.29.51a3.177 3.177 0 0 0-1.365 1.979c-.075.552-.086 1.053.033 1.507.433 1.389 1.326 2.222 2.847 2.452.636.028 1.37-.063 1.99-.45 1.269-.782 2.08-3.17 2.412-4.742.053-.176.035-.357-.013-.42-.005-.067-.044-.113-.19-.183-.398-.192-1.32-.417-2.375-.6a7.68 7.68 0 0 0-1.297-.1z"
      />
    </svg>
  )
}

function LogoPixelmatorPro() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-3.5">
      <defs>
        <linearGradient id="pixelmator-about" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#pixelmator-about)" />
      <path d="M7 18l2.5-8 3.5 5.5 2.5-3.5L18 18H7z" fill="#fff" fillOpacity="0.9" />
    </svg>
  )
}

function LogoKeychron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-3.5">
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
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3.5">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#f59e0b" />
      <path d="M6 8h12v2l-4 6h-4l4-6H6V8z" fill="#fff" />
    </svg>
  )
}

// Bird-only Swift mark ( Brandt's bird, no app-icon square). Inline SVG —
// not next/image — so currentColor inherits the badge text color.
function LogoSwiftBird() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 20 110 100"
      fill="currentColor"
      className="size-3.5 text-orange-500 dark:text-orange-400"
    >
      <path d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0113.84 73a50 50 0 0010.85 6.32c15.87 7.1 31.73 6.61 42.9 0-15.9-11.66-29.4-26.82-39.46-39.2a43.47 43.47 0 01-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a271.77 271.77 0 01-27-32.34 266.8 266.8 0 0044.47 34.87c.71.38 1.26.7 1.7 1a32.7 32.7 0 001.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5z" />
    </svg>
  )
}

function LogoNeon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
      <path d="M24 0V24l-9.365-8.045V24H0V0ZM2.942 21.087h8.751V9.563l9.365 8.204V2.919L2.942 2.914Z" />
    </svg>
  )
}

const svglComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Zed: ZedLight,
  Ghostty: Ghostty,
  'VS Code': VisualStudioCode,
  Figma: Figma,
  Blender: Blender,
  Paper: Paper,
  'Next.js': Nextjs,
  'Tailwind CSS': TailwindCSS,
  TypeScript: TypeScript,
  Laravel: Laravel,
  pnpm: PnpmLight,
  Vite: Vite,
}

const manualLogos: Record<string, React.ComponentType> = {
  'DaVinci Resolve': LogoDaVinciResolve,
  'Pixelmator Pro': LogoPixelmatorPro,
  'Keychron K3 Pro': LogoKeychron,
  'Work Louder': LogoWorkLouder,
  'Work Louder Creator Micro': LogoWorkLouder,
  Swift: LogoSwiftBird,
  Neon: LogoNeon,
}

function ToolBadge({ name }: { name: string }) {
  const SvglComponent = svglComponents[name]
  const ManualLogo = manualLogos[name]

  // Fallback image logos for tools not in svgl. These must be solid fills —
  // currentColor doesn't survive next/image (it forces color: transparent on
  // the img, and SVG-as-image can't inherit the page text color). Use inline
  // SVG components above for currentColor marks instead.
  const imageLogos: Record<string, { src: string; className?: string }> = {
    'Three.js': { src: '/logos/threejs.svg', className: 'dark:invert' },
    Rust: { src: '/logos/rust.svg', className: 'dark:invert' },
  }

  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap align-baseline text-zinc-900 dark:text-zinc-100">
      <span className="inline-flex size-3.5 shrink-0 translate-y-0.5 items-center justify-center">
        {SvglComponent ? (
          <SvglComponent className="size-3.5" />
        ) : ManualLogo ? (
          <ManualLogo />
        ) : imageLogos[name] ? (
          <Image
            src={imageLogos[name].src}
            alt={name}
            width={14}
            height={14}
            className={`size-3.5 object-contain ${imageLogos[name].className ?? ''}`}
          />
        ) : null}
      </span>
      <span>{name}</span>
    </span>
  )
}

export default function AboutPage() {
  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-7xl font-semibold text-balance text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <h1 className="text-6xl tracking-tighter text-balance text-zinc-950 sm:text-7xl lg:text-8xl dark:text-white">
        About
      </h1>

      <div className="mt-16 max-w-3xl space-y-8 text-[17px]/8 text-pretty text-zinc-600 dark:text-zinc-400">
        <p>
          I&apos;m Jasper Gorchov, a software developer, design engineer, and 3D artist. I build digital products
          across the web, desktop, and mobile, and create 3D art and illustrations. My
          work spans both the technical and visual sides of projects, from interfaces and application architecture to 3D
          modeling and rendering.
        </p>

        <p>
          I work across design and engineering throughout the process, iterating on ideas until both the visual and
          technical sides feel right. <ToolBadge name="Figma" /> and <ToolBadge name="Tailwind CSS" /> are a big part
          of my process, especially for refining layout, typography, spacing, and interaction. I build with{' '}
          <ToolBadge name="TypeScript" />, <ToolBadge name="Next.js" />, <ToolBadge name="Vite" />,{' '}
          <ToolBadge name="Laravel" />, <ToolBadge name="Rust" />, GPUI, and <ToolBadge name="Swift" /> across web,
          desktop, and native applications. I work across the full stack, from interfaces and application architecture
          to databases with <ToolBadge name="Neon" />, authentication with Better Auth, realtime systems, AI, and other
          services.
        </p>

        <p>
          I&apos;ve been coding since I was 9, and that long familiarity with making things has always come with an
          attention to detail. I care about how things work, but just as much about how they look, behave, and feel in
          use.
        </p>

        <p>
          Alongside software, I create 3D work in <ToolBadge name="Blender" />, from illustrations and models to fully
          rendered scenes. I work across the full 3D process, from modeling, sculpting, and shading to texturing,
          lighting, animation, rendering, and procedural work with Geometry Nodes. When a project calls for it, I bring
          that work into the browser with <ToolBadge name="Three.js" />, using 3D as another way to build visual
          experiences rather than treating it as something separate from the rest of my work.
        </p>

        <p>
          I&apos;m interested in the space between design and engineering, where an idea becomes a functional product.
          Whether I&apos;m building a website, a native application, or an interactive 3D experience, I pay attention
          to the details throughout.
        </p>
      </div>

      <div className="mt-16 max-w-3xl">
        <AnimatedSignature />
      </div>
    </Container>
  )
}
