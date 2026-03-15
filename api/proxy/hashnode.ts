import type { VercelRequest, VercelResponse } from '@vercel/node'

const GQL_ENDPOINT = 'https://gql.hashnode.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const upstream = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(10_000),
    })

    const data = await upstream.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.setHeader('Content-Type', 'application/json')
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Hashnode API unavailable', detail: String(err) })
  }
}
