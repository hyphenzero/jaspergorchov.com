import React, { useState } from "react"
import ReactCardFlip from "react-card-flip"

const CardFlip = () => {
	const [isFlipped, setIsFlipped] = useState(false)

	const handleFlip = () => {
		setIsFlipped(!isFlipped)
	}

	return (
		<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
			<div key="front" onClick={handleFlip}>
				<img src="/card-front.png" alt="Front" />
			</div>
			<div key="back" onClick={handleFlip}>
				<img src="/card-back.png" alt="Back" />
			</div>
		</ReactCardFlip>
	)
}

export default CardFlip
