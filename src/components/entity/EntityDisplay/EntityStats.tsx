import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../../StatDisplay'
import {
  getSlotsRequired,
  getSalvageValue,
  getStructurePoints,
  getEnergyPoints,
  getHeatCapacity,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
  getHitPoints,
  type SURefMetaBonusPerTechLevel,
  type SURefMetaEntity,
} from 'salvageunion-reference'
import { Text } from '../../base/Text'
import type { EntityDisplaySubProps } from './types'

export function EntityStats({
  data,
  compact,
  label = '',
  prefix = '',
}: Omit<EntityDisplaySubProps, 'data'> & {
  data: SURefMetaEntity | SURefMetaBonusPerTechLevel
  label?: string
  prefix?: string
}) {
  // Type assertion: SURefMetaBonusPerTechLevel is SURefMetaStats which has the same structure
  // as the stats properties these functions expect
  const entityData = data as SURefMetaEntity

  const slotsRequired = getSlotsRequired(entityData)
  const salvageValue = getSalvageValue(entityData)
  const structurePoints = getStructurePoints(entityData)
  const energyPoints = getEnergyPoints(entityData)
  const heatCapacity = getHeatCapacity(entityData)
  const systemSlots = getSystemSlots(entityData)
  const moduleSlots = getModuleSlots(entityData)
  const cargoCapacity = getCargoCapacity(entityData)
  const hitPoints = getHitPoints(entityData)

  const applyLabel = (value: number | string | undefined) => {
    if (value === undefined) return undefined
    if (value === 0) return '-'
    return `${prefix}${value}`
  }

  return (
    <Flex gap={1} justifyContent="flex-end" alignItems="center">
      {label && (
        <Text variant="pseudoheader" fontSize={compact ? 'xs' : 'sm'}>
          {label}
        </Text>
      )}
      <StatDisplay
        label="Slots"
        bottomLabel={compact ? '' : 'Required'}
        value={applyLabel(slotsRequired)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'SP' : 'Structure'}
        bottomLabel={compact ? '' : 'Points'}
        value={applyLabel(structurePoints)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'HP' : 'Hit'}
        bottomLabel={compact ? '' : 'Points'}
        value={applyLabel(hitPoints)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'EP' : 'Energy'}
        bottomLabel={compact ? '' : 'Points'}
        value={applyLabel(energyPoints)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'SV' : 'Salvge'}
        bottomLabel={compact ? '' : 'Value'}
        value={applyLabel(salvageValue)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Sys' : 'System'}
        bottomLabel={compact ? 'Slts' : 'Slots'}
        value={applyLabel(systemSlots)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Mod' : 'Module'}
        bottomLabel={compact ? 'Slts' : 'Slots'}
        value={applyLabel(moduleSlots)}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Crgo' : 'Cargo'}
        bottomLabel={compact ? 'Cap' : 'Capacity'}
        value={applyLabel(cargoCapacity)}
        compact={compact}
      />
      <StatDisplay
        label="Heat"
        bottomLabel={compact ? 'Cap' : 'Capacity'}
        value={applyLabel(heatCapacity)}
        compact={compact}
      />
    </Flex>
  )
}
