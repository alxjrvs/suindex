import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { EntityDisplay } from '../../entity/EntityDisplay'
import type { SURefAbilityTreeRequirement } from 'salvageunion-reference'

interface AbilityTreeRequirementDisplayProps {
  data: SURefAbilityTreeRequirement
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
}

export function AbilityTreeRequirementDisplay({
  data,
  compact = false,
  collapsible = false,
  defaultExpanded = true,
  onClick,
}: AbilityTreeRequirementDisplayProps) {
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
      compact={compact}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      onClick={onClick}
    >
      <VStack gap={3} alignItems="stretch">
        <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
          Requirements
        </Heading>
        <Box bg="su.white" borderWidth="2px" borderColor="su.black" borderRadius="md" p={3}>
          <Text color="su.black">
            {data.requirement && data.requirement.length > 0 ? (
              <>
                <Text as="span" fontWeight="bold" color="su.brick">
                  Must have all abilities from one of the following:{' '}
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
              </>
            ) : (
              <Text as="span" fontStyle="italic" color="su.brick">
                No requirements specified
              </Text>
            )}
          </Text>
        </Box>
      </VStack>
    </EntityDisplay>
  )
}
