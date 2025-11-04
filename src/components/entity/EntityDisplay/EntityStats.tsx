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
} from 'salvageunion-reference'
import type { EntityDisplaySubProps } from './types'

export function EntityStats({ data, compact }: EntityDisplaySubProps) {
  const slotsRequired = getSlotsRequired(data)
  const salvageValue = getSalvageValue(data)
  const structurePoints = getStructurePoints(data)
  const energyPoints = getEnergyPoints(data)
  const heatCapacity = getHeatCapacity(data)
  const systemSlots = getSystemSlots(data)
  const moduleSlots = getModuleSlots(data)
  const cargoCapacity = getCargoCapacity(data)
  const hitPoints = getHitPoints(data)
  console.log('Hit Points', hitPoints)
  return (
    <Flex gap={1} justifyContent="flex-end">
      <StatDisplay
        label="Slots"
        bottomLabel={compact ? '' : 'Required'}
        value={slotsRequired}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'SP' : 'Structure'}
        bottomLabel={compact ? '' : 'Points'}
        value={structurePoints}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'HP' : 'Hit'}
        bottomLabel={compact ? '' : 'Points'}
        value={hitPoints}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'EP' : 'Energy'}
        bottomLabel={compact ? '' : 'Points'}
        value={energyPoints}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'SV' : 'Salvge'}
        bottomLabel={compact ? '' : 'Value'}
        value={salvageValue}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Sys' : 'System'}
        bottomLabel={compact ? 'Slts' : 'Slots'}
        value={systemSlots}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Mod' : 'Module'}
        bottomLabel={compact ? 'Slts' : 'Slots'}
        value={moduleSlots}
        compact={compact}
      />
      <StatDisplay
        label={compact ? 'Crgo' : 'Cargo'}
        bottomLabel={compact ? 'Cap' : 'Capacity'}
        value={cargoCapacity}
        compact={compact}
      />
      <StatDisplay
        label="Heat"
        bottomLabel={compact ? 'Cap' : 'Capacity'}
        value={heatCapacity}
        compact={compact}
      />
    </Flex>
  )
}
