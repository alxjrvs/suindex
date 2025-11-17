import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart(),
    react({
      jsxRuntime: 'automatic',
    }),
    netlify(),
  ],
})
