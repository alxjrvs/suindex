import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import type { Chassis } from 'salvageunion-reference'

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
    <Flex flexDirection="row" justifyContent="space-between">
      <StatDisplay label="System Slots" value={`${usedSystemSlots}/${stats?.system_slots || 0}`} />
      <StatDisplay label="Module Slots" value={`${usedModuleSlots}/${stats?.module_slots || 0}`} />
      <StatDisplay label="Cargo Cap" value={`${totalCargo}/${stats?.cargo_cap || 0}`} />
      <StatDisplay label="Tech Level" value={stats?.tech_level || 0} />
      <StatDisplay label="Salvage Value" value={stats?.salvage_value || 0} />
    </Flex>
  )
}
