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
  const entity = useMemo(() => {
    const found = SalvageUnionReference.findIn(
      schemaName,
      (t) => t.name.toLowerCase() === String(label).toLowerCase()
    )
    return found
  }, [schemaName, label])
  const id = entity?.id

  if (!id) {
    return <ValueDisplay label={label} value={value} compact={compact} inline={inline} />
  }

  return (
    <EntityDisplayTooltip schemaName={schemaName} entityId={id} openDelay={300}>
      <ValueDisplay label={label} value={value} compact={compact} inline={inline} />
    </EntityDisplayTooltip>
  )
}
