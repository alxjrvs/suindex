import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import type { Crawler } from 'salvageunion-reference'

interface CrawlerDisplayProps {
  data: Crawler
}

export function CrawlerDisplay({ data }: CrawlerDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-orange)"
      description={data.description}
      showSidebar={false}
    >
      {data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick">
            Crawler Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <VStack
              key={index}
              gap={2}
              alignItems="stretch"
              bg="su.white"
              borderWidth="1px"
              borderColor="su.black"
              borderRadius="md"
              p={3}
            >
              <Text fontWeight="bold" color="su.black" fontSize="lg">
                {ability.name}
              </Text>
              <Text color="su.black">{ability.description}</Text>
            </VStack>
          ))}
        </VStack>
      )}

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
