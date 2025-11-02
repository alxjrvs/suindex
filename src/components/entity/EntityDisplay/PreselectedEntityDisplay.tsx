import type { SURefMetaChoice, SURefSchemaName } from 'salvageunion-reference'
import { getModel } from '../../../utils/modelMap'
import { EntityDisplay } from './index'

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
    <EntityDisplay
      hideActions
      data={entity}
      schemaName={schema as SURefSchemaName}
      compact={compact}
      collapsible={false}
    />
  )
}
