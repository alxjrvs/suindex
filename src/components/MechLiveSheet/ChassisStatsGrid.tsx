import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import type { Chassis } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'

interface ChassisStatsGridProps {
  stats: Chassis['stats'] | undefined
  usedSystemSlots: number
  usedModuleSlots: number
  totalCargo: number
}

export function ChassisStatsGrid({
  stats,
  usedSystemSlots,
  usedModuleSlots,
  totalCargo,
}: ChassisStatsGridProps) {
  return (
    <RoundedBox bg="su.green" padding={4} fillHeight fillWidth>
      <Flex flexDirection="row" justifyContent="space-between" w="full">
        <StatDisplay label="Sys. Slots" value={`${usedSystemSlots}/${stats?.system_slots || 0}`} />
        <StatDisplay label="Mod. Slots" value={`${usedModuleSlots}/${stats?.module_slots || 0}`} />
        <StatDisplay label="Cargo Cap" value={`${totalCargo}/${stats?.cargo_cap || 0}`} />
        <StatDisplay label="TL" value={stats?.tech_level || 0} />
        <StatDisplay label="SV" value={stats?.salvage_value || 0} />
      </Flex>
    </RoundedBox>
  )
}
