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
      '/api/proxy/hackernoon': {
        target: 'https://hackernoon.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/hackernoon/, ''),
      },
      '/api/proxy/github': {
        target: 'https://api.gitterapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/github/, '/repositories'),
      },
      '/api/proxy/producthunt': {
        target: 'https://api.producthunt.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/producthunt/, '/v1/posts'),
      },
      '/api/proxy/freecodecamp': {
        target: 'https://www.freecodecamp.org',
        changeOrigin: true,
        rewrite: () => '/news/ghost/api/v3/content/posts/',
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
