import { Box, Grid, Text, VStack } from '@chakra-ui/react'
import { Heading } from './shared/StyledHeading'
import { Frame } from './shared/Frame'
import type { CrawlerBay } from 'salvageunion-reference'

interface CrawlerBayDisplayProps {
  data: CrawlerBay
}

export function CrawlerBayDisplay({ data }: CrawlerBayDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-pink)"
      description={data.description}
      showSidebar={false}
    >
      <VStack gap={4} alignItems="stretch">
        {/* Operator Information */}
        <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
          <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
            <Box>
              <Text as="span" fontWeight="bold" color="su.black">
                Operator Position:{' '}
              </Text>
              <Text as="span" color="su.black">
                {data.operatorPosition}
              </Text>
            </Box>
            <Box>
              <Text as="span" fontWeight="bold" color="su.black">
                Operator HP:{' '}
              </Text>
              <Text as="span" color="su.black">
                {data.operatorHitPoints}
              </Text>
            </Box>
          </Grid>
        </Box>

        {/* Damaged Effect */}
        {data.damagedEffect && (
          <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick" mb={2}>
              Damaged Effect
            </Heading>
            <Text color="su.black">{data.damagedEffect}</Text>
          </Box>
        )}

        {/* Abilities */}
        {data.abilities && data.abilities.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick">
              Abilities
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

        {/* Tech Level Effects */}
        {data.techLevelEffects && data.techLevelEffects.length > 0 && (
          <VStack gap={3} alignItems="stretch">
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick">
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

        {/* Roll Table */}
        {data.rollTable && (
          <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick" mb={2}>
              Roll Table
            </Heading>
            <VStack gap={1} alignItems="stretch">
              {Object.entries(data.rollTable)
                .filter(([key]) => key !== 'type')
                .map(([roll, result]) => (
                  <Text key={roll} color="su.black">
                    <Text as="span" fontWeight="bold">
                      {roll}:{' '}
                    </Text>
                    {result}
                  </Text>
                ))}
            </VStack>
          </Box>
        )}

        {/* Notes */}
        {data.notes && (
          <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
            <Heading as="h3" fontSize="lg" fontWeight="bold" color="su.brick" mb={2}>
              Notes
            </Heading>
            <Text color="su.black">{data.notes}</Text>
          </Box>
        )}
      </VStack>
    </Frame>
  )
}
