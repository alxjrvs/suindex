/**
 * Image optimization utilities for SSR pages
 */

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
}

/**
 * Generate optimized image URL for Supabase storage
 * Uses Supabase's image transformation API
 */
export function getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
  // If not a Supabase URL, return as-is
  if (!url.includes('supabase')) {
    return url
  }

  const { width, height, quality = 80, format = 'webp' } = options

  // Parse the URL
  const urlObj = new URL(url)
  const params = new URLSearchParams()

  // Add transformation parameters
  if (width) params.set('width', width.toString())
  if (height) params.set('height', height.toString())
  params.set('quality', quality.toString())
  params.set('format', format)

  // Append parameters to URL
  urlObj.search = params.toString()
  return urlObj.toString()
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(url: string, widths: number[] = [320, 640, 960, 1280]): string {
  return widths.map((width) => `${getOptimizedImageUrl(url, { width })} ${width}w`).join(', ')
}

/**
 * Get image dimensions from URL or return defaults
 */
export function getImageDimensions(_url: string): { width: number; height: number } {
  // Default dimensions for mech/pilot/crawler images
  return {
    width: 400,
    height: 400,
  }
}

/**
 * Preload critical images for SSR
 */
export function preloadImage(url: string, options: ImageOptimizationOptions = {}) {
  const optimizedUrl = getOptimizedImageUrl(url, options)
  return {
    rel: 'preload',
    as: 'image',
    href: optimizedUrl,
    type: `image/${options.format || 'webp'}`,
  }
}

/**
 * Generate Open Graph image URL
 */
export function getOgImageUrl(url: string): string {
  return getOptimizedImageUrl(url, {
    width: 1200,
    height: 630,
    quality: 85,
    format: 'jpeg', // OG images should be JPEG for compatibility
  })
}
