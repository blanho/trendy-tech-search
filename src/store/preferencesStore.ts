import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeedItem, FeedSource, SortMode, ViewMode } from '@/types/feed'

interface PreferencesState {

  darkMode: boolean
  toggleDarkMode: () => void

  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  sortMode: SortMode
  setSortMode: (mode: SortMode) => void

  enabledSources: FeedSource[]
  toggleSource: (source: FeedSource) => void
  setEnabledSources: (sources: FeedSource[]) => void

  columnOrder: FeedSource[]
  setColumnOrder: (order: FeedSource[]) => void

  bookmarks: FeedItem[]
  addBookmark: (item: FeedItem) => void
  removeBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean

  focusedColumnIndex: number
  focusedItemIndex: number
  setFocusedColumn: (index: number) => void
  setFocusedItem: (index: number) => void
}

const DEFAULT_SOURCES: FeedSource[] = ['hackernews', 'reddit', 'devto', 'github']
const ALL_SOURCES: FeedSource[] = [
  'hackernews', 'reddit', 'devto', 'github',
  'lobsters', 'hashnode', 'producthunt',
  'stackoverflow', 'indiehackers',
]

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({

      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      viewMode: 'compact',
      setViewMode: (mode) => set({ viewMode: mode }),

      sortMode: 'score',
      setSortMode: (mode) => set({ sortMode: mode }),

      enabledSources: [...DEFAULT_SOURCES],
      toggleSource: (source) =>
        set((state) => {
          const isEnabled = state.enabledSources.includes(source)
          if (isEnabled && state.enabledSources.length === 1) return state
          return {
            enabledSources: isEnabled
              ? state.enabledSources.filter((s) => s !== source)
              : [...state.enabledSources, source],
          }
        }),
      setEnabledSources: (sources) => set({ enabledSources: sources }),

      columnOrder: [...ALL_SOURCES],
      setColumnOrder: (order) => set({ columnOrder: order }),

      bookmarks: [],
      addBookmark: (item) =>
        set((state) => {
          if (state.bookmarks.some((b) => b.id === item.id)) return state
          return { bookmarks: [...state.bookmarks, item] }
        }),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),

      focusedColumnIndex: 0,
      focusedItemIndex: 0,
      setFocusedColumn: (index) => set({ focusedColumnIndex: index, focusedItemIndex: 0 }),
      setFocusedItem: (index) => set({ focusedItemIndex: index }),
    }),
    {
      name: 'trendy-tech-preferences',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>
        if (version < 2) {
          const removed = new Set(['freecodecamp', 'hackernoon'])
          if (Array.isArray(state.enabledSources)) {
            state.enabledSources = (state.enabledSources as string[]).filter((s) => !removed.has(s))
          }
          if (Array.isArray(state.columnOrder)) {
            state.columnOrder = (state.columnOrder as string[]).filter((s) => !removed.has(s))
          }
        }
        return state
      },
      partialize: (state) => ({
        darkMode: state.darkMode,
        viewMode: state.viewMode,
        sortMode: state.sortMode,
        enabledSources: state.enabledSources,
        columnOrder: state.columnOrder,
        bookmarks: state.bookmarks,
      }),
    },
  ),
)
