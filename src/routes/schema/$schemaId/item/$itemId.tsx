import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog, SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'
import ItemShowPage from '../../../../components/ItemShowPage'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/schema/$schemaId/item/$itemId')({
  component: ItemShowPageComponent,
  loader: ({ params }) => {
    const schema = schemaIndexData.schemas.find((s) => s.id === params.schemaId)
    // Try to find the item in the schema
    let item = null
    let itemName = params.itemId
    if (schema) {
      try {
        item = SalvageUnionReference.findIn(
          params.schemaId as SURefSchemaName,
          (i) => i.id === params.itemId
        )
        if (item && 'name' in item) {
          itemName = item.name as string
        }
      } catch {
        // Item not found, use itemId as name
      }
    }
    return { schemas: schemaIndexData.schemas, schema, itemName }
  },
  validateSearch: (search: Record<string, unknown>): { pattern?: string; compact?: string } => {
    return {
      pattern: search.pattern ? String(search.pattern) : undefined,
      compact: search.compact ? String(search.compact) : undefined,
    }
  },
  head: ({ loaderData }) => {
    const schemaName = loaderData?.schema?.displayName || 'Item'
    const itemName = loaderData?.itemName || 'Unknown'
    return {
      meta: [
        {
          title: `${itemName} - ${schemaName} - SUindex`,
        },
        {
          name: 'description',
          content: `Detailed information about ${itemName} from ${schemaName} in Salvage Union TTRPG.`,
        },
        {
          property: 'og:title',
          content: `${itemName} - ${schemaName} - SUindex`,
        },
        {
          property: 'og:description',
          content: `Detailed information about ${itemName} from ${schemaName} in Salvage Union TTRPG.`,
        },
      ],
    }
  },
  staticData: {
    ssr: true, // SSR for reference pages
  },
})

function ItemShowPageComponent() {
  const { schemas } = Route.useLoaderData()
  return <ItemShowPage schemas={schemas} />
}
