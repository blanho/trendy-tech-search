import { memo, useMemo, useCallback } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  DragIndicator as DragIcon,
  TrendingUp as TrendingIcon,
  AccessTime as NewestIcon,
  Star as ScoreIcon,
} from '@mui/icons-material'
import { useInView } from 'react-intersection-observer'
import type { FeedItem as FeedItemType, FeedSource, SortMode } from '@/types/feed'
import { FEED_SOURCES } from '@/types/feed'
import FeedItemComponent from '@/components/FeedItem/FeedItem'
import { FeedColumnSkeleton } from '@/components/Skeleton/FeedItemSkeleton'
import SourceIcon from '@/components/SourceIcon/SourceIcon'
import LastUpdated from '@/components/LastUpdated/LastUpdated'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useSearchStore } from '@/store/searchStore'
import { sortFeedItems } from '@/utils/ranking'

interface FeedColumnProps {
  source: FeedSource
  items: FeedItemType[]
  isLoading: boolean
  isError: boolean
  error?: Error | null
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
  refetch: () => void
  dataUpdatedAt?: number
  columnIndex: number
  dragHandleProps?: Record<string, unknown>
}

const FeedColumn = memo(function FeedColumn({
  source,
  items,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  dataUpdatedAt,
  columnIndex,
  dragHandleProps,
}: FeedColumnProps) {
  const {
    viewMode,
    sortMode,
    setSortMode,
    focusedColumnIndex,
    focusedItemIndex,
  } = usePreferencesStore()

  const sourceConfig = FEED_SOURCES.find((s) => s.id === source)
  const isCompact = viewMode === 'compact'
  const isFocusedColumn = focusedColumnIndex === columnIndex
  const searchQuery = useSearchStore((s) => s.query)

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [items, searchQuery])

  const sortedItems = useMemo(() => sortFeedItems(filteredItems, sortMode), [filteredItems, sortMode])

  const { ref: infiniteScrollRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage()
      }
    },
  })

  const handleSortChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newSort: SortMode | null) => {
      if (newSort) setSortMode(newSort)
    },
    [setSortMode],
  )

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <FeedColumnSkeleton />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isFocusedColumn ? 'primary.main' : 'divider',
        overflow: 'hidden',
        transition: 'border-color 200ms ease',
      }}
    >
      {}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {}
          <Box {...dragHandleProps} sx={{ cursor: 'grab', display: 'flex', opacity: 0.5 }}>
            <DragIcon sx={{ fontSize: 18 }} />
          </Box>

          <SourceIcon source={source} sx={{ fontSize: 22 }} />

          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ flex: 1, minWidth: 0 }}>
            {sourceConfig?.label ?? source}
          </Typography>

          <Chip
            label={sortedItems.length}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 22, fontSize: 11 }}
          />

          <LastUpdated dataUpdatedAt={dataUpdatedAt} />

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={() => refetch()} sx={{ cursor: 'pointer' }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {}
        <ToggleButtonGroup
          value={sortMode}
          exclusive
          onChange={handleSortChange}
          size="small"
          sx={{ mt: 1, '& .MuiToggleButton-root': { py: 0.25, px: 1, fontSize: 11 } }}
        >
          <ToggleButton value="score" sx={{ cursor: 'pointer' }}>
            <ScoreIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Score
          </ToggleButton>
          <ToggleButton value="newest" sx={{ cursor: 'pointer' }}>
            <NewestIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Newest
          </ToggleButton>
          <ToggleButton value="trending" sx={{ cursor: 'pointer' }}>
            <TrendingIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Trending
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider />

      {}
      {isError && (
        <Alert
          severity="error"
          sx={{ m: 1, borderRadius: 1 }}
          action={
            <Button size="small" onClick={() => refetch()} sx={{ cursor: 'pointer' }}>
              Retry
            </Button>
          }
        >
          {error?.message ?? 'Failed to load'}
        </Alert>
      )}

      {}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.disabled',
            borderRadius: 3,
          },
        }}
      >
        {isCompact ? (
          <Box>
            {sortedItems.map((item, index) => (
              <FeedItemComponent
                key={item.id}
                item={item}
                compact
                focused={isFocusedColumn && focusedItemIndex === index}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 0.5 }}>
            {sortedItems.map((item, index) => (
              <FeedItemComponent
                key={item.id}
                item={item}
                focused={isFocusedColumn && focusedItemIndex === index}
              />
            ))}
          </Box>
        )}

        {}
        {hasNextPage && (
          <Box ref={infiniteScrollRef} sx={{ p: 2, textAlign: 'center' }}>
            {isFetchingNextPage ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Scroll for more
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
})

export default FeedColumn
