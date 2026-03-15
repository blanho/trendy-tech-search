import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import {
  SearchOff as SearchOffIcon,
  RssFeed as FeedIcon,
} from '@mui/icons-material'

interface EmptyStateProps {
  type: 'no-results' | 'no-sources'
}

const EmptyState = memo(function EmptyState({ type }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          color: 'text.secondary',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        color: 'text.secondary',
      }}
    >
      <FeedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
      <Typography variant="h6" fontWeight={600} gutterBottom>
        No sources enabled
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Enable at least one source from the settings to see trending content.
      </Typography>
    </Box>
  )
})

export default EmptyState
