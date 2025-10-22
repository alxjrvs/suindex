import { Box, Text, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import type { Creature } from 'salvageunion-reference'
import { formatTraits as formatTraitsArray } from '../utils/displayUtils'

interface CreatureDisplayProps {
  data: Creature
}

function formatTraits(traits?: Creature['traits']): string {
  if (!traits || traits.length === 0) return ''
  return formatTraitsArray(traits).join(', ')
}

export function CreatureDisplay({ data }: CreatureDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerColor="var(--color-su-orange)"
      description={data.description}
      headerContent={
        <Box ml="auto" pb={6} overflow="visible">
          <StatList stats={[{ label: 'Hit Points', value: data.hitPoints }]} up={false} />
        </Box>
      }
      showSidebar={false}
    >
      {data.traits && data.traits.length > 0 && (
        <Box bg="su.white" borderWidth="1px" borderColor="su.black" borderRadius="md" p={3}>
          <Text as="span" fontWeight="bold" color="su.brick">
            Traits:{' '}
          </Text>
          <Text as="span" color="su.black">
            {formatTraits(data.traits)}
          </Text>
        </Box>
      )}

      {data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" fontSize="lg" fontWeight="bold" color="su.brick">
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

              <VStack gap={1} alignItems="stretch">
                {ability.range && (
                  <Text color="su.black">
                    <Text as="span" fontWeight="bold" color="su.brick">
                      Range:{' '}
                    </Text>
                    {ability.range}
                  </Text>
                )}
                {ability.damage && (
                  <Text color="su.black">
                    <Text as="span" fontWeight="bold" color="su.brick">
                      Damage:{' '}
                    </Text>
                    {ability.damage.amount}
                    {ability.damage.type}
                  </Text>
                )}
                {'traits' in ability && ability.traits && ability.traits.length > 0 && (
                  <Text color="su.black">
                    <Text as="span" fontWeight="bold" color="su.brick">
                      Traits:{' '}
                    </Text>
                    {formatTraits(ability.traits)}
                  </Text>
                )}
              </VStack>

              {'description' in ability && ability.description && (
                <Text color="su.black" pt={2} borderTopWidth="1px" borderColor="su.black">
                  {ability.description}
                </Text>
              )}
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
