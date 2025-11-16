import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import type { SURefChassis } from 'salvageunion-reference'
import { getSystemSlots, getModuleSlots, getCargoCapacity } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface ChassisStatsGridProps {
  chassis: SURefChassis | undefined
  usedSystemSlots: number
  usedModuleSlots: number
  totalCargo: number
  disabled?: boolean
  totalSalvageValue: number
}

export function ChassisStatsGrid({
  chassis,
  usedSystemSlots,
  usedModuleSlots,
  totalCargo,
  totalSalvageValue,
  disabled = false,
}: ChassisStatsGridProps) {
  return (
    <RoundedBox bg="su.green" h="full" flex="1" disabled={disabled}>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        w="full"
        h="full"
        alignItems="center"
      >
        <StatDisplay
          label="System"
          bottomLabel="Slots"
          value={usedSystemSlots}
          outOfMax={chassis ? (getSystemSlots(chassis) ?? 0) : 0}
          disabled={disabled}
        />
        <StatDisplay
          label="Module"
          bottomLabel="Slots"
          value={usedModuleSlots}
          outOfMax={chassis ? (getModuleSlots(chassis) ?? 0) : 0}
          disabled={disabled}
        />
        <StatDisplay
          label="Cargo"
          bottomLabel="Cap"
          value={totalCargo}
          outOfMax={chassis ? (getCargoCapacity(chassis) ?? 0) : 0}
          disabled={disabled}
        />
        <StatDisplay label="Total" bottomLabel="SV" value={totalSalvageValue} disabled={disabled} />
      </Flex>
    </RoundedBox>
  )
}
