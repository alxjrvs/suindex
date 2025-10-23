import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import type { Chassis } from 'salvageunion-reference'

interface ChassisAbilitiesProps {
  chassis: Chassis | undefined
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
        <Box
          key={idx}
          bg="bg.input"
          borderWidth="3px"
          borderColor="su.black"
          borderRadius="2xl"
          p={4}
        >
          {ability.name && (
            <Heading level="h3" fontWeight="bold" color="fg.input" fontSize="lg" mb={2}>
              {ability.name}
            </Heading>
          )}
          {ability.description && (
            <Text color="fg.input" lineHeight="relaxed">
              {ability.description}
            </Text>
          )}
          {'options' in ability &&
            ability.options &&
            Array.isArray(ability.options) &&
            ability.options.length > 0 && (
              <VStack mt={3} ml={4} gap={1} alignItems="stretch">
                {ability.options.map((option, optIndex) => (
                  <Box key={optIndex} color="fg.input">
                    <Text as="span" fontWeight="bold">
                      {option.label}
                      {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                    </Text>{' '}
                    {option.value}
                  </Box>
                ))}
              </VStack>
            )}
        </Box>
      ))}
    </VStack>
  )
}
