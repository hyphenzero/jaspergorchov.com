import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'
import type { CSSProperties } from 'react'

interface PostNotificationProps {
  title: string
  lead: string
  date: string
  type: 'blog' | 'project'
  slug: string
  contentHtml: string
  siteUrl: string
}

export function PostNotification({ title, lead, date, type, slug, contentHtml, siteUrl }: PostNotificationProps) {
  const postUrl = `${siteUrl}/${type === 'blog' ? 'blog' : 'projects'}/${slug}`
  const typeLabel = type === 'blog' ? 'blog post' : 'project'

  return (
    <Html>
      <Head />
      <Preview>{lead.slice(0, 150)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>jaspergorchov.com</Text>
          </Section>

          <Section>
            <Text style={tagline}>New {typeLabel}</Text>
            <Heading style={h1}>{title}</Heading>
            <Text style={meta}>{date}</Text>
            {lead ? <Text style={leadStyle}>{lead}</Text> : null}
          </Section>

          <Hr style={divider} />

          <Section>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} style={contentWrapper} />
          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Link href={postUrl} style={button}>
              View this {typeLabel} online →
            </Link>
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

const tagline: CSSProperties = {
  color: '#0284c7',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const h1: CSSProperties = {
  color: '#09090b',
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: '1.2',
  margin: '0 0 8px',
}

const meta: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '13px',
  margin: '0 0 16px',
}

const leadStyle: CSSProperties = {
  color: '#52525b',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
}

const divider: CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '24px 0',
}

const contentWrapper: CSSProperties = {
  color: '#3f3f46',
  fontSize: '15px',
  lineHeight: '1.7',
}

const footerSection: CSSProperties = {
  marginTop: '32px',
}

const button: CSSProperties = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 20px',
  textDecoration: 'none',
}

const footerText: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '16px 0 0',
}

const footerLink: CSSProperties = {
  color: '#a1a1aa',
  textDecoration: 'underline',
}
