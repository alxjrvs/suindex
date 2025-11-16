import { getSchemaCatalog, SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'

/**
 * Generate all static paths for prerendering
 * This includes all schema index pages and item detail pages
 */
export function getStaticPaths() {
  const catalog = getSchemaCatalog()
  const paths: string[] = []

  paths.push('/')

  paths.push('/404')

  for (const schema of catalog.schemas) {
    paths.push(`/schema/${schema.id}`)

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

  sitemap: {
    hostname: 'https://suindex.pages.dev',
    getEntry: (route: string) => {
      if (route === '/') {
        return { priority: 1.0, changefreq: 'weekly' as const }
      }

      if (route.match(/^\/schema\/[^/]+\/?$/)) {
        return { priority: 0.8, changefreq: 'monthly' as const }
      }

      if (route.match(/^\/schema\/[^/]+\/item\//)) {
        return { priority: 0.6, changefreq: 'yearly' as const }
      }

      return { priority: 0.5, changefreq: 'monthly' as const }
    },
  },

  robots: {
    allow: '/',
    disallow: ['/dashboard', '/api'],
    sitemap: 'https://suindex.pages.dev/sitemap.xml',
  },
}
