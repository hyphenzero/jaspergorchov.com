import glob from 'fast-glob'

const exportNames = {
	work: 'project',
	playground: 'experiment',
}

export async function loadMDXMetadata(directory) {
  return (
    await Promise.all(
      (await glob('**/page.mdx', { cwd: `src/app/${directory}` })).map(
        async (filename) => {
          let id = filename.replace(/\/page\.mdx$/, '')
          return {
            id,
            href: `/${directory}/${id}`,
            ...(await import(`../app/${directory}/${filename}`))[
              exportNames[directory]
            ],
          }
        },
      ),
    )
  ).sort((a, b) => b.date.localeCompare(a.date))
}
