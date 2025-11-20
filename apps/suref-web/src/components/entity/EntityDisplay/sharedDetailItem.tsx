import type { DataValue } from '../../../types/common'
import type { SURefObjectDataValue } from 'salvageunion-reference'
import { ActivationCostBox } from '../../shared/ActivationCostBox'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { ValueDisplay } from '../../shared/ValueDisplay'

/**
 * Shared DetailItem component for rendering DataValue items
 * Accepts both DataValue (from types/common) and SURefObjectDataValue (from salvageunion-reference)
 * Used by EntitySubTitleContent, NestedActionDisplay, NestedChassisAbility, and ContentBlockRenderer
 */
export function SharedDetailItem({
  item,
  compact = false,
}: {
  item: DataValue | SURefObjectDataValue
  compact?: boolean
}) {
  if (item.type === 'cost') {
    // If value is provided, use it as currency; otherwise parse from label
    let cost = item.label
    let currency = item.value

    if (!currency && typeof item.label === 'string') {
      // Parse label like "1 AP" or "X EP" to extract cost and currency
      const parts = item.label.trim().split(/\s+/)
      if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1]
        if (lastPart === 'AP' || lastPart === 'EP' || lastPart === 'XP') {
          cost = parts.slice(0, -1).join(' ')
          currency = lastPart
        }
      }
    }

    return <ActivationCostBox cost={cost} currency={currency} compact={compact} />
  }

  if (item.type === 'trait') {
    return (
      <EntityDetailDisplay
        label={item.label}
        value={item.value}
        compact={compact}
        schemaName="traits"
        inline={false}
      />
    )
  }

  if (item.type === 'keyword') {
    return (
      <EntityDetailDisplay
        label={item.label}
        value={item.value}
        compact={compact}
        schemaName="keywords"
        inline={false}
      />
    )
  }

  if (item.type === 'meta') {
    return <ValueDisplay label={item.label} compact={compact} inline={false} />
  }

  return <ValueDisplay label={item.label} value={item.value} compact={compact} inline={false} />
}
