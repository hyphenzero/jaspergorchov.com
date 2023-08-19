import { FadeIn } from './FadeIn'

export function Window({ fadeIn, background, children }) {
  const window = (
    <div className="relative flex aspect-video max-w-3xl flex-col items-center justify-center overflow-clip rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl backdrop-blur-[2px]">
      <div className="absolute top-0 z-50 flex w-full space-x-1.5 border-b border-neutral-800 bg-neutral-925 p-2 sm:space-x-2 sm:p-3">
        <div className="aspect-square w-2 rounded-full bg-red-400 sm:w-3" />
        <div className="aspect-square w-2 rounded-full bg-yellow-400 sm:w-3" />
        <div className="aspect-square w-2 rounded-full bg-green-400 sm:w-3" />
      </div>
      {children}
    </div>
  )

  return (
    <>
      {fadeIn ? (
        <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center">
          {background}
          <FadeIn>{window}</FadeIn>
        </div>
      ) : (
        window
      )}
    </>
  )
}
