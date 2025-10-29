import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { EntityDisplay } from '../../entity/EntityDisplay'
import type { SURefAbilityTreeRequirement } from 'salvageunion-reference'

interface AbilityTreeRequirementDisplayProps {
  data: SURefAbilityTreeRequirement
}

export function AbilityTreeRequirementDisplay({ data }: AbilityTreeRequirementDisplayProps) {
  const getHeaderColor = () => {
    if (data.name.toLowerCase().includes('legendary')) {
      return 'su.pink'
    } else if (
      data.name.toLowerCase().includes('advanced') ||
      data.name.toLowerCase().includes('hybrid')
    ) {
      return 'su.brick'
    }
    return 'su.orange'
  }

  return (
    <EntityDisplay
      schemaName="ability-tree-requirements"
      data={data}
      headerColor={getHeaderColor()}
    >
      <VStack gap={3} alignItems="stretch">
        <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
          Requirements
        </Heading>
        <Box bg="su.white" borderWidth="2px" borderColor="su.black" borderRadius="md" p={3}>
          <Text color="su.black">
            <Text as="span" fontWeight="bold" color="su.brick">
              Must have all abilities from:{' '}
            </Text>
            {data.requirement.map((req, index) => (
              <Text as="span" key={index}>
                {index > 0 && ', '}
                <Text as="span" fontWeight="bold">
                  {req}
                </Text>
              </Text>
            ))}
            {' tree'}
            {data.requirement.length > 1 ? 's' : ''}
          </Text>
        </Box>
      </VStack>
    </EntityDisplay>
  )
}
