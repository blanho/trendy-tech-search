export interface FeedItem {
  id: string
  title: string
  url: string
  source: FeedSource
  score?: number
  comments?: number
  commentsUrl?: string
  createdAt?: string
  author?: string
  tags?: string[]
  thumbnail?: string
}

export type FeedSource = 'hackernews' | 'reddit' | 'devto' | 'github'

export type SortMode = 'score' | 'newest' | 'trending'

export type ViewMode = 'compact' | 'grid'

export interface FeedSourceConfig {
  id: FeedSource
  label: string
  icon: string
  color: string
  enabled: boolean
}

export const FEED_SOURCES: FeedSourceConfig[] = [
  { id: 'hackernews', label: 'Hacker News', icon: 'Y', color: '#FF6600', enabled: true },
  { id: 'reddit', label: 'Reddit', icon: 'R', color: '#FF4500', enabled: true },
  { id: 'devto', label: 'Dev.to', icon: 'D', color: '#0A0A0A', enabled: true },
  { id: 'github', label: 'GitHub Trending', icon: 'G', color: '#238636', enabled: true },
]
