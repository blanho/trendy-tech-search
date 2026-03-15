import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = (req.query.page as string) || '1'

  try {
    const upstream = await fetch(`https://lobste.rs/hottest.json?page=${page}`, {
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
    res.status(502).json({ error: 'Lobsters API unavailable', detail: String(err) })
  }
}
