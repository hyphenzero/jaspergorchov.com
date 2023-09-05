'use client'

import { useEffect, useState } from 'react'

export function Time() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(
      new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles',
      }),
    )
  }, [])

  return (
    <>
      {time} <span className="text-neutral-600">(UTC -07:00)</span>
    </>
  )
}
