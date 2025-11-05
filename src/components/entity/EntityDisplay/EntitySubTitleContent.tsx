import type { SURefMetaEntity, SURefMetaTrait, SURefMetaSchemaName } from 'salvageunion-reference'
import type { DataValue } from '../../../types/common'
import { ActivationCostBox } from '../../shared/ActivationCostBox'
import { EntityDetailDisplay } from '../EntityDetailDisplay'
import { getActivationCurrency } from '../entityDisplayHelpers'
import { ValueDisplay } from '../../shared/ValueDisplay'
import { Flex } from '@chakra-ui/react'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntitySubTitleElement() {
  const { data, schemaName, spacing } = useEntityDisplayContext()
  const values = extractDetails(data, schemaName)
  if (values.length === 0) return null

  return (
    <Flex gap={spacing.minimalGap} flexWrap="wrap">
      {values.map((item, index) => (
        <DetailItem key={index} item={item} />
      ))}
    </Flex>
  )
}

/**
 * Extract activation cost detail
 */
function extractActivationCost(
  data: SURefMetaEntity,
  schemaName?: SURefMetaSchemaName
): DataValue | null {
  if (!('activationCost' in data) || data.activationCost === undefined) return null

  const variableCost = 'activationCurrency' in data && schemaName === 'abilities'
  const activationCurrency = getActivationCurrency(schemaName, variableCost)
  const isVariable = String(data.activationCost).toLowerCase() === 'variable'
  const costValue = isVariable
    ? `X ${activationCurrency}`
    : `${data.activationCost} ${activationCurrency}`

  return { label: costValue, type: 'cost' }
}

/**
 * Extract action type details
 */
function extractActionTypes(data: SURefMetaEntity, schemaName?: SURefMetaSchemaName): DataValue[] {
  const details: DataValue[] = []
  const isGeneric = schemaName === 'abilities' && 'level' in data && data.level === 'G'

  if ('actionType' in data && data.actionType) {
    details.push({
      label: data.actionType,
      value: isGeneric ? 'Pilot' : undefined,
      type: 'keyword',
    })
  }

  if ('mechActionType' in data && data.mechActionType) {
    const mechActionType = data.mechActionType.includes('action')
      ? data.mechActionType
      : `${data.mechActionType} Action`
    details.push({ label: mechActionType, value: 'Mech', type: 'keyword' })
  }

  return details
}

/**
 * Extract range detail
 */
function extractRange(data: SURefMetaEntity): DataValue | null {
  if (!('range' in data) || !data.range) return null
  return { label: 'Range', value: data.range, type: 'keyword' }
}

/**
 * Extract damage detail
 */
function extractDamage(data: SURefMetaEntity): DataValue | null {
  if (!('damage' in data) || !data.damage) return null
  return {
    label: 'Damage',
    value: `${data.damage.amount}${data.damage.damageType ?? 'HP'}`,
  }
}

/**
 * Extract trait details
 */
function extractTraits(data: SURefMetaEntity): DataValue[] {
  const traits: SURefMetaTrait[] = 'traits' in data && data.traits?.length ? data.traits : []
  return traits.map((t: SURefMetaTrait) => {
    const label = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const value = 'amount' in t && t.amount !== undefined ? t.amount : undefined
    return { label, value, type: 'trait' }
  })
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(data: SURefMetaEntity, schemaName?: SURefMetaSchemaName): DataValue[] {
  const details: DataValue[] = []

  // Activation cost
  const activationCost = extractActivationCost(data, schemaName)
  if (activationCost) details.push(activationCost)

  // Action types
  details.push(...extractActionTypes(data, schemaName))

  // Range
  const range = extractRange(data)
  if (range) details.push(range)

  // Damage
  const damage = extractDamage(data)
  if (damage) details.push(damage)

  // Traits
  details.push(...extractTraits(data))

  return details
}

function DetailItem({ item }: { item: DataValue }) {
  const { compact } = useEntityDisplayContext()

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
    return <ValueDisplay label={item.label} compact={compact} />
  }

  return <ValueDisplay label={item.label} value={item.value} compact={compact} />
}
