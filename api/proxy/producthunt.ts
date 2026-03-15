import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const day = (req.query.day as string) || new Date().toISOString().split('T')[0]

  try {
    const upstream = await fetch(`https://api.producthunt.com/v1/posts?day=${day}`, {
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
    })

    const data = await upstream.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.setHeader('Content-Type', 'application/json')
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Product Hunt API unavailable', detail: String(err) })
  }
}
