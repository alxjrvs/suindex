import { Box, Text, VStack, Heading } from '@chakra-ui/react'
import type { Chassis } from 'salvageunion-reference'

interface ChassisAbilitiesProps {
  chassis: Chassis | undefined
}

export function ChassisAbilities({ chassis }: ChassisAbilitiesProps) {
  return (
    <Box mb={6}>
      <Text
        as="label"
        display="block"
        fontSize="sm"
        fontWeight="bold"
        color="#e8e5d8"
        mb={2}
        textTransform="uppercase"
      >
        Chassis Ability
      </Text>
      <VStack gap={3} alignItems="stretch">
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
            bg="#e8e5d8"
            borderWidth="2px"
            borderColor="#2d3e36"
            borderRadius="2xl"
            p={4}
          >
            {ability.name && (
              <Heading as="h3" fontWeight="bold" color="#2d3e36" fontSize="lg" mb={2}>
                {ability.name}
              </Heading>
            )}
            {ability.description && (
              <Text color="#2d3e36" lineHeight="relaxed">
                {ability.description}
              </Text>
            )}
            {'options' in ability &&
              ability.options &&
              Array.isArray(ability.options) &&
              ability.options.length > 0 && (
                <VStack mt={3} ml={4} gap={1} alignItems="stretch">
                  {ability.options.map((option, optIndex) => (
                    <Box key={optIndex} color="#2d3e36">
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
    </Box>
  )
}
