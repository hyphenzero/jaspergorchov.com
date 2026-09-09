export default function Home() {
  return (
    <>
      <div className="mx-auto mt-12 max-w-304 px-6 sm:mt-20 lg:mt-24 lg:px-8">
        <div className="flex max-md:flex-col max-md:space-y-6 md:items-end md:justify-between">
          <h1 className="flex-1 pr-6 text-5xl font-medium tracking-tight text-pretty text-zinc-900 sm:text-6xl lg:text-[5rem] dark:text-white">
            Jasper Gorchov
          </h1>
          <p className="w-fit text-[1.75rem]/[1.14] font-medium text-zinc-900 md:pb-0.5 lg:pb-1 dark:text-white">
            14-year-old <br /> creative developer
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[107rem] px-6 lg:px-8">
        <div className="aspect-video w-full rounded-4xl bg-zinc-200 dark:bg-zinc-900" />
      </div>

      <div className="mx-auto mt-12 max-w-304 px-6 sm:mt-20 lg:mt-24 lg:px-8">
        <p className="font-mono text-[0.8125rem]/6 font-semibold tracking-widest text-pretty text-sky-500 uppercase">
          Projects
        </p>
        <h2 className="max-w-3xl text-3xl font-medium tracking-tight text-pretty md:text-[2.5rem]/14">
          Creating high-quality websites, web apps, and 3D illustrations.
        </h2>
      </div>
    </>
  )
}
