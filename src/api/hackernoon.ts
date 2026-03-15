import type { FeedItem } from '@/types/feed'

const SOURCE = 'HackerNoon'

function getText(item: Element, tag: string): string | undefined {
  return item.getElementsByTagName(tag)[0]?.textContent?.trim() || undefined
}

function parseRssItem(item: Element, index: number): FeedItem {
  const title = getText(item, 'title') ?? 'Untitled'
  const link = getText(item, 'link') ?? ''
  const guid = getText(item, 'guid') ?? `${index}`
  const creator = getText(item, 'dc:creator')
  const pubDate = getText(item, 'pubDate')

  const categoryEls = item.getElementsByTagName('category')
  const tags: string[] = []
  for (let i = 0; i < categoryEls.length; i++) {
    const cat = categoryEls[i].textContent?.trim()
    if (cat) tags.push(cat)
  }

  const thumbEl =
    item.getElementsByTagName('media:thumbnail')[0] ??
    item.getElementsByTagName('media:content')[0]
  const thumbnail = thumbEl?.getAttribute('url') || undefined

  return {
    id: `hackernoon-${guid}`,
    title,
    url: link,
    source: 'hackernoon' as const,
    score: 0,
    comments: 0,
    commentsUrl: link,
    createdAt: pubDate ? new Date(pubDate).toISOString() : undefined,
    author: creator,
    tags: tags.slice(0, 5),
    thumbnail,
  }
}

export async function fetchHackerNoon(page = 1): Promise<FeedItem[]> {
  if (page > 1) return []

  const res = await fetch('/api/proxy/hackernoon/feed', {
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) {
    throw new Error(`${SOURCE}: HTTP ${res.status} — ${res.statusText}`)
  }

  const xml = await res.text()
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error(`${SOURCE}: Failed to parse RSS feed`)
  }

  const items = doc.querySelectorAll('item')
  const results: FeedItem[] = []
  items.forEach((item, i) => results.push(parseRssItem(item, i)))
  return results
}
