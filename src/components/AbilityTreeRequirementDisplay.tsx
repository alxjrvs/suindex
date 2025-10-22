import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from './shared/StyledHeading'
import { Frame } from './shared/Frame'

interface AbilityTreeRequirementData {
  tree: string
  requirement: string[]
  page: number
}

interface AbilityTreeRequirementDisplayProps {
  data: AbilityTreeRequirementData
}

export function AbilityTreeRequirementDisplay({ data }: AbilityTreeRequirementDisplayProps) {
  const getHeaderColor = () => {
    if (data.tree.toLowerCase().includes('legendary')) {
      return 'var(--color-su-pink)'
    } else if (
      data.tree.toLowerCase().includes('advanced') ||
      data.tree.toLowerCase().includes('hybrid')
    ) {
      return 'var(--color-su-brick)'
    }
    return 'var(--color-su-orange)'
  }

  return (
    <Frame header={`${data.tree} Tree`} headerColor={getHeaderColor()} showSidebar={false}>
      <VStack gap={3} alignItems="stretch">
        <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick">
          Requirements
        </Heading>
        <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
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

      <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
        <Text as="span" fontWeight="bold" color="su.brick">
          Page:
        </Text>
        <Text as="span" color="su.black" ml={2}>
          {data.page}
        </Text>
      </Box>
    </Frame>
  )
}
