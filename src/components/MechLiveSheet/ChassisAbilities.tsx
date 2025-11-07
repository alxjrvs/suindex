import { VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
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
  return (
    <RoundedBox
      rightContent={
        <StatDisplay label="Total" bottomLabel="SV" value={totalSalvageValue} disabled={disabled} />
      }
      bg="su.green"
      title="Abilities"
      disabled={!chassis}
    >
      <VStack gap={3} alignItems="stretch" w="full">
        {(
          chassis?.actions || [
            {
              id: 'no-chassis',
              name: '',
              description: 'No chassis selected.',
              options: [{ label: '', value: '' }],
            },
          ]
        ).map((ability, idx) => (
          <NestedActionDisplay key={idx} data={ability} compact />
        ))}
      </VStack>
    </RoundedBox>
  )
}
