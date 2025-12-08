import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { CodeExample } from './components/markdown/code-example'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/table'

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (React.isValidElement(node)) {
    if (node.type === 'small') {
      return ''
    }

    // Dive into element children to extract text for slug generation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return getTextContent(node.props.children)
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  return '' // If the node is neither text nor a React element
}

function slugify(str: React.ReactNode) {
  return getTextContent(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return ({ children }: React.PropsWithChildren) => {
    let slug = slugify(children)
    return React.createElement(`h${level}`, { id: slug }, [
      React.createElement(
        'a',
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        },
        children
      ),
    ])
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),

    a(props: any) {
      // Use the project's Link for internal navigation; external links open in a new tab.
      const { href } = props || {}

      function isExternal(href?: string) {
        if (!href || typeof href !== 'string') return false
        if (href.startsWith('#') || href.startsWith('/')) return false
        if (href.startsWith('//')) return true
        try {
          const url = new URL(href)
          const host = url.hostname
          if (host === 'localhost') return false
          if (host === 'jaspergorchov.com') return false
          if (host.endsWith('.jaspergorchov.com')) return false
          return url.protocol === 'http:' || url.protocol === 'https:'
        } catch {
          return false
        }
      }

      if (isExternal(href)) {
        const { children, ...rest } = props

        return (
          <Link
            {...rest}
            href={href}
            className="fill-(--prose-link-icon-bg-color) stroke-(--prose-link-icon-color) pr-4 transition-colors hover:fill-(--prose-link-icon-bg-hover-color) hover:stroke-(--prose-link-icon-hover-color)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{children}</span>
            <svg viewBox="0 0 12 12" aria-hidden="true" className="absolute ml-1 inline-block size-3 -translate-y-3.5">
              <rect width="12" height="12" strokeWidth="0" rx="3" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m3.75 8.25 4.5-4.5m0 0h-3.5m3.5 0v3.5"
              />
            </svg>
          </Link>
        )
      }

      return <Link {...props} />
    },

    table: (props) => <Table className="not-prose" {...props} />,
    thead: TableHead,
    tbody: TableBody,
    tr: TableRow,
    th: TableHeader,
    td: TableCell,

    code({ children }: { children: string | ReactNode }) {
      if (typeof children !== 'string') {
        return <code>{children}</code>
      }

      if (children.startsWith('<')) {
        return <code>{children}</code>
      }

      return (
        <code>
          {children
            .split(/(<[^>]+>)/g)
            .map((part, i) => (part.startsWith('<') && part.endsWith('>') ? <var key={i}>{part}</var> : part))}
        </code>
      )
    },

    pre(props) {
      let child = React.Children.only(props.children) as React.ReactElement<{
        className?: string
        children?: string
      }>
      if (!child) return null

      let { className, children: code } = child.props as { className?: string; children?: string }
      if (typeof code !== 'string') code = String(code ?? '')
      let lang = className ? className.replace('language-', '') : ''
      let filename = undefined

      // Extract optional filename directives from the first line of a code block
      let lines = code.split('\n')
      let filenameRegex = /\[\!code filename\:(.+)\]/
      let match = lines[0].match(filenameRegex)
      if (match) {
        filename = match[1]
        code = lines.splice(1).join('\n')
      }

      return (
        <div>
          <CodeExample example={{ lang, code }} className="not-prose" filename={filename} />
        </div>
      )
    },
  }
}
