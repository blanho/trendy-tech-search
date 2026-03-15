import { memo } from 'react'
import { Alert, Slide, Snackbar, Stack } from '@mui/material'
import { useNotificationStore } from '@/store/notificationStore'

const ToastContainer = memo(function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts)
  const removeToast = useNotificationStore((s) => s.removeToast)

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        bottom: 48,
        right: 16,
        zIndex: 2000,
        maxWidth: 360,
      }}
    >
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          slots={{ transition: Slide }}
          sx={{ position: 'relative', bottom: 'auto', right: 'auto' }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => removeToast(toast.id)}
            variant="filled"
            sx={{ width: '100%', minWidth: 240 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  )
})

export default ToastContainer
