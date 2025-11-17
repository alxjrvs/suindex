import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart(),
    react({
      jsxRuntime: 'automatic',
    }),
    netlify(),
    VitePluginRadar({
      analytics: {
        id: process.env.VITE_GA_MEASUREMENT_ID || '',
      },
      enableDev: false,
    }),
  ],
})
