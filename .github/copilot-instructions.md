## Repo snapshot for AI coding agents

This Next.js project (Next 15 + React 19) is a content-driven personal site. Key facts:

- Framework: Next.js (app router), MDX pages under `src/app/blog` and `src/app/projects`.
- Package manager: pnpm (see `package.json` -> `packageManager`). Use `pnpm dev` / `pnpm build` etc.
- Styling: TailwindCSS v4 + Prettier with Tailwind plugin. Styles live in `src/app/globals.css`.

## High-level architecture and important files

- `next.config.ts` - MDX integration and output tracing. Page extensions include `mdx` and experimental `mdxRs: true`. If you add new MDX folders that are dynamically imported, update `outputFileTracingIncludes`.
- `src/lib/content.ts` - central canonical loader for MDX content. Important behaviors:
  - Loads MDX modules dynamically via `import(`../app/blog/${slug}/index.mdx`)` and `import(`../app/projects/${slug}/index.mdx`).`
  - `isValidSlug` enforces filesystem-safe slugs: /^[a-zA-Z0-9_-]+$/. New MDX slugs must match this pattern.
  - Normalizes frontmatter (dates, images). Callers expect `meta.date` to be normalized (projects prefer `releaseDate`).
- `src/types/post.ts` - canonical shapes: `BlogPost`, `Project`, and `SerializableProject`. Use these types when returning content to client components.
- `src/lib/shiki.ts` - server-side shiki highlighter helper. Lazy-caches a single highlighter instance; dispose carefully in tests.
- `src/components/*` - many components are split into server vs client. Look for `'use client'` at the top of files (e.g., `src/components/home/recent-projects.tsx`) to identify client components.

## Content / MDX rules (practical examples)

- File location: create a project at `src/app/projects/<slug>/index.mdx`. The loader expects `index.mdx` inside a folder named by the slug.
- Frontmatter: prefer `releaseDate` for projects; `content.ts` normalizes `date = releaseDate ?? date`. Supported image shapes: string paths or imported image objects; `normalizeImage` will convert them to `{ src: string }`.
- Slug constraints: use only characters allowed by `isValidSlug`. If a page fails to load, `getProjectBySlug`/`getBlogPostBySlug` return `null` and log to console.

## Developer workflows & commands

- Local dev: `pnpm dev`
- Build: `pnpm build` -> `next build`.
- Lint/format: `pnpm lint`, `pnpm format` (Prettier + plugins configured in `package.json`).

## Patterns to follow when editing code

- Prefer the data-layer helpers in `src/lib/*` for content and formatting helpers (e.g., `formatDate` in `src/lib/api-utils.ts`).
- Respect server/client boundaries. Server-only utilities (file system, shiki) live in `src/lib/*` and should be used from server components or server functions. Client components import serializable data only (see `SerializableProject`).
- Dynamic imports of MDX are used to keep content colocated. Don't change import paths without updating `next.config.ts` output tracing if necessary.

## Why things are structured this way (concise reasoning)

- MDX files live under `src/app/*` to leverage Next.js routing and layouts while enabling per-page content components.
- Dynamic imports + output tracing keep serverless bundles small and avoid including all MDX content in every build output.

## Quick examples to reference when implementing changes

- Safe slug check: `src/lib/content.ts` -> `isValidSlug` (must match /^[a-zA-Z0-9_-]+$/)
- Normalized project loading: `getProjectBySlug` → returns `{ Component, meta, slug }` or `null`.
- Client carousel: `src/components/home/recent-projects.tsx` is a `'use client'` component using Motion + `useScroll` and expects `SerializableProject[]`.

If anything here is unclear or you want more examples (tests, CI, or deploy details), tell me which area to expand and I will iterate.
