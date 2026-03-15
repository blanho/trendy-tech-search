import type { VercelRequest, VercelResponse } from '@vercel/node'

function extractText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`)
  const m = xml.match(re)
  return m ? m[1] : ''
}

interface PHItem {
  id: string
  title: string
  url: string
  published: string
  author: string
  content: string
}

function parseAtomFeed(xml: string): PHItem[] {
  const items: PHItem[] = []
  const entries = xml.split('<entry>').slice(1)

  for (const entry of entries) {
    const id = extractText(entry, 'id')
    const title = extractText(entry, 'title')
    const url = extractAttr(entry, 'link', 'href')
    const published = extractText(entry, 'published')
    const author = extractText(entry, 'name')
    const rawContent = extractText(entry, 'content')
    const content = rawContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim()

    items.push({ id, title, url, published, author, content })
  }

  return items
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const upstream = await fetch('https://www.producthunt.com/feed', {
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
        Accept: 'application/atom+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!upstream.ok) {
      throw new Error(`PH feed returned ${upstream.status}`)
    }

    const xml = await upstream.text()
    const items = parseAtomFeed(xml)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(items)
  } catch (err) {
    res.status(502).json({ error: 'Product Hunt feed unavailable', detail: String(err) })
  }
}
