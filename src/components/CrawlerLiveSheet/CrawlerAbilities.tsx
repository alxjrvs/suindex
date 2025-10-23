import { Box, Text, VStack } from '@chakra-ui/react'
import type { Crawler } from 'salvageunion-reference'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'

interface CrawlerAbilitiesProps {
  crawler: Crawler | undefined
}

export function CrawlerAbilities({ crawler }: CrawlerAbilitiesProps) {
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
    >
      <VStack gap={3} alignItems="stretch" w="full">
        <Heading level="h2">Abilities</Heading>
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
            bg="bg.input"
            borderWidth="2px"
            borderColor="fg.input"
            borderRadius="2xl"
            p={4}
          >
            {ability.name && (
              <Heading level="h3" mb={2}>
                {ability.name}
              </Heading>
            )}
            {ability.description && (
              <Text color="fg.input" lineHeight="relaxed">
                {ability.description}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    </RoundedBox>
  )
}
