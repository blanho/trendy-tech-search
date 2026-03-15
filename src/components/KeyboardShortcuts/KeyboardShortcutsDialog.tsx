import { memo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Chip,
  Box,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

const shortcuts = [
  { keys: ['j'], description: 'Move down in current column' },
  { keys: ['k'], description: 'Move up in current column' },
  { keys: ['h'], description: 'Move to left column' },
  { keys: ['l'], description: 'Move to right column' },
  { keys: ['o'], description: 'Open focused item' },
  { keys: ['Enter'], description: 'Open focused item' },
  { keys: ['s'], description: 'Toggle bookmark' },
  { keys: ['g'], description: 'Jump to top' },
  { keys: ['G'], description: 'Jump to bottom' },
  { keys: ['r'], description: 'Refresh all sources' },
  { keys: ['?'], description: 'Show this help' },
]

const KeyboardShortcutsDialog = memo(function KeyboardShortcutsDialog({
  open,
  onClose,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
          Keyboard Shortcuts
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ cursor: 'pointer' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {shortcuts.map((shortcut) => (
            <Stack
              key={shortcut.description}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ py: 0.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                {shortcut.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {shortcut.keys.map((key) => (
                  <Chip
                    key={key}
                    label={key}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      minWidth: 32,
                      justifyContent: 'center',
                    }}
                  />
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
})

export default KeyboardShortcutsDialog
