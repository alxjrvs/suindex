import type { SURefMetaEntity, SURefMetaTrait, SURefMetaSchemaName } from 'salvageunion-reference'
import { Text } from '../../base/Text'
import type { DataValue } from '../../../types/common'
import { ActivationCostBox } from '../../shared/ActivationCostBox'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { getActivationCurrency } from '../entityDisplayHelpers'
import type { EntityDisplaySubProps } from './types'
import { ValueDisplay } from '../../shared/ValueDisplay'
import { Flex } from '@chakra-ui/react'

export function EntitySubTitleElement({ data, schemaName, compact }: EntityDisplaySubProps) {
  const values = extractDetails(data, schemaName)
  if (values.length === 0) return null

  return (
    <Flex gap={compact ? 0.5 : 1}>
      {values.map((item, index) => (
        <DetailItem key={index} item={item} compact={compact} />
      ))}
    </Flex>
  )
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(data: SURefMetaEntity, schemaName?: SURefMetaSchemaName): DataValue[] {
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

  const isGeneric = schemaName === 'abilities' && 'level' in data && data.level === 'G'
  // Action type
  if ('actionType' in data && data.actionType) {
    const actionType = data.actionType.includes('action')
      ? data.actionType
      : `${data.actionType} Action`
    details.push({ label: actionType, value: isGeneric ? 'Pilot' : '', type: 'keyword' })
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
  const traits: SURefMetaTrait[] = 'traits' in data && data.traits?.length ? data.traits : []
  traits.forEach((t: SURefMetaTrait) => {
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

  return <ValueDisplay label={item.label} value={item.value} compact={compact} />
}
