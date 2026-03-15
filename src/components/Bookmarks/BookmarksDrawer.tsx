import { memo } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  DeleteSweep as ClearAllIcon,
} from '@mui/icons-material'
import { usePreferencesStore } from '@/store/preferencesStore'
import FeedItemComponent from '@/components/FeedItem/FeedItem'

interface BookmarksDrawerProps {
  open: boolean
  onClose: () => void
}

const BookmarksDrawer = memo(function BookmarksDrawer({ open, onClose }: BookmarksDrawerProps) {
  const { bookmarks } = usePreferencesStore()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.default',
          },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
            Bookmarks ({bookmarks.length})
          </Typography>
          {bookmarks.length > 0 && (
            <Tooltip title="Clear all bookmarks">
              <IconButton
                size="small"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  bookmarks.forEach((b) => usePreferencesStore.getState().removeBookmark(b.id))
                }}
              >
                <ClearAllIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small" sx={{ cursor: 'pointer' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>

        {bookmarks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              No bookmarks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the bookmark icon on any post to save it here.
            </Typography>
          </Box>
        ) : (
          <Box>
            {bookmarks.map((item) => (
              <FeedItemComponent key={item.id} item={item} compact />
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  )
})

export default BookmarksDrawer
