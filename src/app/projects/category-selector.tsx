'use client'

import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CategorySelector({
  allTags,
  selectedCategory,
}: {
  allTags: { original: string; normalized: string }[]
  selectedCategory: string
}) {
  const [category, setCategory] = useState(selectedCategory)
  const router = useRouter()

  const handleChange = (newCategory: string) => {
    const normalizedCategory = newCategory.toLowerCase()
    setCategory(normalizedCategory)
    const searchParams = new URLSearchParams()
    if (normalizedCategory !== 'all') searchParams.set('category', normalizedCategory)
    router.push(`/projects?${searchParams.toString()}`)
  }

  const unknownCategory = !allTags.some(({ normalized }) => normalized === category) && category !== 'all'

  return (
    <Listbox name="categories" value={category} onChange={handleChange} className="max-w-36">
      <ListboxOption value="all">
        <ListboxLabel>All categories</ListboxLabel>
      </ListboxOption>
      {allTags.map(({ original, normalized }) => (
        <ListboxOption key={normalized} value={normalized}>
          <ListboxLabel>{original}</ListboxLabel>
        </ListboxOption>
      ))}
      {unknownCategory && (
        <ListboxOption value={category}>
          <ListboxLabel className="capitalize">{category}</ListboxLabel>
        </ListboxOption>
      )}
    </Listbox>
  )
}
