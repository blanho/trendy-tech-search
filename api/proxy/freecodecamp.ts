import type { VercelRequest, VercelResponse } from '@vercel/node'

const FCC_API_KEY = 'e1c2e68c9e795a2e402f7c70e3'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = (req.query.page as string) || '1'
  const limit = (req.query.limit as string) || '20'

  const params = new URLSearchParams({
    key: FCC_API_KEY,
    page,
    limit,
    include: 'tags,authors',
    order: 'published_at desc',
    fields: 'id,title,url,slug,feature_image,published_at,reading_time,excerpt',
  })

  try {
    const upstream = await fetch(
      `https://www.freecodecamp.org/news/ghost/api/v3/content/posts/?${params}`,
      {
        headers: {
          'User-Agent': 'TrendyTechSearch/1.0',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10_000),
      },
    )

    const data = await upstream.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.setHeader('Content-Type', 'application/json')
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'freeCodeCamp API unavailable', detail: String(err) })
  }
}
