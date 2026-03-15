import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeedItem, FeedSource, SortMode, ViewMode } from '@/types/feed'

interface PreferencesState {
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void

  // View
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  // Sorting
  sortMode: SortMode
  setSortMode: (mode: SortMode) => void

  // Sources
  enabledSources: FeedSource[]
  toggleSource: (source: FeedSource) => void
  setEnabledSources: (sources: FeedSource[]) => void

  // Column order
  columnOrder: FeedSource[]
  setColumnOrder: (order: FeedSource[]) => void

  // Bookmarks
  bookmarks: FeedItem[]
  addBookmark: (item: FeedItem) => void
  removeBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean

  // Keyboard navigation
  focusedColumnIndex: number
  focusedItemIndex: number
  setFocusedColumn: (index: number) => void
  setFocusedItem: (index: number) => void
}

const DEFAULT_SOURCES: FeedSource[] = ['hackernews', 'reddit', 'devto', 'github']
const ALL_SOURCES: FeedSource[] = [
  'hackernews', 'reddit', 'devto', 'github',
  'lobsters', 'hashnode', 'producthunt', 'freecodecamp',
]

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // View
      viewMode: 'compact',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Sorting
      sortMode: 'score',
      setSortMode: (mode) => set({ sortMode: mode }),

      // Sources
      enabledSources: [...DEFAULT_SOURCES],
      toggleSource: (source) =>
        set((state) => {
          const isEnabled = state.enabledSources.includes(source)
          if (isEnabled && state.enabledSources.length === 1) return state // Keep at least 1
          return {
            enabledSources: isEnabled
              ? state.enabledSources.filter((s) => s !== source)
              : [...state.enabledSources, source],
          }
        }),
      setEnabledSources: (sources) => set({ enabledSources: sources }),

      // Column order
      columnOrder: [...ALL_SOURCES],
      setColumnOrder: (order) => set({ columnOrder: order }),

      // Bookmarks
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

      // Keyboard navigation
      focusedColumnIndex: 0,
      focusedItemIndex: 0,
      setFocusedColumn: (index) => set({ focusedColumnIndex: index, focusedItemIndex: 0 }),
      setFocusedItem: (index) => set({ focusedItemIndex: index }),
    }),
    {
      name: 'trendy-tech-preferences',
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
