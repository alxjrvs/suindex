import { VStack, Flex } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import {
  getChassisAbilities,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
} from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'
import { NestedActionDisplay } from '../entity/NestedActionDisplay'

interface ChassisAbilitiesProps {
  chassis: SURefChassis | undefined
  totalSalvageValue: number
  disabled?: boolean
}

export function ChassisAbilities({
  totalSalvageValue,
  chassis,
  disabled = false,
}: ChassisAbilitiesProps) {
  const chassisAbilities = chassis ? getChassisAbilities(chassis) : undefined

  return (
    <RoundedBox
      rightContent={
        <Flex flexDirection="row" justifyContent="flex-end" gap={4}>
          <StatDisplay
            label="Sys."
            bottomLabel="Slots"
            value={chassis ? (getSystemSlots(chassis) ?? 0) : 0}
            disabled={disabled}
          />
          <StatDisplay
            label="Mod."
            bottomLabel="Slots"
            value={chassis ? (getModuleSlots(chassis) ?? 0) : 0}
            disabled={disabled}
          />
          <StatDisplay
            label="Cargo"
            bottomLabel="Cap"
            value={chassis ? (getCargoCapacity(chassis) ?? 0) : 0}
            disabled={disabled}
          />
          <StatDisplay
            label="Cargo"
            bottomLabel="Value"
            value={totalSalvageValue}
            disabled={disabled}
            hoverText="The combined Salvage Value of the chassis and all attached systems and modules, irrespective of tech value"
          />
        </Flex>
      }
      bg="su.green"
      title="Chassis Abilities"
      disabled={!chassis}
    >
      <VStack gap={3} alignItems="stretch" w="full">
        {(
          chassisAbilities || [
            {
              id: 'no-chassis',
              name: '',
              content: [{ type: 'paragraph', value: 'No chassis selected.' }],
            },
          ]
        ).map((ability, idx) => (
          <NestedActionDisplay key={idx} data={ability} compact />
        ))}
      </VStack>
    </RoundedBox>
  )
}
