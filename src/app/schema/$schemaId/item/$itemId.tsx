import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'
import ItemShowPage from '../../../../components/ItemShowPage'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/schema/$schemaId/item/$itemId')({
  component: ItemShowPageComponent,
  loader: () => {
    return { schemas: schemaIndexData.schemas }
  },
  validateSearch: (search: Record<string, unknown>): { pattern?: string; compact?: string } => {
    return {
      pattern: search.pattern ? String(search.pattern) : undefined,
      compact: search.compact ? String(search.compact) : undefined,
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
