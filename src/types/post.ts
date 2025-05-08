import type React from 'react'

export interface Post {
  Component: React.FC
  meta: {
    title: string
    date: string
    excerpt: React.ReactElement
    tags: string[]
    description: string
    image?: {
      src: string
    }
    private?: boolean
  }
  slug: string
}
