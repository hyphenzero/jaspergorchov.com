import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { clsx } from 'clsx'
import dedent from 'dedent'
import { getHighlighter } from '../../lib/shiki'
import { highlightClasses } from './highlight-classes'
import linesToDiv from './lines-to-div'

export function js(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'js', code: dedent(strings, ...args) }
}

export function ts(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'ts', code: dedent(strings, ...args) }
}

export function jsx(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'jsx', code: dedent(strings, ...args) }
}

export function html(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'html', code: dedent(strings, ...args) }
}

export function svelte(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'svelte', code: dedent(strings, ...args) }
}

export function css(strings: TemplateStringsArray, ...args: any[]) {
  return { lang: 'css', code: dedent(strings, ...args) }
}

export async function CodeExample({
  example,
  filename,
  className = '',
}: {
  example: { lang: string; code: string }
  filename?: string
  className?: string
}) {
  return (
    <CodeExampleWrapper className={className}>
      {filename ? <CodeExampleFilename filename={filename} /> : null}
      <HighlightedCode example={example} />
    </CodeExampleWrapper>
  )
}

export function CodeExampleWrapper({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl not-in-data-stack:bg-zinc-100 not-dark:rounded-b-[calc(var(--radius-xl)+1px)] not-dark:p-px not-dark:not-has-data-filename:rounded-t-[calc(var(--radius-xl)+1px)] in-data-stack:mt-0 in-data-stack:rounded-none in-[figure]:-mx-1 in-[figure]:-mb-1 dark:not-in-data-stack:bg-zinc-900/50">
      <div className={clsx('rounded-xl text-sm in-data-stack:rounded-none', className)}>{children}</div>
    </div>
  )
}

export function CodeExampleStack({ children }: { children: React.ReactNode }) {
  return (
    <div data-stack>
      <div className="not-prose rounded-xl bg-zinc-100 *:not-has-data-filename:mt-3 not-dark:rounded-b-[calc(var(--radius-xl)+1px)] not-dark:first:not-has-data-filename:rounded-t-[calc(var(--radius-xl)+1px)] in-[figure]:mt-1 in-[figure]:rounded-b-lg in-[figure]:px-0.5 in-[figure]:pb-0.5 dark:bg-zinc-900/50">
        {children}
      </div>
    </div>
  )
}

export function CodeExampleGroup({
  filenames,
  children,
  className = '',
}: {
  filenames: string[]
  children: React.ReactNode
  className?: string
}) {
  return (
    <div>
      <TabGroup className="not-prose">
        <div className="rounded-xl bg-zinc-950 in-[figure]:-mx-1 in-[figure]:-mb-1">
          <div className={clsx('rounded-xl p-1 text-sm', className)}>
            <TabList>
              {filenames.map((filename) => (
                <Tab
                  key={filename}
                  className="hover:*:text-white/85 aria-selected:*:font-medium aria-selected:*:text-white"
                >
                  <CodeExampleFilename filename={filename} />
                </Tab>
              ))}
            </TabList>
            <TabPanels>{children}</TabPanels>
          </div>
        </div>
      </TabGroup>
    </div>
  )
}

export function CodeBlock({ example }: { example: { lang: string; code: string } }) {
  return (
    <TabPanel>
      <HighlightedCode example={example} />
    </TabPanel>
  )
}

export function HighlightedCode({
  example,
  className,
}: {
  example: { lang: string; code: string }
  className?: string
}) {
  return (
    <RawHighlightedCode
      example={example}
      className={clsx(
        '*:flex *:*:max-w-none *:*:shrink-0 *:*:grow *:overflow-auto *:rounded-xl *:border-white/5 *:bg-white! *:p-5 *:ring *:ring-zinc-950/5 not-dark:*:shadow-sm dark:*:border-t dark:*:bg-zinc-900!',
        '**:[.line]:isolate **:[.line]:not-last:min-h-lh',
        className
      )}
    />
  )
}

export async function RawHighlightedCode({
  example,
  className,
}: {
  example: { lang: string; code: string }
  className?: string
}) {
  let codeWithoutPrettierIgnore = example.code
    .split('\n')
    .filter((line) => !line.includes('prettier-ignore'))
    .join('\n')

  const highlighter = await getHighlighter()

  let code = highlighter
    .codeToHtml(codeWithoutPrettierIgnore, {
      lang: example.lang,
      themes: {
        light: 'theme-light',
        dark: 'theme-dark',
      },
      transformers: [
        transformerNotationHighlight({
          classActiveLine: '-mx-5 pl-[calc(var(--spacing)*5-2px)] border-l-2 pr-5 border-sky-400 bg-sky-300/15 z-10',
        }),
        transformerNotationDiff({
          classLineAdd:
            "relative -mx-5 border-l-2 border-teal-400 bg-teal-300/15 pr-5 pl-8 before:absolute before:left-4 before:text-teal-400 before:content-['+']",
          classLineRemove:
            "relative -mx-5 border-l-2 border-red-400 bg-red-300/15 pr-5 pl-8 before:absolute before:left-4 before:text-red-400 before:content-['-']",
          classActivePre: '[:where(&_.line)]:pl-4',
        }),
        transformerNotationWordHighlight({
          classActiveWord:
            'highlighted-word relative before:absolute before:-inset-x-0.5 before:-inset-y-0.25 before:-z-10 before:block before:rounded-sm before:bg-indigo-600/13 dark:before:bg-[lab(19.93_-1.66_-9.7)] [.highlighted-word_+_&]:before:rounded-l-none',
        }),
        highlightClasses({
          highlightedClassName:
            'highlighted-word relative before:absolute before:-inset-x-0.5 before:-inset-y-0.25 before:-z-10 before:block before:rounded-sm before:bg-indigo-600/13 dark:before:bg-[lab(19.93_-1.66_-9.7)] [.highlighted-word_+_&]:before:rounded-l-none',
        }),
        linesToDiv(),
      ],
    })
    .replaceAll('\n', '')

  return <div className={className} dangerouslySetInnerHTML={{ __html: code }} />
}

function CodeExampleFilename({ filename }: { filename: string }) {
  return (
    <div data-filename className="px-3 py-1.5 text-xs/5 text-zinc-500 dark:text-zinc-400">
      {filename}
    </div>
  )
}
