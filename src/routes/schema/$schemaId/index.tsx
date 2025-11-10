import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'
import SchemaViewer from '../../../components/schema/SchemaViewer'
import { ReferenceError } from '../../../components/errors/ReferenceError'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/schema/$schemaId/')({
  component: SchemaViewerPage,
  errorComponent: ReferenceError,
  loader: ({ params }) => {
    const schema = schemaIndexData.schemas.find((s) => s.id === params.schemaId)
    return { schemas: schemaIndexData.schemas, schema }
  },
  head: ({ loaderData }) => {
    const schemaName = loaderData?.schema?.displayName || 'Schema'
    return {
      meta: [
        {
          title: `${schemaName} - SUindex`,
        },
        {
          name: 'description',
          content: `Browse all ${schemaName} in Salvage Union. Complete reference with stats, abilities, and details.`,
        },
        {
          property: 'og:title',
          content: `${schemaName} - SUindex`,
        },
        {
          property: 'og:description',
          content: `Browse all ${schemaName} in Salvage Union. Complete reference with stats, abilities, and details.`,
        },
      ],
    }
  },
  staticData: {
    ssr: true, // SSR for reference pages
    prerender: true, // Prerender at build time for instant loads
  },
})

function SchemaViewerPage() {
  const { schemas } = Route.useLoaderData()
  return <SchemaViewer schemas={schemas} />
}
