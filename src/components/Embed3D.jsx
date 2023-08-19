'use client'

import { useState } from 'react'

import clsx from 'clsx'
import Spline from '@splinetool/react-spline'

import { Button } from './Button'

export function Embed3D({ scene, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadClick = () => {
    setIsLoaded(true)
  }

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (
        <div className="mx-auto flex h-full w-screen max-w-3xl items-center justify-center max-sm:w-[calc(100vw-3rem)]">
          <Button onClick={handleLoadClick}>Load 3D content</Button>
        </div>
      )}
      {isLoaded && (
        <Spline
          scene={scene}
          className={clsx('!block', className)}
          {...props}
        />
      )}
    </div>
  )
}
