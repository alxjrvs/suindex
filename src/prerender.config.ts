import { getSchemaCatalog, SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'

/**
 * Generate all static paths for prerendering
 * This includes all schema index pages and item detail pages
 */
export function getStaticPaths() {
  const catalog = getSchemaCatalog()
  const paths: string[] = []

  // Add landing page
  paths.push('/')

  // Add 404 page
  paths.push('/404')

  // Add all schema index pages
  for (const schema of catalog.schemas) {
    paths.push(`/schema/${schema.id}`)

    // Add all item detail pages for this schema
    try {
      const items = SalvageUnionReference.findAllIn(schema.id as SURefSchemaName, () => true)
      for (const item of items) {
        if ('id' in item && item.id) {
          paths.push(`/schema/${schema.id}/item/${item.id}`)
        }
      }
    } catch (error) {
      console.warn(`Could not load items for schema ${schema.id}:`, error)
    }
  }

  return paths
}

/**
 * Prerender configuration for TanStack Start
 */
export const prerenderConfig = {
  routes: getStaticPaths(),
  // Generate sitemap with SEO optimization
  sitemap: {
    hostname: 'https://suindex.pages.dev',
    getEntry: (route: string) => {
      // Home page - highest priority, updated weekly
      if (route === '/') {
        return { priority: 1.0, changefreq: 'weekly' as const }
      }
      // Schema index pages - high priority, updated monthly
      if (route.match(/^\/schema\/[^/]+\/?$/)) {
        return { priority: 0.8, changefreq: 'monthly' as const }
      }
      // Item detail pages - medium priority, rarely change
      if (route.match(/^\/schema\/[^/]+\/item\//)) {
        return { priority: 0.6, changefreq: 'yearly' as const }
      }
      // Default for any other routes
      return { priority: 0.5, changefreq: 'monthly' as const }
    },
  },
  // Generate robots.txt
  robots: {
    allow: '/',
    disallow: ['/dashboard', '/api'],
    sitemap: 'https://suindex.pages.dev/sitemap.xml',
  },
}
