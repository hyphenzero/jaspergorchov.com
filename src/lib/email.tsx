import { render } from '@react-email/render'
import type React from 'react'
import { Resend } from 'resend'
import { PostNotification } from '@/emails/post-notification'
import { getBlogPostBySlug, getProjectBySlug } from '@/lib/api'
import { getHighlighter } from '@/lib/shiki'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

async function renderReactElement(element: React.ReactElement) {
  await getHighlighter().catch(() => {})

  const { renderToStaticMarkup } = await import('react-dom/server')

  return renderToStaticMarkup(element)
}

function makeImageUrlsAbsolute(html: string, siteUrl: string) {
  return html.replace(/(<img[^>]*src\s*=\s*")(\/[^"]+)("[^>]*>)/g, (_, before: string, path: string, after: string) => {
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('data:') ||
      path.startsWith('//')
    ) {
      return _
    }
    return `${before}${siteUrl}${path}${after}`
  })
}

function inlineContentStyles(html: string) {
  return html
    .replace(
      /<h2(?![^>]*style)/g,
      '<h2 style="font-size:20px;font-weight:700;margin:24px 0 12px;color:#09090b;line-height:1.3"'
    )
    .replace(
      /<h3(?![^>]*style)/g,
      '<h3 style="font-size:17px;font-weight:600;margin:20px 0 8px;color:#09090b;line-height:1.3"'
    )
    .replace(
      /<h4(?![^>]*style)/g,
      '<h4 style="font-size:15px;font-weight:600;margin:16px 0 8px;color:#09090b;line-height:1.3"'
    )
    .replace(/<p(?![^>]*style)/g, '<p style="margin:0 0 16px;color:#3f3f46;font-size:15px;line-height:1.7"')
    .replace(
      /<pre(?![^>]*style)/g,
      '<pre style="background:#f4f4f5;border-radius:6px;font-size:13px;line-height:1.5;margin:16px 0;overflow:auto;padding:16px"'
    )
    .replace(
      /<code(?![^>]*style)/g,
      '<code style="background:#f4f4f5;border-radius:3px;font-size:13px;padding:2px 4px"'
    )
    .replace(/<img (?![^>]*style)/g, '<img style="border-radius:6px;height:auto;max-width:100%" ')
    .replace(
      /<blockquote(?![^>]*style)/g,
      '<blockquote style="border-left:3px solid #d4d4d8;color:#52525b;font-style:italic;margin:16px 0;padding:8px 16px"'
    )
    .replace(/<ul(?![^>]*style)/g, '<ul style="margin:16px 0;padding-left:24px"')
    .replace(/<ol(?![^>]*style)/g, '<ol style="margin:16px 0;padding-left:24px"')
    .replace(/<li(?![^>]*style)/g, '<li style="margin:4px 0"')
    .replace(/<a (?![^>]*style)/g, '<a style="color:#0284c7;text-decoration:underline" ')
    .replace(/<hr(?![^>]*style)/g, '<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0"')
    .replace(/<table(?![^>]*style)/g, '<table style="border-collapse:collapse;margin:16px 0;width:100%"')
    .replace(
      /<th(?![^>]*style)/g,
      '<th style="background:#f4f4f5;border:1px solid #e4e4e7;font-weight:600;padding:8px 12px;text-align:left"'
    )
    .replace(/<td(?![^>]*style)/g, '<td style="border:1px solid #e4e4e7;padding:8px 12px"')
}

export async function sendPostNotification(slug: string, type: 'blog' | 'project') {
  const post = type === 'blog' ? await getBlogPostBySlug(slug) : await getProjectBySlug(slug)

  if (!post) {
    throw new Error(`Post not found: ${slug}`)
  }

  const rawHtml = await renderReactElement(
    <div>
      <post.Component />
    </div>
  )

  const siteUrl = process.env.SITE_URL ?? 'https://jaspergorchov.com'
  const contentHtml = inlineContentStyles(makeImageUrlsAbsolute(rawHtml, siteUrl))
  const typeLabel = type === 'blog' ? 'blog post' : 'project'

  const emailHtml = await render(
    <PostNotification
      title={post.meta.title}
      lead={post.meta.lead}
      date={post.meta.date}
      type={type}
      slug={slug}
      contentHtml={contentHtml}
      siteUrl={siteUrl}
    />
  )

  const audienceId = process.env.RESEND_AUDIENCE_ID
  const from = process.env.FROM_EMAIL ?? 'Jasper Gorchov <jasper@jaspergorchov.com>'

  if (audienceId) {
    await getResend().broadcasts.create({
      audienceId,
      from,
      subject: `New ${typeLabel}: ${post.meta.title}`,
      html: emailHtml,
    })
  } else {
    const to = process.env.TO_EMAIL
    if (!to) {
      throw new Error('RESEND_AUDIENCE_ID or TO_EMAIL must be set')
    }
    await getResend().emails.send({
      from,
      to,
      subject: `New ${typeLabel}: ${post.meta.title}`,
      html: emailHtml,
    })
  }
}
