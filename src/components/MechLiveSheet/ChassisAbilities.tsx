import { Box, Text, VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { SheetDisplay } from '../shared/SheetDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'

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
      rightContent={<StatDisplay label="Abilities" value={totalSalvageValue} disabled={disabled} />}
      bg="su.green"
      title="Abilities"
      disabled={!chassis}
    >
      <VStack gap={3} alignItems="stretch" w="full">
        {(
          chassis?.chassisAbilities || [
            {
              name: '',
              description: 'No chassis selected.',
              options: [{ label: '', value: '' }],
            },
          ]
        ).map((ability, idx) => (
          <SheetDisplay key={idx} label={ability.name || undefined} disabled={disabled}>
            <Text lineHeight="relaxed">{ability.description}</Text>
            {'options' in ability &&
              ability.options &&
              Array.isArray(ability.options) &&
              ability.options.length > 0 && (
                <VStack mt={3} ml={4} gap={1} alignItems="stretch">
                  {ability.options.map((option, optIndex) => (
                    <Box key={optIndex}>
                      <Text as="span" fontWeight="bold">
                        {option.label}
                        {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                      </Text>{' '}
                      {option.value}
                    </Box>
                  ))}
                </VStack>
              )}
          </SheetDisplay>
        ))}
      </VStack>
    </RoundedBox>
  )
}
