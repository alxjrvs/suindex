import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { ActionDisplay } from './shared/ActionDisplay'
import type { Squad } from 'salvageunion-reference'

interface SquadDisplayProps {
  data: Squad
}

export function SquadDisplay({ data }: SquadDisplayProps) {
  const stats = []
  if (data.hitPoints !== undefined) {
    stats.push({ label: 'HP', value: data.hitPoints.toString() })
  }
  if (data.structurePoints !== undefined) {
    stats.push({ label: 'SP', value: data.structurePoints.toString() })
  }

  return (
    <Frame
      header={data.name}
      headerContent={
        stats.length > 0 ? (
          <Box ml="auto" pb={6} overflow="visible">
            <StatList stats={stats} up={false} />
          </Box>
        ) : undefined
      }
      showSidebar={false}
    >
      {data.description && (
        <Box mb={4} p={3} borderWidth="2px" borderColor="su.black" bg="su.white">
          <Text color="su.black">{data.description}</Text>
        </Box>
      )}

      {data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" textTransform="uppercase">
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <Box key={index} borderWidth="2px" borderColor="su.black" bg="su.white">
              <Box
                bg="su.brick"
                color="su.white"
                px={3}
                py={2}
                fontWeight="bold"
                textTransform="uppercase"
              >
                {ability.name}
              </Box>

              <VStack gap={2} alignItems="stretch" p={3}>
                <ActionDisplay action={ability} />

                {'description' in ability && ability.description ? (
                  <Box pt={2} borderTopWidth="2px" borderColor="su.black">
                    <Text color="su.black">{ability.description}</Text>
                  </Box>
                ) : null}

                {'effect' in ability && ability.effect && typeof ability.effect === 'string' ? (
                  <Box pt={2} borderTopWidth="2px" borderColor="su.black">
                    <Text color="su.black" fontStyle="italic">
                      {ability.effect}
                    </Text>
                  </Box>
                ) : null}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}

      <Box mt={4} pt={3} borderTopWidth="2px" borderColor="su.black" fontSize="sm" color="su.black">
        <Text as="span" fontWeight="bold" textTransform="uppercase">
          {data.source}
        </Text>{' '}
        • Page {data.page}
      </Box>
    </Frame>
  )
}
