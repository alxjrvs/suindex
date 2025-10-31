import { VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'
import { EntityDisplay } from '../entity/EntityDisplay'

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
          <EntityDisplay key={idx} data={ability} disabled={disabled} schemaName="actions" />
        ))}
      </VStack>
    </RoundedBox>
  )
}
