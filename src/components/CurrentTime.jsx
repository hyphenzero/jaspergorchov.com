'use client'

import { useEffect, useState } from 'react'

export function CurrentTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Los_Angeles',
        }),
      )
    }

    updateTime()

    const interval = setInterval(updateTime, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {time} <span className="text-neutral-600">(UTC -07:00)</span>
    </>
  )
}
