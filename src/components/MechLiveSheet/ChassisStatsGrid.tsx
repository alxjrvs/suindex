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
}

export function ChassisStatsGrid({
  stats,
  usedSystemSlots,
  usedModuleSlots,
  totalCargo,
  disabled = false,
}: ChassisStatsGridProps) {
  return (
    <RoundedBox bg="su.green" padding={4} fillHeight fillWidth disabled={disabled}>
      <Flex flexDirection="row" justifyContent="space-between" w="full">
        <StatDisplay
          label="Sys. Slots"
          value={`${usedSystemSlots}/${stats?.system_slots || 0}`}
          disabled={disabled}
        />
        <StatDisplay
          label="Mod. Slots"
          value={`${usedModuleSlots}/${stats?.module_slots || 0}`}
          disabled={disabled}
        />
        <StatDisplay
          label="Cargo Cap"
          value={`${totalCargo}/${stats?.cargo_cap || 0}`}
          disabled={disabled}
        />
        <StatDisplay label="TL" value={stats?.tech_level || 0} disabled={disabled} />
        <StatDisplay label="SV" value={stats?.salvage_value || 0} disabled={disabled} />
      </Flex>
    </RoundedBox>
  )
}
