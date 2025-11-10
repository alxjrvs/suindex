import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'
import SchemaViewer from '../../../components/schema/SchemaViewer'

const schemaIndexData = getSchemaCatalog()

export const Route = createFileRoute('/schema/$schemaId/')({
  component: SchemaViewerPage,
  loader: () => {
    return { schemas: schemaIndexData.schemas }
  },
  staticData: {
    ssr: true, // SSR for reference pages
  },
})

function SchemaViewerPage() {
  const { schemas } = Route.useLoaderData()
  return <SchemaViewer schemas={schemas} />
}

