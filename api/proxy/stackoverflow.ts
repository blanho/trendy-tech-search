import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Forward all query params
    const params = new URLSearchParams(req.query as Record<string, string>);
    const stackUrl = `https://api.stackexchange.com/2.3/questions?${params.toString()}`;
    const stackRes = await fetch(stackUrl, {
      headers: {
        'User-Agent': 'TrendyTechSearch/1.0',
      },
    });

    if (!stackRes.ok) {
      const text = await stackRes.text();
      console.error('StackOverflow API error:', stackRes.status, text);
      res.status(stackRes.status).json({ error: 'StackOverflow API error', status: stackRes.status, details: text });
      return;
    }

    const data = await stackRes.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(data);
  } catch (err) {
    console.error('StackOverflow proxy error:', err);
    res.status(500).json({ error: 'Internal proxy error', details: (err && typeof err === 'object' && 'message' in err) ? (err as Error).message : String(err) });
  }
}
