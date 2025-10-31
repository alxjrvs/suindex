import { Flex } from '@chakra-ui/react'
import type { EntityDisplaySubProps } from './types'
import { Text } from '../../base/Text'
import {
  getCargoCapacity,
  getEnergyPoints,
  getHeatCapacity,
  getModuleSlots,
  getSalvageValue,
  getSlotsRequired,
  getStructurePoints,
  getSystemSlots,
  isAbility,
} from 'salvageunion-reference'
import { StatDisplay } from '../../StatDisplay'

export function EntityRightHeaderContent({
  data,
  compact,
  rightLabel,
  collapsible,
  isExpanded,
}: EntityDisplaySubProps & { isExpanded: boolean; collapsible: boolean; rightLabel?: string }) {
  const description = 'description' in data ? data.description : undefined
  const slotsRequired = getSlotsRequired(data)
  const salvageValue = getSalvageValue(data)
  const structurePoints = getStructurePoints(data)
  const energyPoints = getEnergyPoints(data)
  const heatCapacity = getHeatCapacity(data)
  const systemSlots = getSystemSlots(data)
  const moduleSlots = getModuleSlots(data)
  const cargoCapacity = getCargoCapacity(data)

  const abilityContent = description && isAbility(data) && (
    <Text
      color="su.white"
      fontStyle="italic"
      textAlign="right"
      fontWeight="medium"
      maxH="60px"
      minW="0"
      fontSize={compact ? '2xs' : 'sm'}
      flexShrink="1"
      whiteSpace="normal"
      lineHeight="shorter"
      maxW={compact ? '150px' : undefined}
      flexWrap="wrap"
      overflow="hidden"
    >
      {description}
    </Text>
  )

  const statsContent = (
    <Flex gap={1} justifyContent="flex-end">
      {slotsRequired && (
        <StatDisplay
          label="Slots"
          bottomLabel={compact ? '' : 'Required'}
          value={slotsRequired}
          compact={compact}
        />
      )}
      {structurePoints && (
        <StatDisplay
          label={compact ? 'SP' : 'Structure'}
          bottomLabel={compact ? '' : 'Points'}
          value={structurePoints}
          compact={compact}
        />
      )}
      {energyPoints && (
        <StatDisplay
          label={compact ? 'EP' : 'Energy'}
          bottomLabel={compact ? '' : 'Points'}
          value={energyPoints}
          compact={compact}
        />
      )}
      {salvageValue && (
        <StatDisplay
          label={compact ? 'SV' : 'Salvge'}
          bottomLabel={compact ? '' : 'Value'}
          value={salvageValue}
          compact={compact}
        />
      )}
      {systemSlots && (
        <StatDisplay
          label={compact ? 'Sys' : 'System'}
          bottomLabel={compact ? 'Slts' : 'Slots'}
          value={systemSlots}
          compact={compact}
        />
      )}
      {moduleSlots && (
        <StatDisplay
          label={compact ? 'Mod' : 'Module'}
          bottomLabel={compact ? 'Slts' : 'Slots'}
          value={moduleSlots}
          compact={compact}
        />
      )}
      {cargoCapacity && (
        <StatDisplay
          label={compact ? 'Crgo' : 'Cargo'}
          bottomLabel={compact ? 'Cap' : 'Capacity'}
          value={cargoCapacity}
          compact={compact}
        />
      )}
      {heatCapacity && (
        <StatDisplay
          label="Heat"
          bottomLabel={compact ? 'Cap' : 'Capacity'}
          value={heatCapacity}
          compact={compact}
        />
      )}
    </Flex>
  )

  if (!abilityContent && !statsContent && !rightLabel && !collapsible) {
    return null
  }

  return (
    <>
      {abilityContent}
      {statsContent}
      {rightLabel && (
        <Text
          variant="pseudoheader"
          fontSize="lg"
          flexShrink={1}
          textAlign="right"
          overflow="hidden"
          flexWrap="wrap"
        >
          {rightLabel}
        </Text>
      )}
      {collapsible && (
        <Flex
          alignItems="center"
          justifyContent="center"
          minW="25px"
          alignSelf="center"
          flexShrink={0}
        >
          <Text color="su.white" fontSize="lg">
            {isExpanded ? '▼' : '▶'}
          </Text>
        </Flex>
      )}
    </>
  )
}
