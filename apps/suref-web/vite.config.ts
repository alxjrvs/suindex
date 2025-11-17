import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
import { VitePluginRadar } from 'vite-plugin-radar'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// Sanitize file names to remove invalid characters (colons, null bytes, etc.)
function sanitizeFileName(name: string): string {
  return name
    .replace(/\0/g, '') // Remove null bytes
    .replace(/:/g, '-') // Replace colons with hyphens
    .replace(/[<>"|?*]/g, '-') // Replace other invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'dist/bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting strategy
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react/jsx')) {
              return 'react-vendor'
            }
            // TanStack libraries
            if (
              id.includes('@tanstack/react-router') ||
              id.includes('@tanstack/react-start') ||
              id.includes('@tanstack/react-query') ||
              id.includes('@tanstack/react-form')
            ) {
              return 'tanstack-vendor'
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase-vendor'
            }
            // UI libraries
            if (
              id.includes('@chakra-ui') ||
              id.includes('@emotion') ||
              id.includes('framer-motion')
            ) {
              return 'ui-vendor'
            }
            // Other large dependencies
            if (id.includes('zod') || id.includes('type-fest')) {
              return 'utils-vendor'
            }
            // Everything else goes into a shared vendor chunk
            return 'vendor'
          }
          // Package chunk (salvageunion-reference)
          if (id.includes('salvageunion-reference')) {
            return 'reference-data'
          }
          // Default: undefined means Vite will decide
          return undefined
        },
        // Optimize chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split('/')
                .pop()
                ?.replace(/\.[^.]*$/, '')
            : 'chunk'
          const sanitized = sanitizeFileName(facadeModuleId || 'chunk')
          return `assets/${sanitized}-[hash].js`
        },
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'entry'
          const sanitized = sanitizeFileName(name)
          return `assets/${sanitized}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset'
          const sanitized = sanitizeFileName(name)
          const ext = assetInfo.name?.split('.').pop() || 'bin'
          return `assets/${sanitized}-[hash].${ext}`
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (can be disabled for smaller builds)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  // Optimize dependencies
  optimizeDeps: {
    exclude: ['salvageunion-reference'],
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      '@supabase/supabase-js',
    ],
  },
  // Resolve configuration
  resolve: {
    alias: {
      // Ensure workspace package resolves correctly
      'salvageunion-reference': path.resolve(__dirname, '../../packages/salvageunion-reference'),
    },
  },
  // Cache configuration
  cacheDir: '.vite',
}))
