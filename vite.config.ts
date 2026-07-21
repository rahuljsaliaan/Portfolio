import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // three.js/R3F live in their own lazy chunk (three-vendor); it is large by
    // nature and never blocks first paint, so raise the size-warning threshold.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        // Keep the heavy three.js / R3F graph in its own chunk so it only
        // loads with the lazy 3D scenes and never bloats the initial bundle.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three-vendor'
          }
        },
      },
    },
  },
})
