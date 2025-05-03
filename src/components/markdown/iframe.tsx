'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const css = String.raw

export function Iframe({ children, ...props }: React.ComponentProps<'iframe'>) {
  let [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  // Ensure all <link rel="stylesheet"> elements are cloned inside the iframe
  let ref = (element: HTMLIFrameElement) => {
    if (!element) {
      return
    }

    let innerDocument = element.contentWindow?.document
    if (!innerDocument) {
      return
    }
    let mountNode = innerDocument.body

    const styles = document.querySelectorAll('link[rel=stylesheet]')
    for (const style of styles) {
      const clone = style.cloneNode(true)
      innerDocument.head.appendChild(clone)
    }

    let iframeStyles = innerDocument.createElement('style')
    iframeStyles.innerHTML = css`
      html,
      body {
        background-color: transparent;
      }
    `
    mountNode.appendChild(iframeStyles)

    setMountNode(mountNode)
  }

  return (
    // @ts-expect-error
    <iframe {...props} ref={ref} allowtransparency="true">
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}
