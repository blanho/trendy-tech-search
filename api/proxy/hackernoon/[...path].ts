import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query
  const targetPath = Array.isArray(path) ? path.join('/') : path || ''
  const targetUrl = `https://hackernoon.com/${targetPath}`

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10_000),
    })

    const body = await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/xml')
    res.status(upstream.status).send(body)
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed', detail: String(err) })
  }
}
