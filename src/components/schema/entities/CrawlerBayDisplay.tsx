import { Box, VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { Text } from '../../base/Text'
import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'

interface CrawlerBayDisplayProps {
  data: SURefCrawlerBay
}

export function CrawlerBayDisplay({ data }: CrawlerBayDisplayProps) {
  return (
    <EntityDisplay data={data} headerColor="su.pink">
      <VStack gap={4} alignItems="stretch">
        {data.damagedEffect && (
          <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
            <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick" mb={2}>
              Damaged Effect
            </Heading>
            <Text color="su.black">{data.damagedEffect}</Text>
          </Box>
        )}

        {data.techLevelEffects && data.techLevelEffects.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
              Tech Level Effects
            </Heading>
            {data.techLevelEffects.map((effect, index) => (
              <Box
                key={index}
                bg="su.white"
                borderWidth="1px"
                borderColor="su.black"
                borderRadius="md"
                p={3}
              >
                <Text fontWeight="bold" color="su.black">
                  Tech Level {effect.techLevelMin}
                  {effect.techLevelMax !== effect.techLevelMin && `-${effect.techLevelMax}`}
                </Text>
                <Text color="su.black" mt={1}>
                  {effect.effect}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </EntityDisplay>
  )
}
