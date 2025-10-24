import { Box, Text, VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { SheetDisplay } from '../shared/SheetDisplay'

interface ChassisAbilitiesProps {
  chassis: SURefChassis | undefined
}

export function ChassisAbilities({ chassis }: ChassisAbilitiesProps) {
  return (
    <VStack gap={3} alignItems="stretch" w="full">
      {(
        chassis?.chassis_abilities || [
          {
            name: '',
            description: 'No chassis selected.',
            options: [{ label: '', value: '' }],
          },
        ]
      ).map((ability, idx) => (
        <SheetDisplay key={idx} label={ability.name || undefined}>
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
  )
}
