import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/proxy/lobsters': {
        target: 'https://lobste.rs',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/lobsters/, '/hottest.json'),
      },
      '/api/proxy/github': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const since = url.searchParams.get('since') || 'daily'
          const days = since === 'monthly' ? 30 : since === 'weekly' ? 7 : 1
          const d = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
          return `/search/repositories?q=${encodeURIComponent(`created:>${d} stars:>5`)}&sort=stars&order=desc&per_page=30`
        },
      },
      '/api/proxy/producthunt': {
        target: 'https://www.producthunt.com',
        changeOrigin: true,
        rewrite: () => '/feed',
      },
      '/api/proxy/hashnode': {
        target: 'https://gql.hashnode.com',
        changeOrigin: true,
        rewrite: () => '/',
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/@mui')) {
            return 'mui'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'query'
          }
        },
      },
    },
  },
})
