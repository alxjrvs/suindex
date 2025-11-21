import {
  SalvageUnionReference,
  EntitySchemaNames,
  type SURefEnumSchemaName,
  type EntitySchemaName,
} from 'salvageunion-reference'
import { EntityDisplayTooltip } from './EntityDisplayTooltip'
import { ValueDisplay } from '@/components/shared/ValueDisplay'
import { useMemo } from 'react'
import { useEntityDisplayContext } from './EntityDisplay/useEntityDisplayContext'
import { getTiltRotation } from '@/utils/tiltUtils'

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
  schemaName: SURefEnumSchemaName
  /** Whether to display inline (default: true). Set to false for flex container contexts. */
  inline?: boolean
}) {
  // Try to get damaged state from context if available
  // useEntityDisplayContext throws if not in context, so we need to handle that
  let damaged = false
  let valueRotation = 0

  // Always call hooks unconditionally - the hook will throw if not in context
  // but we can't conditionally call hooks, so we need a different approach
  // We'll check if context exists and use it, otherwise default to false
  const context = useEntityDisplayContext()
  damaged = context?.damaged ?? false
  valueRotation = useMemo(() => (damaged ? getTiltRotation() : 0), [damaged])

  const entity = useMemo(() => {
    // Only search in entity schemas (not meta schemas)
    if (EntitySchemaNames.has(schemaName as EntitySchemaName)) {
      return SalvageUnionReference.findIn(
        schemaName as EntitySchemaName,
        (t) => t.name.toLowerCase() === String(label).toLowerCase()
      )
    }
    return undefined
  }, [schemaName, label])
  const id = entity?.id

  if (!id) {
    return (
      <ValueDisplay
        label={label}
        value={value}
        compact={compact}
        inline={inline}
        damaged={damaged}
        rotation={valueRotation}
      />
    )
  }

  return (
    <EntityDisplayTooltip schemaName={schemaName} entityId={id} openDelay={300}>
      <ValueDisplay
        label={label}
        value={value}
        compact={compact}
        inline={inline}
        damaged={damaged}
        rotation={valueRotation}
      />
    </EntityDisplayTooltip>
  )
}
