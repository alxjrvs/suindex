import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePluginRadar } from 'vite-plugin-radar'

// https://tanstack.com/start/latest/docs/framework/react/getting-started
export default defineConfig({
  plugins: [
    tanstackStart(),
    react({
      jsxRuntime: 'automatic',
    }),
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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router', '@tanstack/react-start'],
          'salvage-union': ['salvageunion-reference'],
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
