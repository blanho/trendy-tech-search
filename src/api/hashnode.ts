import type { FeedItem } from '@/types/feed'
import { fetchWithRetry } from '@/api/client'

interface HashnodeEdge {
  node: {
    id: string
    title: string
    brief: string
    url: string
    publishedAt: string
    reactionCount: number
    responseCount: number
    author: {
      name: string
      username: string
    }
    tags: { name: string }[]
    coverImage: { url: string } | null
  }
}

interface HashnodeResponse {
  data: {
    feed: {
      edges: HashnodeEdge[]
      pageInfo: {
        endCursor: string
        hasNextPage: boolean
      }
    }
  }
}

const SOURCE = 'Hashnode'
const GQL_ENDPOINT = 'https://gql.hashnode.com'

const FEED_QUERY = `
  query Feed($first: Int!, $after: String) {
    feed(first: $first, after: $after, filter: FEATURED) {
      edges {
        node {
          id
          title
          brief
          url
          publishedAt
          reactionCount
          responseCount
          author { name username }
          tags { name }
          coverImage { url }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

/**
 * Fetch and normalize Hashnode featured articles via GraphQL.
 */
export async function fetchHashnode(
  first = 20,
  after?: string,
): Promise<{ items: FeedItem[]; endCursor: string | null; hasNextPage: boolean }> {
  const res = await fetchWithRetry(GQL_ENDPOINT, {
    source: SOURCE,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: FEED_QUERY,
      variables: { first, after: after ?? null },
    }),
  })

  const json: HashnodeResponse = await res.json()
  const { edges, pageInfo } = json.data.feed

  const items: FeedItem[] = edges.map(({ node }) => ({
    id: `hashnode-${node.id}`,
    title: node.title,
    url: node.url,
    source: 'hashnode' as const,
    score: node.reactionCount,
    comments: node.responseCount,
    commentsUrl: `${node.url}#comments`,
    createdAt: node.publishedAt,
    author: node.author.name || node.author.username,
    tags: node.tags.map((t) => t.name),
    thumbnail: node.coverImage?.url,
  }))

  return {
    items,
    endCursor: pageInfo.endCursor,
    hasNextPage: pageInfo.hasNextPage,
  }
}
