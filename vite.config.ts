import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
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
  ],
  optimizeDeps: {
    exclude: ['salvageunion-reference'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'salvage-union': ['salvageunion-reference'],
        },
      },
      onwarn(warning, warn) {
        // Ignore sourcemap warnings for salvageunion-reference package
        // The package includes sourcemaps but not the source files
        if (
          warning.code === 'SOURCEMAP_ERROR' &&
          warning.message.includes('salvageunion-reference')
        ) {
          return
        }
        warn(warning)
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    sourcemap: 'hidden',
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
  },
})
