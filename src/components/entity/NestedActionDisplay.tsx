import { Box, Flex, VStack } from '@chakra-ui/react'
import type { SURefMetaAction, SURefMetaEffect } from 'salvageunion-reference'
import {
  getActivationCost,
  getActionType,
  getRange,
  getDamage,
  getTraits,
  getEffects,
} from 'salvageunion-reference'
import { Text } from '../base/Text'
import { ActivationCostBox } from '../shared/ActivationCostBox'
import { ValueDisplay } from '../shared/ValueDisplay'
import { SheetDisplay } from '../shared/SheetDisplay'
import { EntityDetailDisplay } from './EntityDetailDisplay'
import { useParseTraitReferences } from '../../utils/parseTraitReferences'
import type { DataValue } from '../../types/common'

interface NestedActionDisplayProps {
  /** Action data from salvageunion-reference */
  data: SURefMetaAction
  /** Whether to use compact styling */
  compact?: boolean
}

/**
 * NestedActionDisplay - Renders sub-actions in a visually subordinate style
 *
 * Used for rendering nested actions from entity.actions arrays.
 * Visually distinct from EntityDisplay with:
 * - Border to separate from main content
 * - Simpler, more compact layout
 * - Lower visual priority than full EntityDisplay
 *
 * Matches the rulebook pattern where main abilities use EntityDisplay
 * and sub-actions use this component.
 */
export function NestedActionDisplay({ data, compact = false }: NestedActionDisplayProps) {
  const description = data.description
  const notes = data.notes
  const parsedDescription = useParseTraitReferences(description)
  const parsedNotes = useParseTraitReferences(notes)

  const details = extractActionDetails(data)
  const effects = getEffects(data)

  const fontSize = compact ? 'sm' : 'md'
  const titleFontSize = compact ? 'md' : 'lg'
  const spacing = compact ? 1 : 2

  const hasContent = description || notes || (effects && effects.length > 0)

  return (
    <Box
      border="2px solid"
      borderColor="su.black"
      borderRadius="md"
      bg="su.lightBlue"
      overflow="hidden"
    >
      <Flex bg="su.lightBlue" p={spacing} gap={spacing} alignItems="center" flexWrap="wrap">
        <Text
          fontSize={titleFontSize}
          fontWeight="bold"
          textTransform="uppercase"
          color="su.black"
          flex="1"
          minW="0"
        >
          {data.name}
        </Text>
      </Flex>

      {details.length > 0 && (
        <Flex gap={compact ? 0.5 : 1} flexWrap="wrap" alignItems="center" p={spacing} pt={0}>
          {details.map((item, index) => (
            <DetailItem key={index} item={item} compact={compact} />
          ))}
        </Flex>
      )}

      {hasContent && (
        <VStack
          gap={spacing}
          p={spacing}
          pt={details.length > 0 ? 0 : spacing}
          alignItems="stretch"
        >
          {description && (
            <Box
              color="su.black"
              fontWeight="normal"
              lineHeight="relaxed"
              fontStyle="italic"
              fontSize={fontSize}
            >
              {parsedDescription}
            </Box>
          )}
          {notes && (
            <Box
              color="su.black"
              fontWeight="medium"
              lineHeight="relaxed"
              fontStyle="italic"
              fontSize={fontSize}
            >
              {parsedNotes}
            </Box>
          )}
          {effects && effects.length > 0 && (
            <>
              {effects.map((effect, index) => (
                <EffectDisplay key={index} effect={effect} compact={compact} />
              ))}
            </>
          )}
        </VStack>
      )}
    </Box>
  )
}

/**
 * Extract action details for header display
 */
function extractActionDetails(data: SURefMetaAction): DataValue[] {
  const details: DataValue[] = []

  const activationCost = getActivationCost(data)
  if (activationCost !== undefined) {
    const costValue =
      String(activationCost).toLowerCase() === 'variable' ? 'X AP' : `${activationCost} AP`
    details.push({ label: costValue, type: 'cost' })
  }

  const actionType = getActionType(data)
  if (actionType) {
    details.push({ label: actionType, type: 'keyword' })
  }

  const range = getRange(data)
  if (range) {
    const ranges = Array.isArray(range) ? range : [range]
    ranges.forEach((r) => {
      details.push({ label: 'Range', value: r, type: 'keyword' })
    })
  }

  const damage = getDamage(data)
  if (damage) {
    details.push({
      label: 'Damage',
      value: `${damage.amount}${damage.damageType ?? 'HP'}`,
    })
  }

  const traits = getTraits(data)
  if (traits && traits.length > 0) {
    traits.forEach((t) => {
      const label = t.type.charAt(0).toUpperCase() + t.type.slice(1)
      const value = 'amount' in t && t.amount !== undefined ? t.amount : undefined
      details.push({ label, value, type: 'trait' })
    })
  }

  return details
}

/**
 * Render individual detail item
 */
function DetailItem({ item, compact }: { item: DataValue; compact: boolean }) {
  if (item.type === 'cost') {
    return <ActivationCostBox cost={item.label} currency="" compact={compact} />
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

  return <ValueDisplay label={item.label} value={item.value} compact={compact} inline={false} />
}

/**
 * Component to display an effect with parsed trait references
 */
function EffectDisplay({
  effect,
  compact = false,
}: {
  effect: SURefMetaEffect
  compact?: boolean
}) {
  const parsedValue = useParseTraitReferences(effect.value)

  return <SheetDisplay compact={compact} label={effect.label} children={parsedValue} />
}
