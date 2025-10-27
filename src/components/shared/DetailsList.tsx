import { Flex } from '@chakra-ui/react'
import { ActivationCostBox } from './ActivationCostBox'
import type { DataValue } from '../../types/common'
import { Text } from '../base/Text'
import type { SURefActionMetaList, SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { getActivationCurrency } from './entityDisplayHelpers'
import { formatTraits } from '../../utils/displayUtils'

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(
  data: SURefEntity | SURefActionMetaList,
  schemaName?: SURefSchemaName
): DataValue[] {
  const details: DataValue[] = []
  const variableCost = 'activationCurrency' in data && schemaName === 'abilities'
  const activationCurrency = getActivationCurrency(schemaName, variableCost)

  // Activation cost
  if ('activationCost' in data && data.activationCost !== undefined) {
    const isVariable = String(data.activationCost).toLowerCase() === 'variable'
    const costValue = isVariable
      ? `X ${activationCurrency}`
      : `${data.activationCost} ${activationCurrency}`
    details.push({ value: costValue, type: 'cost' })
  }

  // Action type
  if ('actionType' in data && data.actionType) {
    if ('mechActionType' in data && data.mechActionType) {
      const mechActionType = data.mechActionType.includes('action')
        ? data.mechActionType
        : `${data.mechActionType} Action`

      const actionType = data.actionType.includes('action')
        ? data.actionType
        : `${data.actionType} Action`

      details.push({ label: mechActionType, value: '(Mech)' })
      details.push({ label: actionType, value: '(Pilot)' })
    } else {
      const actionType = data.actionType.includes('action')
        ? data.actionType
        : `${data.actionType} Action`
      details.push({ value: actionType })
    }
  }

  // Range - no "Range:" prefix for abilities
  if ('range' in data && data.range) {
    details.push({ label: 'Range', value: data.range })
  }

  // Damage
  if ('damage' in data && data.damage) {
    details.push({
      label: 'Damage',
      value: `${data.damage.amount}${data.damage.type}`,
    })
  }

  // Traits
  const traits = 'traits' in data ? formatTraits(data.traits) : []
  traits.forEach((t) => {
    details.push({ value: t, type: 'trait' })
  })

  // Recommended (for modules)
  if ('recommended' in data && data.recommended) {
    details.push({ value: 'Recommended' })
  }

  return details
}
interface DetailsListProps {
  data: SURefEntity | SURefActionMetaList
  schemaName?: SURefSchemaName
  compact?: boolean
}

export function DetailsList({ schemaName, data, compact = false }: DetailsListProps) {
  const values = extractDetails(data, schemaName)
  if (values.length === 0) return null

  return (
    <Flex display="inline-flex" flexWrap="wrap" gap={compact ? 1 : 2} alignItems="center">
      {values.map((item, index) => (
        <DetailItem key={index} item={item} compact={compact} />
      ))}
    </Flex>
  )
}
const DetailWrapper = ({ children }: { children: React.ReactNode; compact: boolean }) => (
  <Flex display="inline-flex" alignItems="center" gap="0">
    {children}
  </Flex>
)

function DetailItem({ item, compact }: { item: DataValue; compact: boolean }) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const boldFontWeight = compact ? 'semibold' : 'bold'
  const fontSize = compact ? 'xs' : 'md'

  if (item.type === 'cost') {
    return (
      <DetailWrapper compact={compact}>
        <ActivationCostBox cost={item.value} currency="" compact={compact} />
      </DetailWrapper>
    )
  }

  if (item.type === 'trait') {
    return (
      <DetailWrapper compact={compact}>
        <Text variant="pseudoheader" as="span" fontWeight={boldFontWeight} fontSize={fontSize}>
          {item.value}
        </Text>
      </DetailWrapper>
    )
  }

  if (item.label) {
    return (
      <DetailWrapper compact={compact}>
        <Text variant="pseudoheader" as="span" fontWeight={semiFontWeight}>
          {item.label}
        </Text>
        <Text
          variant="pseudoheaderInverse"
          as="span"
          fontWeight={semiFontWeight}
          fontSize={fontSize}
        >
          {item.value}
        </Text>
      </DetailWrapper>
    )
  }

  return (
    <DetailWrapper compact={compact}>
      <Text variant="pseudoheader" fontWeight={boldFontWeight} fontSize={fontSize}>
        {item.value}
      </Text>
    </DetailWrapper>
  )
}
