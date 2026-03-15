import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface NotificationState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

let counter = 0

function withoutToast(toasts: Toast[], id: string): Toast[] {
  return toasts.filter((t) => t.id !== id)
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++counter}`
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    const duration = toast.duration ?? 4000
    setTimeout(() => {
      set((state) => ({ toasts: withoutToast(state.toasts, id) }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: withoutToast(state.toasts, id) })),
}))
