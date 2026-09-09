import { createHighlighter, type Highlighter } from 'shiki'
import atApplyInjection from '../components/syntax-highlighter/at-apply.json'
import atRulesInjection from '../components/syntax-highlighter/at-rules.json'
import darkTheme from '../components/syntax-highlighter/dark-theme.json'
import lightTheme from '../components/syntax-highlighter/light-theme.json'
import themeFnInjection from '../components/syntax-highlighter/theme-fn.json'

// Lazily initialize and cache a single shiki highlighter instance. The cached
// promise allows multiple callers to await the same initialization.
let highlighterPromise: Promise<Highlighter> | null = null

type ShikiLang = Parameters<typeof createHighlighter>[0]['langs'][number]

// Custom TextMate grammar injections. Typed loosely (they predate shiki's
// strict registration types) and cast once here rather than at each use.
const injections = [atApplyInjection, atRulesInjection, themeFnInjection] as unknown as ShikiLang[]

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [
        {
          type: 'light',
          ...lightTheme,
        },
        {
          type: 'dark',
          ...darkTheme,
        },
      ],
      langs: [
        ...injections,
        'astro',
        'blade',
        'css',
        'edge',
        'elixir',
        'hbs',
        'html',
        'js',
        'json',
        'jsx',
        'mdx',
        'sh',
        'svelte',
        'ts',
        'tsx',
        'twig',
        'vue',
        'md',
      ],
    })
  }

  return highlighterPromise
}

export async function disposeHighlighter() {
  if (!highlighterPromise) return
  try {
    const h = await highlighterPromise
    if (h && typeof h.dispose === 'function') {
      h.dispose()
    }
  } finally {
    highlighterPromise = null
  }
}
