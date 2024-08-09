import { type MDXComponents as MDXComponentsType } from 'mdx/types'

import { MDXComponents } from '@/components/mdx-components'

export function useMDXComponents(components: MDXComponentsType) {
  return {
    ...components,
    ...MDXComponents,
  }
}
