import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart(),
    react({
      jsxRuntime: 'automatic',
    }),
    netlify(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'salvageunion-reference': path.resolve(__dirname, '../../packages/salvageunion-reference'),
    },
  },
  optimizeDeps: {
    exclude: ['salvageunion-reference'],
  },
})
