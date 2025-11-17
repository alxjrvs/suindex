import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePluginRadar } from 'vite-plugin-radar'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
      analytics: {
        id: process.env.VITE_GA_MEASUREMENT_ID || '',
      },
      enableDev: false,
    }),
  ],
  resolve: {
    // Ensure Vite resolves the workspace package correctly
    // In development, use source files; in production, use built files
    alias: {
      'salvageunion-reference': path.resolve(
        __dirname,
        '../../packages/salvageunion-reference/lib/index.ts'
      ),
    },
  },
  optimizeDeps: {
    // Exclude from pre-bundling since it's a workspace package
    exclude: ['salvageunion-reference'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('salvageunion-reference')) {
              return 'salvage-union'
            }
            if (id.includes('@tanstack/react-router') || id.includes('@tanstack/react-start')) {
              return 'router'
            }
            if (id.includes('react') || id.includes('react-dom')) {
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
