import { VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'
import { EntityChassisAbility } from '../entity/EntityDisplay/EntityChassisAbility'

interface ChassisAbilitiesProps {
  chassis: SURefChassis | undefined
  stats: SURefChassis['stats'] | undefined
  totalSalvageValue: number
  disabled?: boolean
}

export function ChassisAbilities({
  totalSalvageValue,
  chassis,
  disabled = false,
}: ChassisAbilitiesProps) {
  console.log('Chassis abilities:', chassis)
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
              name: '',
              description: 'No chassis selected.',
              options: [{ label: '', value: '' }],
            },
          ]
        ).map((ability, idx) => (
          <EntityChassisAbility key={idx} action={ability} compact disabled={disabled} />
        ))}
      </VStack>
    </RoundedBox>
  )
}
