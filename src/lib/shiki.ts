import { createHighlighter } from 'shiki'
import darkTheme from '../components/syntax-highlighter/dark-theme.json'
import lightTheme from '../components/syntax-highlighter/light-theme.json'

import atApplyInjection from '../components/syntax-highlighter/at-apply.json'
import atRulesInjection from '../components/syntax-highlighter/at-rules.json'
import themeFnInjection from '../components/syntax-highlighter/theme-fn.json'

// Lazily initialize and cache a single shiki highlighter instance. The cached
// promise allows multiple callers to await the same initialization.
let highlighterPromise: Promise<any> | null = null

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
        atApplyInjection as any,
        atRulesInjection,
        themeFnInjection,
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
