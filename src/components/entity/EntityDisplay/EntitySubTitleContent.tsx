import type { SURefMetaEntity, SURefMetaTrait, SURefSchemaName } from 'salvageunion-reference'
import {
  getActivationCost,
  getActionType,
  getRange,
  getDamage,
  getTraits,
} from 'salvageunion-reference'
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
function extractActivationCostDetail(
  data: SURefMetaEntity,
  schemaName?: SURefSchemaName
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
function extractActionTypes(data: SURefMetaEntity, schemaName?: SURefSchemaName): DataValue[] {
  const details: DataValue[] = []
  const isGeneric = schemaName === 'abilities' && 'level' in data && data.level === 'G'

  const actionType = getActionType(data)
  if (actionType) {
    details.push({
      label: actionType,
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
  return traits.map((t: SURefMetaTrait) => {
    const label = t.type.charAt(0).toUpperCase() + t.type.slice(1)
    const value = 'amount' in t && t.amount !== undefined ? t.amount : undefined
    return { label, value, type: 'trait' }
  })
}

/**
 * Extract details for header (activation cost, range, damage, traits)
 */
function extractDetails(data: SURefMetaEntity, schemaName?: SURefSchemaName): DataValue[] {
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

  if (item.type === 'meta') {
    return <ValueDisplay label={item.label} compact={compact} inline={false} />
  }

  return <ValueDisplay label={item.label} value={item.value} compact={compact} inline={false} />
}
