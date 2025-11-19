import type { SURefMetaEntity, SURefObjectTrait, SURefEnumSchemaName } from 'salvageunion-reference'
import {
  getActivationCost,
  getActionType,
  getRange,
  getDamage,
  getTraits,
} from 'salvageunion-reference'
import type { DataValue } from '../../../types/common'
import { getActivationCurrency } from '../entityDisplayHelpers'
import { Flex } from '@chakra-ui/react'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { SharedDetailItem, formatActionType } from './sharedDetailItem'

export function EntitySubTitleElement() {
  const { data, schemaName, spacing, compact } = useEntityDisplayContext()
  const values = extractDetails(data, schemaName)
  if (values.length === 0) return null

  return (
    <Flex gap={spacing.minimalGap} flexWrap="wrap">
      {values.map((item, index) => (
        <SharedDetailItem key={index} item={item} compact={compact} />
      ))}
    </Flex>
  )
}

/**
 * Extract activation cost detail
 */
function extractActivationCostDetail(
  data: SURefMetaEntity,
  schemaName?: SURefEnumSchemaName
): DataValue | null {
  const activationCost = getActivationCost(data)
  if (activationCost === undefined) return null

  const variableCost = 'activationCurrency' in data && schemaName === 'abilities'
  const activationCurrency = getActivationCurrency(schemaName, variableCost)
  const isVariable = String(activationCost).toLowerCase() === 'variable'
  const costValue = isVariable
    ? `X ${activationCurrency}`
    : `${activationCost} ${activationCurrency}`

  return { label: costValue, type: 'cost' }
}

/**
 * Extract action type details
 */
function extractActionTypes(data: SURefMetaEntity, schemaName?: SURefEnumSchemaName): DataValue[] {
  const details: DataValue[] = []
  const isGeneric = schemaName === 'abilities' && 'level' in data && data.level === 'G'

  const actionType = getActionType(data)
  if (actionType) {
    details.push({
      label: formatActionType(actionType),
      value: isGeneric ? 'Pilot' : undefined,
      type: 'keyword',
    })
  }

  if ('mechActionType' in data && data.mechActionType) {
    const mechActionType = formatActionType(data.mechActionType)
    details.push({ label: mechActionType, value: 'Mech', type: 'keyword' })
  }

  return details
}

/**
 * Extract range detail
 */
function extractRangeDetail(data: SURefMetaEntity): DataValue[] | null {
  const range = getRange(data)
  if (!range) return null

  const ranges = Array.isArray(range) ? range : [range]
  return ranges.map((r) => ({ label: 'Range', value: r, type: 'keyword' }))
}

/**
 * Extract damage detail
 */
function extractDamageDetail(data: SURefMetaEntity): DataValue | null {
  const damage = getDamage(data)
  if (!damage) return null
  return {
    label: 'Damage',
    value: `${damage.amount}${damage.damageType ?? 'HP'}`,
  }
}

/**
 * Extract trait details
 */
function extractTraitDetails(data: SURefMetaEntity): DataValue[] {
  const traits = getTraits(data)
  if (!traits || traits.length === 0) return []
  return traits.map((t: SURefObjectTrait) => {
    const label = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const value = 'amount' in t && t.amount !== undefined ? t.amount : undefined
    return { label, value, type: 'trait' }
  })
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(data: SURefMetaEntity, schemaName?: SURefEnumSchemaName): DataValue[] {
  const details: DataValue[] = []

  const activationCost = extractActivationCostDetail(data, schemaName)
  if (activationCost) details.push(activationCost)

  details.push(...extractActionTypes(data, schemaName))

  const ranges = extractRangeDetail(data)
  if (ranges) ranges.map((r) => details.push(r))

  const damage = extractDamageDetail(data)
  if (damage) details.push(damage)

  details.push(...extractTraitDetails(data))

  return details
}
