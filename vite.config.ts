import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePluginRadar } from 'vite-plugin-radar'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { getStaticPaths } from './src/prerender.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        filter: (args) => {
          // Prerender all static paths
          const staticPaths = getStaticPaths()
          return staticPaths.includes(args.path)
        },
      },
    }),
    netlify(),
    viteReact({
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
        manualChunks: (id) => {
          // Only apply manual chunks for client build
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('@tanstack/react-router')) {
              return 'vendor'
            }
            if (id.includes('salvageunion-reference')) {
              return 'salvage-union'
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
