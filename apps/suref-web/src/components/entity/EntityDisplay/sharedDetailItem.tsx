import type { DataValue } from '../../../types/common'
import { ActivationCostBox } from '../../shared/ActivationCostBox'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { ValueDisplay } from '../../shared/ValueDisplay'

/**
 * Format action type for display by appending " Action" where needed
 * - "Turn" → "Turn Action"
 * - "Long" → "Long Action"
 * - "Short" → "Short Action"
 * - "Free" → "Free Action"
 * - "Passive" → "Passive" (no change)
 * - "Reaction" → "Reaction" (no change)
 * - Already includes "action" → unchanged
 */
// eslint-disable-next-line react-refresh/only-export-components
export function formatActionType(actionType: string): string {
  const actionTypeLower = actionType.toLowerCase()

  // Don't append "Action" if it already includes "action" or is Passive/Reaction
  if (
    actionTypeLower.includes('action') ||
    actionTypeLower === 'passive' ||
    actionTypeLower === 'reaction'
  ) {
    return actionType
  }

  return `${actionType} Action`
}

/**
 * Shared DetailItem component for rendering DataValue items
 * Used by both EntitySubTitleContent and NestedActionDisplay
 */
export function SharedDetailItem({
  item,
  compact = false,
}: {
  item: DataValue
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
