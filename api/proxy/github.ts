import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const since = (req.query.since as string) || 'daily'

  const daysMap: Record<string, number> = { daily: 1, weekly: 7, monthly: 30 }
  const days = daysMap[since] ?? 1
  const dateFrom = new Date(Date.now() - days * 86_400_000).toISOString().split('T')[0]

  const q = `created:>${dateFrom} stars:>5`
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
        Accept: 'application/vnd.github+json',
      },
      signal: AbortSignal.timeout(15_000),
    })

    if (!upstream.ok) {
      throw new Error(`GitHub API returned ${upstream.status}`)
    }

    const data = await upstream.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(data.items ?? [])
  } catch (err) {
    res.status(502).json({ error: 'GitHub API unavailable', detail: String(err) })
  }
}
