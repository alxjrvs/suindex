import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog, SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'
import ItemShowPage from '../../../../components/ItemShowPage'
import { ReferenceError } from '../../../../components/errors/ReferenceError'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/schema/$schemaId/item/$itemId')({
  component: ItemShowPageComponent,
  errorComponent: ReferenceError,
  loader: ({ params }) => {
    const schema = schemaIndexData.schemas.find((s) => s.id === params.schemaId)

    let item = null
    let itemName = params.itemId
    let itemDescription = ''
    if (schema) {
      try {
        item = SalvageUnionReference.findIn(
          params.schemaId as SURefSchemaName,
          (i) => i.id === params.itemId
        )
        if (item && 'name' in item) {
          itemName = item.name as string
        }
        if (item && 'description' in item && typeof item.description === 'string') {
          itemDescription = item.description
        }
      } catch {
        // Ignore errors when item not found
      }
    }
    return { schemas: schemaIndexData.schemas, schema, itemName, itemDescription, item }
  },
  validateSearch: (search: Record<string, unknown>): { pattern?: string; compact?: string } => {
    return {
      pattern: search.pattern ? String(search.pattern) : undefined,
      compact: search.compact ? String(search.compact) : undefined,
    }
  },
  head: ({ loaderData, params }) => {
    const schemaName = loaderData?.schema?.displayName || 'Item'
    const itemName = loaderData?.itemName || 'Unknown'
    const itemDescription = loaderData?.itemDescription || ''
    const item = loaderData?.item
    const schemaId = params.schemaId
    const itemId = params.itemId

    const metaDescription =
      itemDescription ||
      `Detailed information about ${itemName} from ${schemaName} in Salvage Union TTRPG.`

    const structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: itemName,
      description: metaDescription,
      url: `https://su-srd.pages.dev/schema/${schemaId}/item/${itemId}`,
      keywords: [
        'Salvage Union',
        'TTRPG',
        'SRD',
        'System Reference Document',
        schemaName,
        itemName,
      ],
      author: {
        '@type': 'Organization',
        name: 'Salvage Union SRD',
      },
    }

    if (item) {
      if ('source' in item && item.source) {
        structuredData.isPartOf = {
          '@type': 'Book',
          name: item.source as string,
        }
      }
      if ('page' in item && item.page) {
        structuredData.pagination = `Page ${item.page}`
      }

      if ('stats' in item && item.stats && typeof item.stats === 'object') {
        const stats = item.stats as Record<string, unknown>
        if ('techLevel' in stats && stats.techLevel) {
          structuredData.additionalProperty = {
            '@type': 'PropertyValue',
            name: 'Tech Level',
            value: stats.techLevel,
          }
        }
      }
    }

    return {
      meta: [
        {
          title: `${itemName} - ${schemaName} - Salvage Union System Reference Document`,
        },
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: `${itemName} - ${schemaName} - Salvage Union System Reference Document`,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    }
  },
  staticData: {
    ssr: true,
    prerender: true,
  },
})

function ItemShowPageComponent() {
  const { schemas, item } = Route.useLoaderData()
  return <ItemShowPage schemas={schemas} prefetchedItem={item} />
}
