import nextMDX from '@next/mdx'
import rehypeShiki from '@shikijs/rehype'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { Parser } from 'acorn'
import jsx from 'acorn-jsx'
import escapeStringRegexp from 'escape-string-regexp'
import { readFileSync } from 'fs'
import * as path from 'path'
import { recmaImportImages } from 'recma-import-images'
import remarkGfm from 'remark-gfm'
import { remarkRehypeWrap } from 'remark-rehype-wrap'
import remarkUnwrapImages from 'remark-unwrap-images'
import { unifiedConditional } from 'unified-conditional'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

function remarkMDXLayout(source, metaName) {
  let parser = Parser.extend(jsx())
  let parseOptions = { ecmaVersion: 'latest', sourceType: 'module' }

  return (tree) => {
    let imp = `import _Layout from '${source}'`
    let exp = `export default function Layout(props) {
      return <_Layout {...props} ${metaName}={${metaName}} />
    }`

    tree.children.push(
      {
        type: 'mdxjsEsm',
        value: imp,
        data: { estree: parser.parse(imp, parseOptions) },
      },
      {
        type: 'mdxjsEsm',
        value: exp,
        data: { estree: parser.parse(exp, parseOptions) },
      }
    )
  }
}

function extractTextTokens(node) {
  let texts = []
  if (node.type === 'text') {
    texts.push(node.value)
  } else if (node.type === 'element' && node.children) {
    node.children.forEach((child) => {
      texts = texts.concat(extractTextTokens(child))
    })
  }
  return texts
}

const diffTransformer = {
  code(node) {
    console.log('Processing node', node)
    if (node.children) {
      node.children.forEach((line, lineIndex) => {
        console.log(`Processing line ${lineIndex}`, line)
        if (line.children) {
          //  Recursively concatenate text tokens to get the full line content
          const fullLineContent = extractTextTokens(line).join('')
          console.log(`Full line content for line ${lineIndex}:`, fullLineContent)

          // Determine if the line is marked for insertion or deletion
          const isInsertion = fullLineContent.includes('// ins')
          const isDeletion = fullLineContent.includes('// del')
          console.log(`Line ${lineIndex} isInsertion:`, isInsertion, 'isDeletion:', isDeletion)

          if (isInsertion || isDeletion) {
            let marker = null

            const insertedMarker = {
              type: 'element',
              tagName: 'span',
              properties: {
                className:
                  'before:content-[&quot;+&quot;] absolute inset-x-0 flex select-none border-l-2 border-teal-400/75 bg-teal-400/[0.15] pl-3 before:text-teal-400',
              },
              children: [],
            }

            const deletedMarker = {
              type: 'element',
              tagName: 'span',
              properties: {
                className:
                  'before:content-[&quot;-&quot;] absolute inset-x-0 flex select-none border-l-2 border-rose-400/75 bg-rose-500/[0.15] pl-3 before:text-rose-400',
              },
              children: [],
            }

            // Step 3: Insert the appropriate marker based on the line content
            marker = isDeletion ? deletedMarker : isInsertion ? insertedMarker : null
            console.log(`Marker selected for line ${lineIndex}:`, marker)

            if (marker) {
              // Insert the marker as a new node before the current line
              node.children.splice(lineIndex, 0, marker)
              console.log(`Marker inserted before line ${lineIndex}`)
            }

            // Step 4: Modify tokens to remove "// ins" or "// del" comments
            line.children = line.children.map((token) => {
              if (token.type === 'text') {
                token.value = token.value.replace('// ins', '').replace('// del', '').trim()
              }
              return token
            })
            console.log(`Line ${lineIndex} tokens after modification:`, line.children)
          }
        }
      })
    }
  },
}

export default async function config() {
  const lightTheme = JSON.parse(readFileSync('./src/markdown/light-theme.json', 'utf8'))
  const darkTheme = JSON.parse(readFileSync('./src/markdown/dark-theme.json', 'utf8'))

  let withMDX = nextMDX({
    extension: /\.mdx$/,
    options: {
      recmaPlugins: [recmaImportImages],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              light: lightTheme,
              dark: darkTheme,
            },
            transformers: [transformerNotationDiff(), transformerNotationHighlight()],
          },
        ],
        [
          remarkRehypeWrap,
          {
            node: { type: 'mdxJsxFlowElement', name: 'Typography' },
            start: ':root > :not(mdxJsxFlowElement)',
            end: ':root > mdxJsxFlowElement',
          },
        ],
      ],
      remarkPlugins: [
        remarkGfm,
        remarkUnwrapImages,
        [
          unifiedConditional,
          [
            new RegExp(`^${escapeStringRegexp(path.resolve('src/app/blog'))}`),
            [[remarkMDXLayout, '@/app/blog/wrapper', 'article']],
          ],
          [
            new RegExp(`^${escapeStringRegexp(path.resolve('src/app/work'))}`),
            [[remarkMDXLayout, '@/app/work/wrapper', 'project']],
          ],
        ],
      ],
    },
  })

  return withMDX(nextConfig)
}
