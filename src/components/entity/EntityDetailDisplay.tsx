import { SalvageUnionReference, type SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplayTooltip } from './EntityDisplayTooltip'
import { ValueDisplay } from '../shared/ValueDisplay'

export function EntityDetailDisplay({
  label,
  value,
  schemaName,
  compact = false,
}: {
  value?: number | string
  label: number | string
  compact?: boolean
  schemaName: SURefSchemaName
}) {
  // Find entity by name (case-insensitive) to get its ID for tooltip
  const entity = SalvageUnionReference.findIn(
    schemaName,
    (t) => t.name.toLowerCase() === String(label).toLowerCase()
  )
  const id = entity?.id

  if (!id) return <ValueDisplay label={label} value={value} compact={compact} />

  return (
    <EntityDisplayTooltip schemaName={schemaName} entityId={id} openDelay={300}>
      <ValueDisplay label={label} value={value} compact={compact} />
    </EntityDisplayTooltip>
  )
}
