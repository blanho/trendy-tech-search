import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const since = (req.query.since as string) || 'daily'

  try {
    const upstream = await fetch(
      `https://api.gitterapp.com/repositories?since=${since}&spoken_language_code=en`,
      {
        headers: {
          'User-Agent': 'TrendyTechSearch/1.0',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(15_000),
      },
    )

    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`)
    }

    const data = await upstream.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(data)
  } catch (err) {
    res.status(502).json({ error: 'GitHub Trending API unavailable', detail: String(err) })
  }
}
