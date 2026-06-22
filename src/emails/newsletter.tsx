import type { CSSProperties } from 'react'
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'react-email'

interface DigestEntry {
  title: string
  summary: string
  postUrl: string
  type: 'blog' | 'project'
}

interface NewsletterDigestProps {
  siteUrl: string
  entries: DigestEntry[]
}

function TypeBadge({ type }: { type: 'blog' | 'project' }) {
  return <Text style={typeBadgeStyle}>{type === 'blog' ? 'Blog Post' : 'Project'}</Text>
}

export function NewsletterDigest({ siteUrl, entries }: NewsletterDigestProps) {
  const totalCount = entries.length
  const blogCount = entries.filter((e) => e.type === 'blog').length
  const projectCount = entries.filter((e) => e.type === 'project').length

  const preview = `New${blogCount > 0 ? ' blog posts' : ''}${blogCount > 0 && projectCount > 0 ? ' and' : ''}${projectCount > 0 ? ' projects' : ''} from jaspergorchov.com`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>jaspergorchov.com</Text>
          </Section>

          <Section>
            <Heading style={h1}>
              {totalCount} new {totalCount === 1 ? 'post' : 'posts'}
            </Heading>
          </Section>

          {entries.map((entry, i) => (
            <Section key={entry.postUrl} style={i > 0 ? entrySpaced : undefined}>
              <TypeBadge type={entry.type} />
              <Link href={entry.postUrl} style={entryTitle}>
                {entry.title}
              </Link>
              {entry.summary ? <Text style={entrySummary}>{entry.summary}</Text> : null}
            </Section>
          ))}

          <Hr style={divider} />

          <Section>
            <Text style={footerText}>
              You received this because you subscribed to updates from jaspergorchov.com. If you no longer wish to
              receive these emails, you can{' '}
              <Link href={`${siteUrl}/api/unsubscribe`} style={footerLink}>
                unsubscribe here
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: CSSProperties = {
  backgroundColor: '#fafafa',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 0',
}

const container: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '40px 32px',
}

const header: CSSProperties = {
  marginBottom: '32px',
}

const headerText: CSSProperties = {
  color: '#71717a',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  margin: '0',
  textTransform: 'uppercase',
}

const h1: CSSProperties = {
  color: '#09090b',
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: '1.2',
  margin: '0',
}

const typeBadgeStyle: CSSProperties = {
  color: '#0284c7',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  margin: '0 0 4px',
  textTransform: 'uppercase',
}

const entryTitle: CSSProperties = {
  color: '#09090b',
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: '1.3',
  textDecoration: 'none',
}

const entrySummary: CSSProperties = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '4px 0 0',
}

const entrySpaced: CSSProperties = {
  marginTop: '20px',
}

const divider: CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '24px 0',
}

const footerText: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
}

const footerLink: CSSProperties = {
  color: '#a1a1aa',
  textDecoration: 'underline',
}
