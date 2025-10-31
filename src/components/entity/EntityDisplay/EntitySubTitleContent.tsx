import { Box } from '@chakra-ui/react'
import type { SURefMetaEntity, SURefSchemaName, SURefMetaTraits } from 'salvageunion-reference'
import { Text } from '../../base/Text'
import type { DataValue } from '../../../types/common'
import { ActivationCostBox } from '../../shared/ActivationCostBox'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { getActivationCurrency } from '../entityDisplayHelpers'
import type { EntityDisplaySubProps } from './types'

export function EntitySubTitleElement({ data, schemaName, compact }: EntityDisplaySubProps) {
  const values = extractDetails(data, schemaName)
  if (values.length === 0) return null

  return (
    <>
      {values.map((item, index) => (
        <DetailItem key={index} item={item} compact={compact} />
      ))}
    </>
  )
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(
  data: SURefMetaEntity,
  schemaName?: SURefSchemaName | 'actions'
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
    details.push({ label: costValue, type: 'cost' })
  }

  // Action type
  if ('actionType' in data && data.actionType) {
    const actionType = data.actionType.includes('action')
      ? data.actionType
      : `${data.actionType} Action`
    details.push({ label: actionType, value: 'Pilot', type: 'keyword' })
  }

  if ('mechActionType' in data && data.mechActionType) {
    const mechActionType = data.mechActionType.includes('action')
      ? data.mechActionType
      : `${data.mechActionType} Action`

    details.push({ label: mechActionType, value: 'Mech', type: 'keyword' })
  }

  // Range - no "Range:" prefix for abilities
  if ('range' in data && data.range) {
    details.push({ label: 'Range', value: data.range, type: 'keyword' })
  }

  // Damage
  if ('damage' in data && data.damage) {
    details.push({
      label: 'Damage',
      value: `${data.damage.amount}${data.damage.damageType ?? 'HP'}`,
    })
  }

  // Traits
  const traits: SURefMetaTraits = 'traits' in data && data.traits?.length ? data.traits : []
  traits.forEach((t) => {
    const label = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const value = 'amount' in t && t.amount !== undefined ? t.amount : undefined
    details.push({ label, value, type: 'trait' })
  })

  return details
}

function DetailItem({ item, compact }: { item: DataValue; compact: boolean }) {
  const semiFontWeight = compact ? 'normal' : 'semibold'
  const fontSize = compact ? 'xs' : 'md'

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
      />
    )
  }

  if (item.type === 'meta') {
    return (
      <Text variant="pseudoheaderInverse" as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
        {item.label}
      </Text>
    )
  }

  return (
    <Box display="inline-flex" gap={0}>
      <Text variant="pseudoheader" as="span" fontWeight={semiFontWeight} fontSize={fontSize}>
        {item.label}
      </Text>
      {item.value !== undefined && (
        <Text
          variant="pseudoheaderInverse"
          as="span"
          fontWeight={semiFontWeight}
          fontSize={fontSize}
        >
          {item.value}
        </Text>
      )}
    </Box>
  )
}
