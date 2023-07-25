import { Fragment } from "react"

import { FadeIn } from "./FadeIn"

export function SectionHeader({ text, number, post }) {
  // const applyAltFont = (text) => {
  //   const characters = text.split('')
  //   const totalCharacters = characters.length
  //   const charactersWithAltFont = Math.floor(totalCharacters * 0.25)

  //   const AltFontIndexes = []
  //   while (AltFontIndexes.length < charactersWithAltFont) {
  //     const randomIndex = Math.floor(Math.random() * totalCharacters)
  //     if (!AltFontIndexes.includes(randomIndex)) {
  //       AltFontIndexes.push(randomIndex)
  //     }
  //   }

  //   for (let i = 0; i < charactersWithAltFont; i++) {
  //     characters[AltFontIndexes[i]] = (
  //       <span key={AltFontIndexes[i]} className="font-grid">
  //         {characters[AltFontIndexes[i]]}
  //       </span>
  //     )
  //   }

  //   return characters
  // }

	return (
		<div className="flex-col px-5 sm:px-8 max-w-7xl mx-auto mt-10 py-20 sm:mt-20 sm:py-32 lg:mt-30">
			<FadeIn className="max-sm:space-y-12">
				<div className="text-neutral-400 text-center sm:text-left text-xs">({number})</div>
				<div className="sm:indent-[10rem] lg:indent-[16rem] font-display text-center font-light text-4xl/[2.5rem] tracking-tight text-neutral-200 [text-wrap:balance] sm:text-[4rem]/[4.5rem] space-y-24 lg:space-y-40">
					{text}
				</div>
				<div className="text-neutral-400 max-sm:hidden sm:mt-12 text-center sm:text-right text-xs">{post}</div>
			</FadeIn>
		</div>
  )
}
