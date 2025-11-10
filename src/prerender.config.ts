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
  // Generate sitemap
  sitemap: {
    hostname: 'https://suindex.pages.dev', // Update with your actual domain
  },
}
