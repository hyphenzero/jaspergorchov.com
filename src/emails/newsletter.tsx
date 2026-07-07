import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from 'react-email'
import { formatDate } from '@/lib/api-utils'

interface DigestEntry {
  title: string
  summary: string
  postUrl: string
  type: 'blog' | 'project'
  date: string
  tag: string
  image?: { src: string; width?: number; height?: number }
  imageDark?: { src: string; width?: number; height?: number }
}

interface NewsletterDigestProps {
  siteUrl: string
  entries: DigestEntry[]
}

export function NewsletterDigest({ siteUrl, entries }: NewsletterDigestProps) {
  const totalCount = entries.length
  const blogEntries = entries.filter((e) => e.type === 'blog')
  const projectEntries = entries.filter((e) => e.type === 'project')
  const blogCount = blogEntries.length
  const projectCount = projectEntries.length
  const contentLabel = describeContent(blogCount, projectCount)

  const preview = `A new dispatch from Jasper: ${contentLabel}.`

  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              fontFamily: {
                sans: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: [
                  '"IBM Plex Mono"',
                  'ui-monospace',
                  'SFMono-Regular',
                  'Menlo',
                  'Monaco',
                  '"Roboto Mono"',
                  '"Segoe UI Mono"',
                  'monospace',
                ],
              },
            },
          },
        }}
      >
        <Head>
          <style>
            {`
              :root {
                --email-bg: #fff;
                --text-body: #09090b;
                --text-secondary: #52525b;
                --text-muted: #a1a1aa;
                --text-link: #0ea5e9;
                --border-default: #e4e4e7;
              }
              .bg-default { background-color: var(--email-bg); }
              .text-body { color: var(--text-body); }
              .text-secondary { color: var(--text-secondary); }
              .text-muted { color: var(--text-muted); }
              .text-link { color: var(--text-link); }
              .border-default { border-color: var(--border-default); }
              @media (prefers-color-scheme: dark) {
                :root {
                  --email-bg: #09090b;
                  --text-body: #fafafa;
                  --text-secondary: #d4d4d8;
                  --text-muted: #71717a;
                  --text-link: #38bdf8;
                  --border-default: #27272a;
                }
              }
            `}
          </style>
          <link rel="preconnect" href="https://rsms.me/" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Body
          style={{
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            fontOpticalSizing: 'auto',
          }}
          className="m-0 bg-default p-0 font-sans"
        >
          <Container className="mx-auto max-w-[660px] bg-default px-9 pt-16 pb-10">
            <Section className="mb-12">
              <Text className="m-0 font-mono font-semibold text-link text-sm uppercase tracking-widest">
                Jasper Gorchov
              </Text>

              <Heading className="mt-[18px] mb-0 font-medium text-[40px] text-body tracking-[-0.03em]">
                My latest work
              </Heading>

              <Text className="mt-[22px] mb-0 text-secondary text-sm/7">
                Hey, I recently published <span className="font-semibold text-body">{contentLabel}</span>. Here’s the
                short version, with links if you want to read more.
              </Text>
            </Section>

            {blogEntries.length > 0 && (
              <Section>
                <Text className="m-0 mb-6 font-mono font-semibold text-muted text-sm uppercase tracking-widest">
                  Blog Posts
                </Text>

                {blogEntries.map((entry, i) => (
                  <Section
                    key={entry.postUrl}
                    className={i > 0 ? 'mt-10 border-default border-t border-solid pt-10' : ''}
                  >
                    <Heading className="m-0 font-semibold text-base text-body">{entry.title}</Heading>

                    {entry.summary ? <Text className="mt-3 mb-0 text-secondary text-sm/7">{entry.summary}</Text> : null}

                    <Link href={entry.postUrl} className="mt-3 block font-semibold text-link text-sm no-underline">
                      Read more
                    </Link>
                  </Section>
                ))}
              </Section>
            )}

            {projectEntries.length > 0 && blogEntries.length > 0 && <Hr className="my-12 border-default" />}

            {projectEntries.length > 0 && (
              <Section>
                <Text className="m-0 mb-6 font-mono font-semibold text-muted text-sm uppercase tracking-widest">
                  Projects
                </Text>

                {projectEntries.map((entry, i) => (
                  <Section
                    key={entry.postUrl}
                    className={i > 0 ? 'mt-10 border-default border-t border-solid pt-10' : ''}
                  >
                    {entry.image ? (
                      <picture>
                        {entry.imageDark ? (
                          <source srcSet={entry.imageDark.src} media="(prefers-color-scheme: dark)" />
                        ) : null}
                        <img
                          src={entry.image.src}
                          alt={entry.title}
                          width={entry.image.width ?? 600}
                          height={entry.image.height ?? 338}
                          className="mb-4 w-full rounded object-cover"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </picture>
                    ) : null}
                    <Heading className="m-0 font-semibold text-base text-body">{entry.title}</Heading>

                    {entry.summary ? <Text className="mt-3 mb-0 text-secondary text-sm/7">{entry.summary}</Text> : null}

                    <Link href={entry.postUrl} className="mt-3 block font-semibold text-link text-sm no-underline">
                      Read more
                    </Link>
                  </Section>
                ))}
              </Section>
            )}

            <Hr className="mt-12 mb-7 border-default" />

            <Section>
              <Text className="m-0 text-muted text-xs">
                You received this because you subscribed to updates from jaspergorchov.com. If you no longer wish to
                receive these emails, you can{' '}
                <Link href={`${siteUrl}/api/unsubscribe`} className="text-muted underline">
                  unsubscribe here
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

function describeContent(blogCount: number, projectCount: number) {
  const parts = []

  if (blogCount > 0) {
    parts.push(`${blogCount} new blog ${blogCount === 1 ? 'post' : 'posts'}`)
  }

  if (projectCount > 0) {
    parts.push(`${projectCount} new ${projectCount === 1 ? 'project' : 'projects'}`)
  }

  if (parts.length === 0) {
    return 'a new update'
  }

  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]
}
