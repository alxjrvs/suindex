import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // CRITICAL: tanstackStart() MUST come before react() plugin
    // This ensures proper React JSX transformation for SSR/SSG
    tanstackStart(),
    react({
      jsxRuntime: 'automatic',
    }),
    netlify(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    visualizer({
      open: false,
      gzipSize: true,
      filename: 'dist/bundle-analysis.html',
    }),
    VitePluginRadar({
      // Google Analytics 4
      analytics: {
        id: process.env.VITE_GA_MEASUREMENT_ID || '',
      },
      // Only enable in production
      enableDev: false,
    }),
  ],
  optimizeDeps: {
    exclude: ['salvageunion-reference'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only apply manual chunks for client build (not SSR)
          // Check if this is a client build by looking for browser-specific modules
          if (id.includes('node_modules')) {
            // TanStack Router packages
            if (id.includes('@tanstack/react-router') || id.includes('@tanstack/react-start')) {
              return 'router'
            }
            // Salvage Union reference data
            if (id.includes('salvageunion-reference')) {
              return 'salvage-union'
            }
            // React vendor bundle (only for client)
            if (
              id.includes('react-dom') ||
              (id.includes('react') && !id.includes('react-router'))
            ) {
              return 'vendor'
            }
          }
        },
      },
      onwarn(warning, warn) {
        // Ignore sourcemap warnings for third-party packages
        // These packages include sourcemaps but not the source files
        if (
          warning.code === 'SOURCEMAP_ERROR' &&
          (warning.message.includes('salvageunion-reference') ||
            warning.message.includes('@chakra-ui'))
        ) {
          return
        }
        warn(warning)
      },
    },
    chunkSizeWarningLimit: 1500, // Increased for data-heavy reference app
    minify: 'terser',
    sourcemap: 'hidden',
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
  },
})
