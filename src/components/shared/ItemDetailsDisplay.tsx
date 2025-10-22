import { Text } from '@chakra-ui/react'
import type { Traits } from 'salvageunion-reference'

interface ItemDetailsDisplayProps {
  damage?: { amount: number | string; type: string }
  range?: string | number
  actionType?: string
  traits?: Traits | Array<{ type: string; amount?: number }>
}

/**
 * Standardized component for displaying item details (Damage, Range, Action Type, Traits)
 * Used in abilities, sub-abilities, systems, modules, and other game items
 * Ensures consistent formatting across all display components
 */
export function ItemDetailsDisplay({ damage, range, actionType, traits }: ItemDetailsDisplayProps) {
  const hasDetails = damage || range || actionType || (traits && traits.length > 0)

  if (!hasDetails) {
    return null
  }

  const parts: string[] = []

  if (damage) {
    parts.push(`${damage.amount}${damage.type}`)
  }
  if (range) {
    parts.push(`Range: ${range}`)
  }
  if (actionType) {
    parts.push(actionType)
  }

  return (
    <Text fontSize="sm" color="su.black">
      {parts.join(' • ')}
    </Text>
  )
}
