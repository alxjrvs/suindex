import { Box } from '@chakra-ui/react'
import type { SURefMetaChoice, SURefSchemaName } from 'salvageunion-reference'
import { lazy, Suspense } from 'react'
import { getModel } from '../../../utils/modelMap'

const EntityDisplay = lazy(() =>
  import('./index').then((module) => ({ default: module.EntityDisplay }))
)

export interface PreselectedEntityDisplayProps {
  choice: SURefMetaChoice
  selectedChoice: string | undefined
  compact: boolean
}

export function PreselectedEntityDisplay({
  choice,
  selectedChoice,
  compact,
}: PreselectedEntityDisplayProps) {
  const schema = choice.schema?.[0]
  if (!schema) return null

  const model = getModel(schema.toLowerCase())
  if (!model) return null

  const entity = model.find((e) => e.name === selectedChoice)
  if (!entity) return null

  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <EntityDisplay
        hideActions
        data={entity}
        schemaName={schema as SURefSchemaName}
        compact={compact}
        collapsible={false}
      />
    </Suspense>
  )
}
