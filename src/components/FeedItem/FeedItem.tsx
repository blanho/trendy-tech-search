import { memo, useCallback } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  ChatBubbleOutline as CommentsIcon,
  KeyboardArrowUp as ScoreIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material'
import type { FeedItem as FeedItemType } from '@/types/feed'
import { usePreferencesStore } from '@/store/preferencesStore'
import { formatRelativeTime } from '@/utils/date'

interface FeedItemProps {
  item: FeedItemType
  compact?: boolean
  focused?: boolean
}

const FeedItemComponent = memo(function FeedItemComponent({
  item,
  compact,
  focused,
}: FeedItemProps) {
  const { isBookmarked, addBookmark, removeBookmark } = usePreferencesStore()
  const bookmarked = isBookmarked(item.id)

  const handleBookmarkToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (bookmarked) {
        removeBookmark(item.id)
      } else {
        addBookmark(item)
      }
    },
    [bookmarked, item, addBookmark, removeBookmark],
  )

  const handleOpenArticle = useCallback(() => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }, [item.url])

  const handleOpenComments = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (item.commentsUrl) {
        window.open(item.commentsUrl, '_blank', 'noopener,noreferrer')
      }
    },
    [item.commentsUrl],
  )

  if (compact) {
    return (
      <Box
        onClick={handleOpenArticle}
        sx={{
          py: 1,
          px: 2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          transition: 'background-color 200ms ease',
          borderLeft: focused ? '3px solid' : '3px solid transparent',
          borderLeftColor: focused ? 'primary.main' : 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          '&:not(:last-child)': {
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          },
        }}
      >
        {/* Score */}
        <Stack alignItems="center" sx={{ minWidth: 36, pt: 0.25 }}>
          <ScoreIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography
            variant="caption"
            fontWeight={700}
            color="primary.main"
            sx={{ lineHeight: 1 }}
          >
            {item.score ?? 0}
          </Typography>
        </Stack>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {item.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            {item.author && (
              <Typography variant="caption" color="text.secondary">
                {item.author}
              </Typography>
            )}
            {item.createdAt && (
              <Typography variant="caption" color="text.secondary">
                {formatRelativeTime(item.createdAt)}
              </Typography>
            )}
            {item.comments != null && (
              <Stack
                direction="row"
                spacing={0.25}
                alignItems="center"
                onClick={handleOpenComments}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                <CommentsIcon sx={{ fontSize: 12 }} />
                <Typography variant="caption" color="text.secondary">
                  {item.comments}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Actions */}
        <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
          <IconButton
            size="small"
            onClick={handleBookmarkToggle}
            sx={{
              opacity: bookmarked ? 1 : 0,
              transition: 'opacity 200ms ease',
              '.MuiBox-root:hover &': { opacity: 1 },
              color: bookmarked ? 'primary.main' : 'text.secondary',
            }}
          >
            {bookmarked ? (
              <BookmarkIcon sx={{ fontSize: 16 }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  // Card view
  return (
    <Card
      variant="outlined"
      sx={{
        m: 1,
        borderColor: focused ? 'primary.main' : 'divider',
        transition: 'all 200ms ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-1px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardActionArea onClick={handleOpenArticle}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            {item.title}
          </Typography>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
              {item.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}

          {/* Meta row */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ color: 'text.secondary' }}
          >
            <Stack direction="row" spacing={0.25} alignItems="center">
              <ScoreIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" fontWeight={600}>
                {item.score ?? 0}
              </Typography>
            </Stack>

            {item.comments != null && (
              <Stack
                direction="row"
                spacing={0.25}
                alignItems="center"
                onClick={handleOpenComments}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                <CommentsIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{item.comments}</Typography>
              </Stack>
            )}

            {item.author && (
              <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
                {item.author}
              </Typography>
            )}

            <Box sx={{ flex: 1 }} />

            {item.createdAt && (
              <Typography variant="caption">{formatRelativeTime(item.createdAt)}</Typography>
            )}

            <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
              <IconButton size="small" onClick={handleBookmarkToggle}>
                {bookmarked ? (
                  <BookmarkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Open in new tab">
              <OpenIcon sx={{ fontSize: 14, opacity: 0.5 }} />
            </Tooltip>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})

export default FeedItemComponent
