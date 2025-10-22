import { Box, Text, VStack } from '@chakra-ui/react'
import { TraitsDisplay } from './TraitsDisplay'
import type { Traits } from 'salvageunion-reference'

interface ItemDetailsDisplayProps {
  damage?: { amount: number | string; type: string }
  range?: string | number
  actionType?: string
  traits?: Traits | Array<{ type: string; amount?: number }>
  compact?: boolean
}

/**
 * Standardized component for displaying item details (Damage, Range, Action Type, Traits)
 * Used in abilities, sub-abilities, systems, modules, and other game items
 * Ensures consistent formatting across all display components
 */
export function ItemDetailsDisplay({
  damage,
  range,
  actionType,
  traits,
  compact = false,
}: ItemDetailsDisplayProps) {
  const hasDetails = damage || range || actionType || (traits && traits.length > 0)

  if (!hasDetails) {
    return null
  }

  if (compact) {
    // Compact inline display for sub-abilities
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

  // Full display for main items
  return (
    <VStack gap={2} alignItems="stretch">
      {damage && (
        <Box>
          <Text as="span" fontWeight="bold" color="su.brick">
            Damage:{' '}
          </Text>
          <Text as="span" color="su.black">
            {damage.amount}
            {damage.type}
          </Text>
        </Box>
      )}

      {range && (
        <Box>
          <Text as="span" fontWeight="bold" color="su.brick">
            Range:{' '}
          </Text>
          <Text as="span" color="su.black">
            {range}
          </Text>
        </Box>
      )}

      {actionType && (
        <Box>
          <Text as="span" fontWeight="bold" color="su.brick">
            Action Type:{' '}
          </Text>
          <Text as="span" color="su.black">
            {actionType}
          </Text>
        </Box>
      )}

      {traits && traits.length > 0 && <TraitsDisplay traits={traits} />}
    </VStack>
  )
}
