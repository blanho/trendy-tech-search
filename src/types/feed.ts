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

export type FeedSource =
  | 'hackernews'
  | 'reddit'
  | 'devto'
  | 'github'
  | 'lobsters'
  | 'hashnode'
  | 'producthunt'
  | 'freecodecamp'
  | 'hackernoon'
  | 'stackoverflow'
  | 'indiehackers'

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
  { id: 'lobsters', label: 'Lobste.rs', icon: 'L', color: '#AC130D', enabled: false },
  { id: 'hashnode', label: 'Hashnode', icon: 'H', color: '#2962FF', enabled: false },
  { id: 'producthunt', label: 'Product Hunt', icon: 'P', color: '#DA552F', enabled: false },
  { id: 'freecodecamp', label: 'freeCodeCamp', icon: 'F', color: '#0A0A23', enabled: false },
  { id: 'hackernoon', label: 'HackerNoon', icon: 'N', color: '#00FF00', enabled: false },
  { id: 'stackoverflow', label: 'Stack Overflow', icon: 'S', color: '#F48024', enabled: false },
  { id: 'indiehackers', label: 'Indie Hackers', icon: 'I', color: '#4F46E5', enabled: false },
]
