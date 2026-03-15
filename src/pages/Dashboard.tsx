import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Grid } from '@mui/material'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FeedSource } from '@/types/feed'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useHackerNews } from '@/hooks/useHackerNews'
import { useReddit } from '@/hooks/useReddit'
import { useDevto } from '@/hooks/useDevto'
import { useGithubTrending } from '@/hooks/useGithubTrending'
import FeedColumn from '@/components/FeedColumn/FeedColumn'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import BookmarksDrawer from '@/components/Bookmarks/BookmarksDrawer'
import EmptyState from '@/components/EmptyState/EmptyState'
import KeyboardShortcutsDialog from '@/components/KeyboardShortcuts/KeyboardShortcutsDialog'
import StatusBar from '@/components/StatusBar/StatusBar'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useNotificationStore } from '@/store/notificationStore'

// Sortable column wrapper
function SortableColumn({
  id,
  children,
}: Readonly<{
  id: string
  children: (dragHandleProps: Record<string, unknown>) => React.ReactNode
}>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box ref={setNodeRef} style={style} sx={{ height: 'calc(100vh - 100px)' }}>
      {children({ ...attributes, ...listeners })}
    </Box>
  )
}

function getMdSize(count: number): number {
  if (count <= 2) return 6
  if (count === 3) return 4
  return 3
}

export default function Dashboard() {
  const [bookmarksOpen, setBookmarksOpen] = useState(false)

  const { enabledSources, columnOrder, setColumnOrder } = usePreferencesStore()
  const addToast = useNotificationStore((s) => s.addToast)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  // Fetch data for each source
  const hn = useHackerNews(enabledSources.includes('hackernews'))
  const reddit = useReddit(enabledSources.includes('reddit'))
  const devto = useDevto(enabledSources.includes('devto'))
  const github = useGithubTrending('daily', enabledSources.includes('github'))

  // Map source to data
  const sourceDataMap = useMemo(
    () => ({
      hackernews: {
        items: hn.data?.pages.flat() ?? [],
        isLoading: hn.isLoading,
        isError: hn.isError,
        error: hn.error,
        isFetchingNextPage: hn.isFetchingNextPage,
        hasNextPage: hn.hasNextPage,
        fetchNextPage: hn.fetchNextPage,
        refetch: hn.refetch,
        dataUpdatedAt: hn.dataUpdatedAt,
      },
      reddit: {
        items: reddit.data?.pages.flat() ?? [],
        isLoading: reddit.isLoading,
        isError: reddit.isError,
        error: reddit.error,
        isFetchingNextPage: reddit.isFetchingNextPage,
        hasNextPage: reddit.hasNextPage,
        fetchNextPage: reddit.fetchNextPage,
        refetch: reddit.refetch,
        dataUpdatedAt: reddit.dataUpdatedAt,
      },
      devto: {
        items: devto.data?.pages.flat() ?? [],
        isLoading: devto.isLoading,
        isError: devto.isError,
        error: devto.error,
        isFetchingNextPage: devto.isFetchingNextPage,
        hasNextPage: devto.hasNextPage,
        fetchNextPage: devto.fetchNextPage,
        refetch: devto.refetch,
        dataUpdatedAt: devto.dataUpdatedAt,
      },
      github: {
        items: github.data ?? [],
        isLoading: github.isLoading,
        isError: github.isError,
        error: github.error,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: undefined,
        refetch: github.refetch,
        dataUpdatedAt: github.dataUpdatedAt,
      },
    }),
    [hn, reddit, devto, github],
  )

  // Visible columns based on enabled sources and order
  const visibleColumns = useMemo(
    () => columnOrder.filter((source) => enabledSources.includes(source)),
    [columnOrder, enabledSources],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = columnOrder.indexOf(active.id as FeedSource)
      const newIndex = columnOrder.indexOf(over.id as FeedSource)

      const newOrder = [...columnOrder]
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, active.id as FeedSource)
      setColumnOrder(newOrder)
    },
    [columnOrder, setColumnOrder],
  )

  const colCount = visibleColumns.length
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const totalItems = useMemo(
    () =>
      visibleColumns.reduce((acc, source) => acc + sourceDataMap[source].items.length, 0),
    [visibleColumns, sourceDataMap],
  )

  // Keyboard navigation data
  const columnItemsForNav = useMemo(
    () =>
      visibleColumns.map((source) => ({
        source,
        items: sourceDataMap[source].items,
      })),
    [visibleColumns, sourceDataMap],
  )
  useKeyboardNavigation(columnItemsForNav)

  // Refresh all sources
  const handleRefreshAll = useCallback(() => {
    hn.refetch()
    reddit.refetch()
    devto.refetch()
    github.refetch()
    addToast({ message: 'Refreshing all sources…', severity: 'info', duration: 2000 })
  }, [hn, reddit, devto, github, addToast])

  // Listen for '?' to open shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches('input,textarea,select')) return
      if (e.key === '?') {
        setShortcutsOpen(true)
      } else if (e.key === 'r') {
        handleRefreshAll()
      }
    }
    globalThis.addEventListener('keydown', handler)
    return () => globalThis.removeEventListener('keydown', handler)
  }, [handleRefreshAll])

  return (
    <DashboardLayout onShowBookmarks={() => setBookmarksOpen(true)} onRefreshAll={handleRefreshAll}>
      {visibleColumns.length === 0 ? (
        <EmptyState type="no-sources" />
      ) : (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleColumns} strategy={horizontalListSortingStrategy}>
          <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
            {visibleColumns.map((source, index) => {
              const data = sourceDataMap[source]
              return (
                <Grid
                  key={source}
                  size={{
                    xs: 12,
                    sm: colCount <= 2 ? 6 : 12,
                    md: getMdSize(colCount),
                    lg: 12 / Math.min(colCount, 4),
                  }}
                >
                  <SortableColumn id={source}>
                    {(dragHandleProps) => (
                      <FeedColumn
                        source={source}
                        items={data.items}
                        isLoading={data.isLoading}
                        isError={data.isError}
                        error={data.error}
                        isFetchingNextPage={data.isFetchingNextPage}
                        hasNextPage={data.hasNextPage}
                        fetchNextPage={data.fetchNextPage}
                        refetch={data.refetch}
                        dataUpdatedAt={data.dataUpdatedAt}
                        columnIndex={index}
                        dragHandleProps={dragHandleProps}
                      />
                    )}
                  </SortableColumn>
                </Grid>
              )
            })}
          </Grid>
        </SortableContext>
      </DndContext>
      )}

      <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <StatusBar totalItems={totalItems} onShowShortcuts={() => setShortcutsOpen(true)} />
    </DashboardLayout>
  )
}
