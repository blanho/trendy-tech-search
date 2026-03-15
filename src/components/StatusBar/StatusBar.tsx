import { memo } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import {
  Keyboard as KeyboardIcon,
} from '@mui/icons-material'
import { usePreferencesStore } from '@/store/preferencesStore'

interface StatusBarProps {
  totalItems: number
  onShowShortcuts: () => void
}

const StatusBar = memo(function StatusBar({ totalItems, onShowShortcuts }: StatusBarProps) {
  const { sortMode, viewMode, enabledSources } = usePreferencesStore()

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        px: 2,
        py: 0.75,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1000,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {totalItems} items
      </Typography>

      <Typography variant="caption" color="text.secondary">
        •
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {enabledSources.length} sources
      </Typography>

      <Typography variant="caption" color="text.secondary">
        •
      </Typography>

      <Chip
        label={sortMode}
        size="small"
        variant="outlined"
        sx={{ height: 20, fontSize: 10 }}
      />

      <Chip
        label={viewMode}
        size="small"
        variant="outlined"
        sx={{ height: 20, fontSize: 10 }}
      />

      <Box sx={{ flex: 1 }} />

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        onClick={onShowShortcuts}
        sx={{
          cursor: 'pointer',
          opacity: 0.6,
          '&:hover': { opacity: 1 },
          transition: 'opacity 200ms',
        }}
      >
        <KeyboardIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" color="text.secondary">
          Press ? for shortcuts
        </Typography>
      </Stack>
    </Box>
  )
})

export default StatusBar
