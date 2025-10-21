import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../shared/StyledHeading'
import type { Crawler } from 'salvageunion-reference'

interface CrawlerAbilitiesProps {
  crawler: Crawler | undefined
}

export function CrawlerAbilities({ crawler }: CrawlerAbilitiesProps) {
  return (
    <Box mb={6}>
      <VStack gap={3} alignItems="stretch">
        <Heading as="h2">Abilities</Heading>
        {(
          crawler?.abilities || [
            {
              name: '',
              description: 'No crawler type selected.',
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
              <Heading as="h3" mb={2}>
                {ability.name}
              </Heading>
            )}
            {ability.description && (
              <Text color="#2d3e36" lineHeight="relaxed">
                {ability.description}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
