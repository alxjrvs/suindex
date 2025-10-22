import { Text } from '@chakra-ui/react'
import type { Traits } from 'salvageunion-reference'
import { formatTraits } from '../../utils/displayUtils'

interface ItemDetailsDisplayProps {
  damage?: { amount: number | string; type: string }
  range?: string | number
  actionType?: string
  traits?: Traits | Array<{ type: string; amount?: number }>
  color?: string
}

/**
 * Standardized component for displaying item details (Damage, Range, Action Type, Traits)
 * Used in abilities, sub-abilities, systems, modules, and other game items
 * Ensures consistent formatting across all display components
 */
export function ItemDetailsDisplay({
  color = 'su.black',
  damage,
  range,
  actionType,
  traits,
}: ItemDetailsDisplayProps) {
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

  if (traits) {
    parts.push(formatTraits(traits).join(', '))
  }

  return (
    <Text fontSize="sm" color={color} fontWeight="bold">
      {parts.join(' • ')}
    </Text>
  )
}
