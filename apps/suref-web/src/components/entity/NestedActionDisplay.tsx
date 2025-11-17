import { Box, Flex, VStack } from '@chakra-ui/react'
import type { SURefMetaAction, SURefMetaChoice } from 'salvageunion-reference'
import { Text } from '../base/Text'
import { ActivationCostBox } from '../shared/ActivationCostBox'
import { ValueDisplay } from '../shared/ValueDisplay'
import { EntityDetailDisplay } from './EntityDetailDisplay'
import { ContentBlockRenderer } from './EntityDisplay/ContentBlockRenderer'
import { EntityChoice } from './EntityDisplay/EntityChoice'
import type { DataValue } from '../../types/common'

interface NestedActionDisplayProps {
  /** Action data from salvageunion-reference */
  data: SURefMetaAction
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether this is the last item in a list (affects bottom border) */
  isLast?: boolean
  /** Whether to hide the action content/description */
  hideContent?: boolean
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
export function NestedActionDisplay({
  data,
  compact = false,
  isLast = false,
  hideContent = false,
}: NestedActionDisplayProps) {
  const details = extractActionDetails(data)

  // Match EntityDisplay fontSize.sm: compact ? 'xs' : 'sm'
  const fontSize = compact ? 'xs' : 'sm'
  const titleFontSize = compact ? 'sm' : 'xl'
  const spacing = compact ? 1 : 2
  const headerPadding = compact ? { px: 0.5, py: 0.25 } : { px: 1, py: 0.5 }

  const hasContent = data.content && data.content.length > 0
  const actionChoices: SURefMetaChoice[] = data.choices || []
  const hasChoices = actionChoices.length > 0

  return (
    <Box bg="su.lightBlue" overflow="hidden" pb={isLast ? 0 : spacing} position="relative">
      {!isLast && (
        <Box position="absolute" bottom={0} left="10%" width="80%" height="2px" bg="su.black" />
      )}
      <Flex bg="su.lightBlue" p={spacing} gap={spacing} alignItems="center" flexWrap="wrap">
        <Text
          fontSize={titleFontSize}
          variant="pseudoheader"
          width="fit-content"
          {...headerPadding}
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

      {hasContent && !hideContent && (
        <VStack
          gap={spacing}
          p={spacing}
          pt={details.length > 0 ? 0 : spacing}
          alignItems="stretch"
        >
          <ContentBlockRenderer content={data.content!} fontSize={fontSize} compact={compact} />
        </VStack>
      )}

      {hasChoices && (
        <VStack
          gap={spacing}
          p={spacing}
          pt={hasContent && !hideContent ? 0 : details.length > 0 ? 0 : spacing}
          alignItems="stretch"
        >
          {actionChoices.map((choice) => (
            <EntityChoice
              key={choice.id}
              choice={choice}
              userChoices={undefined}
              onChoiceSelection={undefined}
            />
          ))}
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

  // Access activationCost directly from action
  const activationCost = data.activationCost
  if (activationCost !== undefined) {
    const costValue =
      String(activationCost).toLowerCase() === 'variable' ? 'X AP' : `${activationCost} AP`
    details.push({ label: costValue, type: 'cost' })
  }

  // Access actionType directly from action
  const actionType = data.actionType
  if (actionType) {
    details.push({ label: actionType, type: 'keyword' })
  }

  // Access range directly from action
  const range = data.range
  if (range) {
    const ranges = Array.isArray(range) ? range : [range]
    ranges.forEach((r) => {
      details.push({ label: 'Range', value: r, type: 'keyword' })
    })
  }

  // Access damage directly from action
  const damage = data.damage
  if (damage) {
    details.push({
      label: 'Damage',
      value: `${damage.amount}${damage.damageType ?? 'HP'}`,
    })
  }

  // Access traits directly from action
  const traits = data.traits
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
