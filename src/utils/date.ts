/**
 * Format a date string or timestamp to a relative time string.
 * e.g., "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(dateInput?: string | number): string {
  if (!dateInput) return ''

  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 60) return 'just now'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears}y ago`
}

/**
 * Get recency score (0-1) based on how recent the item is.
 * 1 = just posted, 0 = older than 24 hours
 */
export function getRecencyScore(dateInput?: string | number): number {
  if (!dateInput) return 0

  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const hoursOld = diffMs / (1000 * 60 * 60)

  // 0-1 scale where 0h = 1.0 and 24h+ = 0.0
  return Math.max(0, 1 - hoursOld / 24)
}
