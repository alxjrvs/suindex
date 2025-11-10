import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'
import { RulesReferenceLanding } from '../components/Reference/RulesReferenceLanding'

const schemaIndexData = getSchemaCatalog()

function IndexPage() {
  const { schemas } = Route.useLoaderData()
  return <RulesReferenceLanding schemas={schemas} />
}

export const Route = createFileRoute('/')({
  component: IndexPage,
  loader: () => {
    return { schemas: schemaIndexData.schemas }
  },
  staticData: {
    ssr: true,
  },
})
