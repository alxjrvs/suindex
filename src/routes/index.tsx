import { createFileRoute } from '@tanstack/react-router'
import { getSchemaCatalog } from 'salvageunion-reference'
import { RulesReferenceLanding } from '../components/Reference/RulesReferenceLanding'
import { ReferenceError } from '../components/errors/ReferenceError'

const schemaIndexData = getSchemaCatalog()

function IndexPage() {
  const { schemas } = Route.useLoaderData()
  return <RulesReferenceLanding schemas={schemas} />
}

export const Route = createFileRoute('/')({
  component: IndexPage,
  errorComponent: ReferenceError,
  loader: () => {
    return { schemas: schemaIndexData.schemas }
  },
  head: () => ({
    meta: [
      {
        title: 'SUindex - Salvage Union Reference & Tools',
      },
      {
        name: 'description',
        content:
          'Complete reference guide and interactive tools for Salvage Union TTRPG. Browse chassis, systems, modules, abilities, and more.',
      },
      {
        property: 'og:title',
        content: 'SUindex - Salvage Union Reference & Tools',
      },
      {
        property: 'og:description',
        content:
          'Complete reference guide and interactive tools for Salvage Union TTRPG. Browse chassis, systems, modules, abilities, and more.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
  }),
  staticData: {
    ssr: true,
    prerender: true,
  },
})
