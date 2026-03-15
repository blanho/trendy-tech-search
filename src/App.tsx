import { useMemo } from 'react'
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import { darkTheme, lightTheme } from '@/theme'
import { usePreferencesStore } from '@/store/preferencesStore'
import Dashboard from '@/pages/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const globalStyles = (
  <GlobalStyles
    styles={{
      'html, body, #root': {
        margin: 0,
        padding: 0,
        height: '100%',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
      },
    }}
  />
)

function App() {
  const darkMode = usePreferencesStore((s) => s.darkMode)
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <Dashboard />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
