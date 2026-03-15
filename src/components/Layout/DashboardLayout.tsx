import { type ReactNode, memo, useState } from 'react'
import {
  AppBar,
  Box,
  Chip,
  Drawer,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Bookmark as BookmarkIcon,
  DarkMode as DarkModeIcon,
  GridView as GridIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  ViewList as ListIcon,
} from '@mui/icons-material'
import { usePreferencesStore } from '@/store/preferencesStore'
import { FEED_SOURCES } from '@/types/feed'
import SourceIcon from '@/components/SourceIcon/SourceIcon'

interface DashboardLayoutProps {
  children: ReactNode
  onShowBookmarks: () => void
}

const DashboardLayout = memo(function DashboardLayout({
  children,
  onShowBookmarks,
}: DashboardLayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [settingsOpen, setSettingsOpen] = useState(false)

  const {
    darkMode,
    toggleDarkMode,
    viewMode,
    setViewMode,
    enabledSources,
    toggleSource,
    bookmarks,
  } = usePreferencesStore()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Floating Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: { xs: 0, md: 12 },
          left: { xs: 0, md: 16 },
          right: { xs: 0, md: 16 },
          width: { xs: '100%', md: 'auto' },
          borderRadius: { xs: 0, md: 3 },
          bgcolor: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, md: 52 } }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
            <Box
              component="img"
              src="/favicon.svg"
              alt="Trendy Tech Search"
              sx={{ width: 28, height: 28 }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 18,
                  background: 'linear-gradient(135deg, #22C55E, #4ADE80)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TrendyTech
              </Typography>
            )}
          </Stack>

          <Box sx={{ flex: 1 }} />

          {/* View toggle */}
          <Tooltip title={viewMode === 'compact' ? 'Grid view' : 'Compact view'}>
            <IconButton
              onClick={() => setViewMode(viewMode === 'compact' ? 'grid' : 'compact')}
              size="small"
              sx={{ cursor: 'pointer' }}
            >
              {viewMode === 'compact' ? (
                <GridIcon sx={{ fontSize: 20 }} />
              ) : (
                <ListIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Bookmarks */}
          <Tooltip title="Bookmarks">
            <IconButton onClick={onShowBookmarks} size="small" sx={{ cursor: 'pointer' }}>
              <BookmarkIcon sx={{ fontSize: 20 }} />
              {bookmarks.length > 0 && (
                <Chip
                  label={bookmarks.length}
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    height: 18,
                    fontSize: 10,
                    minWidth: 18,
                  }}
                />
              )}
            </IconButton>
          </Tooltip>

          {/* Dark mode toggle */}
          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleDarkMode} size="small" sx={{ cursor: 'pointer' }}>
              {darkMode ? (
                <LightModeIcon sx={{ fontSize: 20 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Customize sources">
            <IconButton
              onClick={() => setSettingsOpen(true)}
              size="small"
              sx={{ cursor: 'pointer' }}
            >
              {isMobile ? (
                <MenuIcon sx={{ fontSize: 20 }} />
              ) : (
                <SettingsIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              bgcolor: 'background.paper',
              p: 2,
            },
          },
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Customize Sources
        </Typography>
        <List disablePadding>
          {FEED_SOURCES.map((source) => (
            <ListItem key={source.id} disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SourceIcon source={source.id} sx={{ fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText primary={source.label} />
              <FormControlLabel
                control={
                  <Switch
                    checked={enabledSources.includes(source.id)}
                    onChange={() => toggleSource(source.id)}
                    size="small"
                    color="primary"
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: '64px', md: '76px' },
          px: { xs: 1, md: 2 },
          pb: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  )
})

export default DashboardLayout
