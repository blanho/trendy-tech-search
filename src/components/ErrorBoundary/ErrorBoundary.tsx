import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                globalThis.location.reload()
              }}
              sx={{ cursor: 'pointer' }}
            >
              Reload page
            </Button>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}
