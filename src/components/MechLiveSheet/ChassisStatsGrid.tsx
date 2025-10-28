import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import type { SURefChassis } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface ChassisStatsGridProps {
  stats: SURefChassis['stats'] | undefined
  usedSystemSlots: number
  usedModuleSlots: number
  totalCargo: number
  disabled?: boolean
  totalSalvageValue: number
}

export function ChassisStatsGrid({
  stats,
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
          outOfMax={stats?.systemSlots || 0}
          disabled={disabled}
        />
        <StatDisplay
          label="Module"
          bottomLabel="Slots"
          value={usedModuleSlots}
          outOfMax={stats?.moduleSlots || 0}
          disabled={disabled}
        />
        <StatDisplay
          label="Cargo"
          bottomLabel="Cap"
          value={totalCargo}
          outOfMax={stats?.cargoCap || 0}
          disabled={disabled}
        />
        <StatDisplay label="Total" bottomLabel="SV" value={totalSalvageValue} disabled={disabled} />
      </Flex>
    </RoundedBox>
  )
}
