import { SalvageUnionReference, type SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplayTooltip } from './EntityDisplayTooltip'
import { ValueDisplay } from '../shared/ValueDisplay'
import { useMemo } from 'react'

export function EntityDetailDisplay({
  label,
  value,
  schemaName,
  compact = false,
  inline = true,
}: {
  value?: number | string
  label: number | string
  compact?: boolean
  schemaName: SURefSchemaName
  /** Whether to display inline (default: true). Set to false for flex container contexts. */
  inline?: boolean
}) {
  console.log(`[EntityDetailDisplay] Rendering for label="${label}", schema="${schemaName}"`)

  // Find entity by name (case-insensitive) to get its ID for tooltip
  const entity = useMemo(() => {
    console.log(
      `[EntityDetailDisplay] Looking up entity for label="${label}" in schema="${schemaName}"`
    )
    const found = SalvageUnionReference.findIn(
      schemaName,
      (t) => t.name.toLowerCase() === String(label).toLowerCase()
    )
    console.log(
      `[EntityDetailDisplay] Entity lookup result:`,
      found ? `Found: ${found.id}` : 'Not found'
    )
    return found
  }, [schemaName, label])
  const id = entity?.id

  if (!id) {
    console.log(`[EntityDetailDisplay] No entity ID found, rendering plain ValueDisplay`)
    return <ValueDisplay label={label} value={value} compact={compact} inline={inline} />
  }

  console.log(`[EntityDetailDisplay] Rendering with tooltip for entity ID="${id}"`)
  return (
    <EntityDisplayTooltip schemaName={schemaName} entityId={id} openDelay={300}>
      <ValueDisplay label={label} value={value} compact={compact} inline={inline} />
    </EntityDisplayTooltip>
  )
}
